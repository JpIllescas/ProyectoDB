import pika
import os 

def send_message(queue, message):
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
    channel.basic_publish(exchange='', routing_key=queue, body=message)
    connection.close()
    