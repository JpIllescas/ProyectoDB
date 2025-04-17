from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os 
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()
SessionLocal = None

def get_db_connection():
    global SessionLocal
    DB_USER = os.getenv("DB_USER")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    
    try:
        DATABASE_URL = f"cockroachdb://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=disable"
        engine = create_engine(DATABASE_URL, echo=True)
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflash=False)
        print("Conexion a CockroachDB establecida.")
        return engine, SessionLocal, Base
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None, None, None
     