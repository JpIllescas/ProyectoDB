from models.tracking import Pedido

def get_pedidos(SessionLocal):
    session = SessionLocal()
    try:
        pedidos = session.query(Pedido).all()
        return [
            {
                "id_pedido": p.id_pedido,
                "fecha": p.fecha.isoformat(),
                "estado": p.estado,
                "id_cliente": p.id_cliente
            } for p in pedidos
        ], 200
    except Exception as e:
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def get_pedido_by_id(id, SessionLocal):
    session = SessionLocal()
    try:
        pedido = session.query(Pedido).filter_by(id_pedido=id).first()
        if pedido:
            return {
                "id_pedido": pedido.id_pedido,
                "fecha": pedido.fecha.isoformat(),
                "estado": pedido.estado,
                "id_cliente": pedido.id_cliente
            }, 200
        else:
            return {"error": "Pedido no encontrado"}, 404
    except Exception as e:
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def create_pedido(data, SessionLocal):
    session = SessionLocal()
    fecha = data.get("fecha")  # Debe ser string 'YYYY-MM-DD' o None
    estado = data.get("estado")
    id_cliente = data.get("id_cliente")

    if not all([estado, id_cliente]):
        return {"error": "Todos los campos son obligatorios: estado, id_cliente"}, 400

    try:
        from datetime import date
        pedido = Pedido(
            fecha=date.fromisoformat(fecha) if fecha else date.today(),
            estado=estado,
            id_cliente=id_cliente
        )
        session.add(pedido)
        session.commit()
        return {"message": "Pedido creado correctamente", "id_pedido": pedido.id_pedido}, 201
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def update_pedido(id, data, SessionLocal):
    session = SessionLocal()
    try:
        pedido = session.query(Pedido).filter_by(id_pedido=id).first()
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404

        estado = data.get("estado")
        id_cliente = data.get("id_cliente")
        fecha = data.get("fecha")

        if estado: pedido.estado = estado
        if id_cliente: pedido.id_cliente = id_cliente
        if fecha:
            from datetime import date
            pedido.fecha = date.fromisoformat(fecha)

        session.commit()
        return {"message": "Pedido actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def delete_pedido(id, SessionLocal):
    session = SessionLocal()
    try:
        pedido = session.query(Pedido).filter_by(id_pedido=id).first()
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404

        session.delete(pedido)
        session.commit()
        return {"message": "Pedido eliminado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()