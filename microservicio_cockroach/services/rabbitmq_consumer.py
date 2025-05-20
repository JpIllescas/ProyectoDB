import pika
import os
import time

def consume_messages(queue, callback):
    credentials = pika.PlainCredentials(
        os.getenv("RABBITMQ_USER"), os.getenv("RABBITMQ_PASSWORD")
    )
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=os.getenv("RABBITMQ_HOST"),
            port=int(os.getenv("RABBITMQ_PORT")),
            credentials=credentials,
        )
    )
    for attempt in range(10):
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=os.getenv("RABBITMQ_HOST"),
                    port=int(os.getenv("RABBITMQ_PORT")),
                    credentials=credentials,
                )
            )
            break
        except pika.exceptions.AMQPConnectionError:
            print(f"RabbitMQ no disponible, reintentando en 5 segundos... (intento {attempt+1}/10)")
            time.sleep(5)
    else:
        print("No se pudo conectar a RabbitMQ después de varios intentos.")
        return

    channel = connection.channel()
    channel.queue_declare(queue=queue, durable=True)
    channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)
    print(f'Esperando mensajes en la cola "{queue}"...')
    channel.start_consuming()