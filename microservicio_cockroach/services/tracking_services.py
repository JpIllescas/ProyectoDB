from flask import jsonify 
from models.tracking import TrackingEvento

def get_all_tracking(SessionLocal):
    session = SessionLocal()
    try:
        eventos = session.query(TrackingEvento).all()
        data = [
            {
                "id": e.id,
                "id_pedido": e.id_pedido,
                "estado": e.estado,
                "ubicacion": e.ubicacion,
                "timestamp": e.timestamp.isoformat()
            }
            for e in eventos
        ]
        return data, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        session.close()
        
def create_tracking(data, SessionLocal):
    session = SessionLocal()
    id_pedido = data.get("id_pedido")
    estado = data.get("estado")
    ubicacion = data.get("ubicacion")
    
    if not id_pedido or not estado or not ubicacion:
        return {"error": "Los campos 'id_pedido', 'estado' y 'ubicacion' son obligatorios"}, 400

    try:
        evento = TrackingEvento(id_pedido=id_pedido, estado=estado, ubicacion=ubicacion)
        session.add(evento)
        session.commit()
        return {"message": "Evento de tracking registrado correctamente"}, 201
    except Exception as e:
        session.rollback()
        return {"error": str(e)}, 500
    finally:
        session.close()
