from flask import Flask
from flask_cors import CORS
from routes import main_routes
from config.config import get_db_connection, Base
from models import *
import threading
from replication.rabbitmq_consumer import iniciar_consumidor

app = Flask(__name__)
CORS(app)

engine, SessionLocal, _ = get_db_connection()

if engine:
    Base.metadata.create_all(bind=engine)
    app.register_blueprint(main_routes.main_bp)
    app.config["SESSION_LOCAL"] = SessionLocal  
else:
    print("No se pudo conectar a la base de datos. Verifica tu archivo .env.")
    
# Iniciar consumidor en un hilo aparte
def run_consumidor():
    print("[*] Iniciando consumidor de RabbitMQ...")
    iniciar_consumidor()

thread = threading.Thread(target=run_consumidor)
thread.start()

if __name__ == "__main__":
    print("Iniciando servidor Flask...")
    print("Servidor Flask iniciado en http://localhost:5003")
    app.run(debug=False, port=5003, host="0.0.0.0") 