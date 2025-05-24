from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Date
from sqlalchemy.orm import relationship
from config.config import Base

class Cliente(Base):
    __tablename__ = "clientes"
    
    id_cliente = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    telefono = Column(String(15), nullable=False)
    email = Column(String(100), nullable=False, unique=True)

    pedidos = relationship("Pedido", back_populates="cliente", cascade="all, delete-orphan")

class Pedido(Base):
    __tablename__ = "pedidos"

    id_pedido = Column(Integer, primary_key=True)
    fecha = Column(Date, nullable=False)
    estado = Column(String(50), nullable=False)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)

    cliente = relationship("Cliente", back_populates="pedidos")
    eventos = relationship("TrackingEvento", back_populates="pedido", cascade="all, delete-orphan")

class TrackingEvento(Base):
    __tablename__ = "tracking_eventos"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)
    estado = Column(String(50), nullable=False)
    ubicacion = Column(String(100))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    pedido = relationship("Pedido", back_populates="eventos")
    cliente = relationship("Cliente")
