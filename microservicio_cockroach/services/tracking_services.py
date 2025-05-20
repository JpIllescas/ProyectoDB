from flask import jsonify 
from models.tracking import TrackingEvento
from config.config import SessionLocal

def get_all_tracking():
    session = SessionLocal()
    try:
        eventos = session.query(TrackingEvento).all()
        return jsonify([{"id": e.id, "id_pedido": e.id_pedido, "estado": e.ubicacion, "timestamp": e.timestamp.isoformat()} for e in eventos])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
        
def create_tracking(data):
    session = SessionLocal()
    id_pedido = data.get ("id_pedido")
    estado = data.get ("estado")
    ubicacion = data.get("ubicacion")
    
    if not id_pedido or not estado or not ubicacion:
        return jsonify({"error": "Los campos 'id_pedido', 'estado' y 'ubicacion' son obligatorios"}), 400
 
    try:
        evento = TrackingEvento(id_pedido=id_pedido, estado=estado, ubicacion=ubicacion)
        session.add(evento)
        session.commit()
        return jsonify({"message": "Evento de tracking registrado correctamente"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
        