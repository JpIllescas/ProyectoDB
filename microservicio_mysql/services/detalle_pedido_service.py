from models import DetallePedido

def get_detalles(SessionLocal):
    session = SessionLocal()
    try:
        detalles = session.query(DetallePedido).all()
        return [
            {
                "id_detalle": d.id_detalle,
                "id_pedido": d.id_pedido,
                "id_producto": d.id_producto,
                "cantidad": d.cantidad
            } for d in detalles
        ], 200
    except Exception as e:
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def get_detalle_by_id(id, SessionLocal):
    session = SessionLocal()
    try:
        detalle = session.query(DetallePedido).filter_by(id_detalle=id).first()
        if detalle:
            return {
                "id_detalle": detalle.id_detalle,
                "id_pedido": detalle.id_pedido,
                "id_producto": detalle.id_producto,
                "cantidad": detalle.cantidad
            }, 200
        else:
            return {"error": "Detalle no encontrado"}, 404
    except Exception as e:
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def create_detalle(data, SessionLocal):
    session = SessionLocal()
    id_pedido = data.get("id_pedido")
    id_producto = data.get("id_producto")
    cantidad = data.get("cantidad")

    if not all([id_pedido, id_producto, cantidad]):
        return {"error": "Todos los campos son obligatorios: id_pedido, id_producto, cantidad"}, 400

    try:
        detalle = DetallePedido(
            id_pedido=id_pedido,
            id_producto=id_producto,
            cantidad=cantidad
        )
        session.add(detalle)
        session.commit()
        return {"message": "Detalle creado correctamente", "id_detalle": detalle.id_detalle}, 201
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def update_detalle(id, data, SessionLocal):
    session = SessionLocal()
    try:
        detalle = session.query(DetallePedido).filter_by(id_detalle=id).first()
        if not detalle:
            return {"error": "Detalle no encontrado"}, 404

        id_pedido = data.get("id_pedido")
        id_producto = data.get("id_producto")
        cantidad = data.get("cantidad")

        if id_pedido: detalle.id_pedido = id_pedido
        if id_producto: detalle.id_producto = id_producto
        if cantidad: detalle.cantidad = cantidad

        session.commit()
        return {"message": "Detalle actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def delete_detalle(id, SessionLocal):
    session = SessionLocal()
    try:
        detalle = session.query(DetallePedido).filter_by(id_detalle=id).first()
        if not detalle:
            return {"error": "Detalle no encontrado"}, 404

        session.delete(detalle)
        session.commit()
        return {"message": "Detalle eliminado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()