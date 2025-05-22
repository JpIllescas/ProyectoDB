from config.config import engine, Base
from models.tracking import TrackingEvento,Cliente, Pedido
from flask import Flask
from flask_cors import CORS
from config.config import get_db_connection, Base
from models.tracking import TrackingEvento, Cliente, Pedido
from routes.tracking_routes import tracking_bp
import threading
from replication.rabbitmq_consumer import iniciar_consumidor

# Conexión y creación de tablas
engine, SessionLocal, Base = get_db_connection()
if engine:
    Base.metadata.create_all(bind=engine)
else:
    print("No se pudo conectar a la base de datos.")

app = Flask (__name__)
app.config["SESSION_LOCAL"] = SessionLocal
CORS(app)
app.register_blueprint(tracking_bp)

# Iniciar consumidor en un hilo aparte
def run_consumidor():
    print("[*] Iniciando consumidor de RabbitMQ...")
    iniciar_consumidor()

thread = threading.Thread(target=run_consumidor, daemon=True)
thread.start()

if __name__ == "__main__":
    print("Iniciando servidor Flask...")
    app.run(debug=True, port=5002, host = "0.0.0.0")

