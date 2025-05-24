from models.tracking import TrackingEvento

# Obtener todos los eventos de tracking con id_cliente incluido
def get_all_tracking(SessionLocal):
    session = SessionLocal()
    try:
        eventos = session.query(TrackingEvento).all()
        data = []
        for e in eventos:
            data.append({
                "id":         e.id,
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

# Crear un nuevo evento de tracking, ahora requiere id_cliente también
def create_tracking(data, SessionLocal):
    session = SessionLocal()
    id_pedido  = data.get("id_pedido")
    id_cliente = data.get("id_cliente")
    estado     = data.get("estado")
    ubicacion  = data.get("ubicacion")

    # Validaciones básicas
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
        return {"message": "Evento de tracking registrado correctamente", "id": evento.id}, 201

    except Exception as ex:
        session.rollback()
        return {"error": str(ex)}, 500

    finally:
        session.close()

# Obtener un solo evento por id, con id_cliente incluido
def get_tracking_by_id(id, SessionLocal):
    session = SessionLocal()
    try:
        evento = session.query(TrackingEvento).filter(TrackingEvento.id == id).first()
        if not evento:
            return {"error": f"No existe el evento de tracking con el id {id}"}, 404
        data = {
            "id":         evento.id,
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

# Actualizar un evento existente
# data debe incluir "estado","ubicacion" y puede recibir id desde la ruta

def update_tracking(data, SessionLocal):
    session = SessionLocal()
    id         = data.get("id")
    estado     = data.get("estado")
    ubicacion  = data.get("ubicacion")

    if not id or not estado:
        return {"error": "Los campos 'id' y 'estado' son obligatorios"}, 400

    try:
        evento = session.query(TrackingEvento).filter(TrackingEvento.id == id).first()
        if not evento:
            return {"error": f"No existe el evento de tracking con el id {id}"}, 404

        evento.estado    = estado
        evento.ubicacion = ubicacion
        session.commit()
        return {"message": "Evento de tracking actualizado correctamente"}, 200

    except Exception as ex:
        session.rollback()
        return {"error": str(ex)}, 500

    finally:
        session.close()

# Eliminar un evento de tracking existente
def delete_tracking(id, SessionLocal):
    session = SessionLocal()
    try:
        evento = session.query(TrackingEvento).filter(TrackingEvento.id == id).first()
        if not evento:
            return {"error": f"No existe el evento de tracking con el id {id}"}, 404

        session.delete(evento)
        session.commit()
        return {"message": "Evento de tracking eliminado correctamente"}, 200

    except Exception as ex:
        session.rollback()
        return {"error": str(ex)}, 500

    finally:
        session.close()
