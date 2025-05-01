from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import dotenv

dotenv.load_dotenv()

Base = declarative_base()

# Crear el engine y la sesión globalmente
DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

try:
    # Construir la URL de conexión para CockroachDB
    DATABASE_URL = f"cockroachdb://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=disable"
    engine = create_engine(DATABASE_URL, echo=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    print("Conexión a CockroachDB establecida")
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")
    engine = None
    SessionLocal = None

# Función para obtener una sesión de base de datos
def get_db_connection():
    try:
        return engine, SessionLocal, Base
    except Exception as e:
        print(f"Error creando la sesión de base de datos: {e}")
        return None, None, None
