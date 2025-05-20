import json
import time
from services.rabbitmq_consumer import consume_messages
from config.config import SessionLocal
from models.tracking import TrackingEvento

def process_pedido(ch, method, properties, body):
    print("Mensaje recibido:", body.decode())
    max_retries = 3
    for attempt in range(max_retries):
        try:
            data = json.loads(body.decode())
            session = SessionLocal()
            evento = TrackingEvento(
                id_pedido=data["id_pedido"],
                estado=data["estado"],
                # Puedes agregar más campos si tu modelo los tiene
            )
            session.add(evento)
            session.commit()
            print("Evento guardado en CockroachDB")
            break
        except Exception as e:
            print(f"Error al procesar el mensaje (intento {attempt+1}):", e)
            time.sleep(2)  # Espera antes de reintentar
        finally:
            session.close()
    else:
        print("No se pudo procesar el mensaje después de varios intentos.")

if __name__ == "__main__":
    consume_messages("pedidos_queue", process_pedido)