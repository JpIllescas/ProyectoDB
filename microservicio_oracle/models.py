from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey 
from sqlalchemy.orm import relationship
from config.config import Base
from datetime import date 

class Cliente(Base): 
    __tablename__ = "clientes"
    
    id_cliente = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    gmail = Column(String(100), nullable=False, unique=True)
    telefono = Column(String(15), nullable=False)

    # Relación con la tabla de pedidos
    pedidos = relationship("Pedido", back_populates="cliente")
    
class Producto(Base):
    __tablename__ = "productos"
    
    id_producto = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    precio = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False)

    # Relación con la tabla de pedidos
    pedidos = relationship("Pedido", back_populates="producto")

class Pedido(Base):
    __tablename__ = "pedidos"
    
    id_pedido = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(Date, nullable=False, default=date.today)
    estado = Column(String(50), nullable=False)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)
    
    cliente = relationship("Cliente", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido")
    
class DetallePedido(Base):
    __tablename__ = "detalle_pedido"

    id_detalle = Column(Integer, primary_key=True, autoincrement=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    
    pedido = relationship("Pedido", back_populates="detalle_pedido")
    producto = relationship("Producto", back_populates="pedidos")