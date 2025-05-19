from models import Pedido  
from config.config import SessionLocal 

def get_pedidos():
    session = SessionLocal()
    try:
        pedidos = session.query(Pedido).all()
        return [
            {
                "id_pedido": p.id_pedido,
                "fecha": str(p.fecha),
                "estado": p.estado,
                "id_cliente": p.id_cliente
            } for p in pedidos
        ], 200
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def get_pedido_by_id(id):
    session = SessionLocal()
    try:
        pedido = session.query(Pedido).filter_by(id_pedido=id).first()
        if pedido:
            return {
                "id_pedido": pedido.id_pedido,
                "fecha": str(pedido.fecha),
                "estado": pedido.estado,
                "id_cliente": pedido.id_cliente
            }, 200
        else:
            return {"error": "Pedido no encontrado"}, 404
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def create_pedido(data):
    session = SessionLocal()
    estado = data.get("estado")
    id_cliente = data.get("id_cliente")
    if not estado or not id_cliente:
        return None, ({"error": "'estado' y 'id_cliente' son campos obligatorios"}, 400)
    try:
        pedido = Pedido(estado=estado, id_cliente=id_cliente)
        session.add(pedido)
        session.commit()
        pedido_id = pedido.id_pedido
        pedido_estado = pedido.estado
        response = ({"message": "Pedido creado correctamente", "id_pedido": pedido_id}, 201)
        return (pedido_id, pedido_estado), response
    except Exception as e:
        session.rollback()
        return None, ({"error": "Error interno del servidor"}, 500)
    finally:
        session.close()
    
def update_pedido(idz, data):
    session = SessionLocal()
    try:
        pedido = session.query(Pedido).filter_by(id_pedido=idz).first()
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404
        estado = data.get("estado")
        if not estado:
            return {"error": "'estado' es un campo obligatorio"}, 400
        pedido.estado = estado
        session.commit()
        return {"message": "Pedido actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
