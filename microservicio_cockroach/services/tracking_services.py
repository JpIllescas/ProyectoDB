# File: services/tracking_services.py
from models.tracking import TrackingEvento

# GET all events (serialize id as string)
def get_all_tracking(SessionLocal):
    session = SessionLocal()
    try:
        eventos = session.query(TrackingEvento).all()
        data = []
        for e in eventos:
            data.append({
                "id":         str(e.id),
                "id_pedido":  e.id_pedido,
                "id_cliente": e.id_cliente,
                "estado":     e.estado,
                "ubicacion":  e.ubicacion,
                "timestamp":  e.timestamp.isoformat()
            })
        return data, 200
    except Exception as ex:
        return {"error": str(ex)}, 500
    finally:
        session.close()

# GET single event by id
def get_tracking_by_id(iid, SessionLocal):
    session = SessionLocal()
    try:
        evento = session.query(TrackingEvento).filter(TrackingEvento.id == iid).first()
        if not evento:
            return {"error": f"No existe el evento de tracking con id {iid}"}, 404
        data = {
            "id":         str(evento.id),
            "id_pedido":  evento.id_pedido,
            "id_cliente": evento.id_cliente,
            "estado":     evento.estado,
            "ubicacion":  evento.ubicacion,
            "timestamp":  evento.timestamp.isoformat()
        }
        return data, 200
    except Exception as ex:
        return {"error": str(ex)}, 500
    finally:
        session.close()

# CREATE event
def create_tracking(data, SessionLocal):
    session = SessionLocal()
    id_pedido  = data.get("id_pedido")
    id_cliente = data.get("id_cliente")
    estado     = data.get("estado")
    ubicacion  = data.get("ubicacion")
    if not id_pedido or not id_cliente or not estado:
        return {"error": "Los campos 'id_pedido', 'id_cliente' y 'estado' son obligatorios"}, 400
    try:
        evento = TrackingEvento(
            id_pedido=id_pedido,
            id_cliente=id_cliente,
            estado=estado,
            ubicacion=ubicacion
        )
        session.add(evento)
        session.commit()
        return {"message": "Evento de tracking registrado", "id": str(evento.id)}, 201
    except Exception as ex:
        session.rollback()
        return {"error": str(ex)}, 500
    finally:
        session.close()

# UPDATE event
def update_tracking(data, SessionLocal):
    session = SessionLocal()
    iid       = data.get("id")
    estado    = data.get("estado")
    ubicacion = data.get("ubicacion")
    if iid is None or not estado:
        return {"error": "Los campos 'id' y 'estado' son obligatorios"}, 400
    try:
        evento = session.query(TrackingEvento).filter(TrackingEvento.id == iid).first()
        if not evento:
            return {"error": f"No existe el evento de tracking con id {iid}"}, 404
        evento.estado    = estado
        evento.ubicacion = ubicacion
        session.commit()
        return {"message": "Evento de tracking actualizado"}, 200
    except Exception as ex:
        session.rollback()
        return {"error": str(ex)}, 500
    finally:
        session.close()

# DELETE event
def delete_tracking(iid, SessionLocal):
    session = SessionLocal()
    try:
        evento = session.query(TrackingEvento).filter(TrackingEvento.id == iid).first()
        if not evento:
            return {"error": f"No existe el evento de tracking con id {iid}"}, 404
        session.delete(evento)
        session.commit()
        return {"message": "Evento de tracking eliminado"}, 200
    except Exception as ex:
        session.rollback()
        return {"error": str(ex)}, 500
    finally:
        session.close()