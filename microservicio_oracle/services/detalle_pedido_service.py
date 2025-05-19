from models import DetallePedido
from config.config import SessionLocal

def get_detalle_pedido():
    session = SessionLocal()
    try:
        detalle_pedido = session.query(DetallePedido).all()
        return [
            {
                "id_detalle": d.id_detalle,
                "id_pedido": d.id_pedido,
                "id_producto": d.id_producto,
                "cantidad": d.cantidad 
            } for d in detalle_pedido
        ], 200
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
        
def get_detalle_pedido_by_id(id):
    session = SessionLocal()
    try:
        detalle_pedido = session.query(DetallePedido).filter_by(id_detalle=id).first()
        if detalle_pedido:
            return {
                "id_detalle": detalle_pedido.id_detalle,
                "id_pedido": detalle_pedido.id_pedido,
                "id_producto": detalle_pedido.id_producto,
                "cantidad": detalle_pedido.cantidad
            }, 200
        else:
            return {"error": "Detalle de pedido no encontrado"}, 404
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
        
def create_detalle_pedido(data):
    session = SessionLocal()
    id_pedido = data.get("id_pedido")
    id_producto = data.get("id_producto")
    cantidad = data.get("cantidad")
    if not id_pedido or not id_producto or not cantidad:
        return {"error": "'id_pedido', 'id_producto' y 'cantidad' son campos obligatorios"}, 400
    try:
        detalle_pedido = DetallePedido(id_pedido=id_pedido, id_producto=id_producto, cantidad=cantidad)
        session.add(detalle_pedido)
        session.commit()
        return {
            "message": "Detalle pedido creado correctamente",
            "id_detalle": detalle_pedido.id_detalle
        }, 201
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def update_detalle_pedido(idz, data):
    session = SessionLocal()
    try:
        detalle_pedido = session.query(DetallePedido).filter_by(id_detalle=idz).first()
        if not detalle_pedido:
            return {"error": "Detalle pedido no encontrado"}, 404
        cantidad = data.get("cantidad")
        if not cantidad:
            return {"error": "'cantidad' es un campo obligatorio"}, 400
        detalle_pedido.cantidad = cantidad
        session.commit()
        return {"message": "Detalle pedido actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
