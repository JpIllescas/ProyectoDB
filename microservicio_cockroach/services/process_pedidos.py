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
            print("Mensaje como dict:", data)
            # Si el mensaje tiene 'data', úsalo
            if "data" in data:
                data = data["data"]
            session = SessionLocal()
            evento = TrackingEvento(
                id_pedido=data.get("id_pedido"),
                estado=data.get("estado"),
                # Si tienes más campos obligatorios, usa data.get("campo", valor_por_defecto)
            )
            session.add(evento)
            session.commit()
            print("Evento guardado en CockroachDB")
            break
        except Exception as e:
            print(f"Error al procesar el mensaje (intento {attempt+1}):", e)
            time.sleep(2)
        finally:
            session.close()
    else:
        print("No se pudo procesar el mensaje después de varios intentos.")

print("Arrancando consumidor CockroachDB para pedidos...")
if __name__ == "__main__":
    consume_messages("pedidos", process_pedido)