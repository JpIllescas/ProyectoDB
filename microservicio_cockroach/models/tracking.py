from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Date
from config.config import Base

class TrackingEvento(Base):
    __tablename__ = "tracking_eventos"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pedido = Column(Integer, nullable=False)
    estado = Column(String(50), nullable=False)
    ubicacion = Column(String(100))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Cliente(Base):
    __tablename__ = "clientes"
    
    id_cliente = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    telefono = Column(String(15), nullable=False)
    email = Column(String(100), nullable=False, unique=True)

class Pedido(Base):
    __tablename__ = "pedidos"
    id_pedido = Column(Integer, primary_key=True)
    fecha = Column(Date, nullable=False)
    estado = Column(String(50), nullable=False)
    id_cliente = Column(Integer, nullable=False)

