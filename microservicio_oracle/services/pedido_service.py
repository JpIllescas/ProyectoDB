from models import Pedido
from utils.rabbitmq_utils import publicar_evento
from datetime import date

def get_pedidos(SessionLocal):
    session = SessionLocal()
    try:
        pedidos = session.query(Pedido).all()
        return [
            {
                "id_pedido": p.id_pedido,
                "fecha": p.fecha.isoformat() if p.fecha else None,
                "estado": p.estado,
                "id_cliente": p.id_cliente
            } for p in pedidos
        ], 200
    except Exception as e:
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
                "fecha": pedido.fecha.isoformat() if pedido.fecha else None,
                "estado": pedido.estado,
                "id_cliente": pedido.id_cliente
            }, 200
        else:
            return {"error": "Pedido no encontrado"}, 404
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def create_pedido(data, SessionLocal):
    session = SessionLocal()
    from datetime import date
    fecha = data.get("fecha")
    estado = data.get("estado")
    id_cliente = data.get("id_cliente")
    if not estado or not id_cliente:
        return {"error": "'estado' e 'id_cliente' son campos obligatorios"}, 400
    try:
        pedido = Pedido(
            fecha=date.fromisoformat(fecha) if fecha else date.today(),
            estado=estado,
            id_cliente=id_cliente
        )
        session.add(pedido)
        session.commit()
        #RabbitMQ
        pedido_data = {
            "id_pedido": pedido.id_pedido,
            "fecha": pedido.fecha.isoformat() if pedido.fecha else None,
            "estado": pedido.estado,
            "id_cliente": pedido.id_cliente            
        }
        publicar_evento("pedidos",pedido_data,action="create")
        return {"message": "Pedido creado correctamente", "id_pedido": pedido.id_pedido}, 201
    except Exception as e:
        session.rollback()
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
        if not estado or not id_cliente:
            return {"error": "'estado' e 'id_cliente' son campos obligatorios"}, 400
        pedido.estado = estado
        pedido.id_cliente = id_cliente
        if fecha:
            pedido.fecha = date.fromisoformat(fecha)
        session.commit()
        #RabbitMQ
        pedido_data = {
            "id_pedido": pedido.id_pedido,
            "fecha": pedido.fecha.isoformat() if pedido.fecha else None,
            "estado": pedido.estado,
            "id_cliente": pedido.id_cliente            
        }
        publicar_evento("pedidos",pedido_data,action="update")
        return {"message": "Pedido actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
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
        #evento de eliminacion
        publicar_evento("pedidos",{"id_pedido": id},action="delete")
        return {"message": "Pedido eliminado correctamente"}, 200
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
