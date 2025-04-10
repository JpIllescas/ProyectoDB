from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import dotenv

dotenv.load_dotenv()

Base = declarative_base()
SessionLocal = None  # Define SessionLocal como una variable global

def get_db_connection():
    global SessionLocal  # Usa la variable global
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_SERVICE = os.getenv("DB_SERVICE")
    
    try:
        DATABASE_URL = f"oracle+oracledb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/?service_name={DB_SERVICE}"

        engine = create_engine(DATABASE_URL, echo=True)
        SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
        
        print("Database connection established")
        return engine, SessionLocal, Base
        
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None, None, None
