from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from config.config import Base

class TrackingEvento(Base):
    __tablename__ = "tracking_eventos"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pedido = Column(Integer, nullable=False)
    estado = Column(String(50), nullable=False)
    ubicacion = Column(String(100))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    