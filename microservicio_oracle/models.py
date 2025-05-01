from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from config.config import Base, engine
from oracle_helper import OracleHelper
from datetime import date

# Define tus modelos como antes
class Cliente(Base): 
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    gmail = Column(String(100), nullable=False, unique=True)
    telefono = Column(String(15), nullable=False)

    pedidos = relationship("Pedido", back_populates="cliente")

class Producto(Base):
    __tablename__ = "productos"
    
    id_producto = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    precio = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False)

    detalles = relationship("DetallePedido", back_populates="producto")

class Pedido(Base):
    __tablename__ = "pedidos"
    
    id_pedido = Column(Integer, primary_key=True)
    fecha = Column(Date, nullable=False, default=date.today)
    estado = Column(String(50), nullable=False)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)

    cliente = relationship("Cliente", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido")

class DetallePedido(Base):
    __tablename__ = "detalle_pedido"

    id_detalle = Column(Integer, primary_key=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto"), nullable=False)
    cantidad = Column(Integer, nullable=False)

    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles")

# Crear tablas y secuencias/triggers al inicializar
Base.metadata.create_all(bind=engine)

# Usar OracleHelper para crear secuencias y triggers
helper = OracleHelper(engine)
helper.create_auto_increment("clientes", "id_cliente")
helper.create_auto_increment("productos", "id_producto")
helper.create_auto_increment("pedidos", "id_pedido")
helper.create_auto_increment("detalle_pedido", "id_detalle")
