# utils/rabbitmq_utils.py
import pika
import json
import os

user = os.getenv("RABBITMQ_USER")
password = os.getenv("RABBITMQ_PASSWORD")
host = os.getenv("RABBITMQ_HOST")
port = int(os.getenv("RABBITMQ_PORT", 5672))

def publicar_evento(model, data, action):
    try:
        mensaje = {
            "model": model,
            "action": action,
            "data": data
        }

        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host=host,
            port=port,
            credentials=pika.PlainCredentials(user, password),
        ))
        channel = connection.channel()
        # Declarar el exchange tipo fanouts
        channel.exchange_declare(exchange='replicacion_fanout', exchange_type='fanout', durable=True)
        # Publicar al exchange, no a una cola específica
        channel.basic_publish(
            exchange='replicacion_fanout',
            routing_key='',
            body=json.dumps(mensaje),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        connection.close()
        print(f"[✔] {model.upper()} publicado a RabbitMQ (fanout): {mensaje}")
    except Exception as e:
        print(f"[✖] Error publicando {model} en RabbitMQ: {e}")
