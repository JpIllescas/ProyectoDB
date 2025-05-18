from services.rabbitmq_consumer import consume_messages

def process_pedido(ch, method, properties, body):
    print("Mensaje recibido:", body.decode())
    # Aquí puedes agregar lógica para guardar el mensaje en la base de datos

if __name__ == "__main__":
    consume_messages("pedidos_queue", process_pedido)