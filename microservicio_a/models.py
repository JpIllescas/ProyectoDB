from sqlalchemy import Column, Integer, String
from .config.config import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
