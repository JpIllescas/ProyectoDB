import pika
import json
import os
from sqlalchemy.orm import sessionmaker
from models import Cliente, Producto, Pedido, DetallePedido
from config.config import engine

# Crea la sesión de base de datos
SessionLocal = sessionmaker(bind=engine)

def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        model = data.get("model")
        action = data.get("action", "create")
        model_data = data.get("data")
        session = SessionLocal()
        try:
            modelo_clase = {
                "clientes": Cliente,
                "productos": Producto,
                "pedidos": Pedido,
                "detalle_pedido": DetallePedido
            }
            if model not in modelo_clase:
                print(f"[WARN] Modelo no soportado: {model}")
                session.close()
                return

            # Determinar la clave primaria según el modelo
            pk_field = {
                "clientes": "id_cliente",
                "productos": "id_producto",
                "pedidos": "id_pedido",
                "detalle_pedido": "id_detalle"
            }[model]
            pk = model_data[pk_field]
            existente = session.query(modelo_clase[model]).filter_by(**{pk_field: pk}).first()

            if action == "delete":
                if existente:
                    session.delete(existente)
                    session.commit()
                    print(f"{model.capitalize()} eliminado: {pk}")
                else:
                    print(f"{model.capitalize()} a eliminar no existe: {pk}")
            elif action == "update":
                if existente:
                    for campo, valor in model_data.items():
                        setattr(existente, campo, valor)
                    session.commit()
                    print(f"{model.capitalize()} actualizado: {pk}")
                else:
                    print(f"{model.capitalize()} a actualizar no existe: {pk}")
            else:  # create
                if not existente:
                    nuevo = modelo_clase[model](**model_data)
                    session.add(nuevo)
                    session.commit()
                    print(f"{model.capitalize()} replicado en base de datos local: {pk}")
                else:
                    print(f"{model.capitalize()} ya existe: {pk}")
        except Exception as e:
            session.rollback()
            print(f"Error al replicar {model}: {e}")
        finally:
            session.close()
    except Exception as e:
        print(f"[ERROR] Fallo en el callback: {e}")

def iniciar_consumidor():
    try:
        print("[DEBUG] Intentando conectar a RabbitMQ...")
        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host=os.getenv("RABBITMQ_HOST"),
            port=int(os.getenv("RABBITMQ_PORT")),
            credentials=pika.PlainCredentials(
                os.getenv("RABBITMQ_USER"),
                os.getenv("RABBITMQ_PASSWORD")
            ),
            heartbeat=600,
            blocked_connection_timeout=300
        ))
        print("[DEBUG] Conexión a RabbitMQ exitosa.")
        channel = connection.channel()
        print("[DEBUG] Canal creado.")

        # Declarar el exchange tipo fanout
        channel.exchange_declare(exchange='replicacion_fanout', exchange_type='fanout', durable=True)
        # Declarar una cola única para esta sucursal (puedes personalizar el nombre)
        queue_name = 'replicacion_mysql'
        channel.queue_declare(queue=queue_name, durable=True)
        # Enlazar la cola al exchange fanout
        channel.queue_bind(exchange='replicacion_fanout', queue=queue_name)

        print("[DEBUG] Cola y binding declarados.")
        print("[*] Esperando mensajes. Para salir presiona CTRL+C")
        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        print("[DEBUG] Consumidor registrado.")
        channel.start_consuming()
        print("[!] El consumidor dejó de consumir (start_consuming terminó)")
    except Exception as e:
        print(f"[ERROR] Fallo en iniciar_consumidor: {e}")


if __name__ == "__main__":
    iniciar_consumidor()
