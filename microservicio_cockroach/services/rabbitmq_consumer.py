import pika
import os

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
    channel = connection.channel()
    channel.queue_declare(queue=queue, durable=True)
    channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)
    print(f'Esperando mensajes en la cola "{queue}"...')
    channel.start_consuming()