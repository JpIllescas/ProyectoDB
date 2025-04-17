from flask import Flask
from config.config import get_db_connection 
from models.tracking import TrackingEvento
from routes.tracking_routes import tracking_bp

app = Flask (__name__)

engine, SessionLocal, Base = get_db_connection()

if engine:
    Base.metadata.create_all(bind=engine)
    app.register_blueprint(tracking_bp)
else:
    print("No se pudo conectar a la base de datos.")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
