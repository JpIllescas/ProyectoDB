from flask import jsonify 
from models import Pedido  
from config.config import SessionLocal 

def get_pedidos():
    session = SessionLocal()
    try:
        pedidos = session.query(Pedido).all()
        return jsonify([{"id": p.id_pedido, "fecha": p.fecha, "estado": p.estado, "id_cliente": p.id_cliente} for p in pedidos])
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        session.close()

def create_pedido(data):
    session = SessionLocal()
    estado = data.get ("estado")
    id_cliente = data.get ("id_cliente")
    if  not estado or not id_cliente:
        return jsonify(({"error": "'estado' y 'id_cliente' son campos obligatorios", "status": 400}))
    try:
        pedido = Pedido(estado=estado, id_cliente=id_cliente)
        session.add(pedido)
        session.commit()
        return jsonify({"message": "Pedido creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
    
def update_pedido(idz, data):
    session = SessionLocal()
    pedidos = session.query(Pedido).filter_by(id_pedido=idz).first()
    if not pedidos:
        return jsonify({"error": "Pedido no encontrado", "status": 404})
    estado = data.get ("estado")
    if not estado:
        return jsonify({"error": "'estado' es un campo obligatorio", "status": 400})
    else:
        try:
            pedidos.estado = estado
            session.commit()
            return jsonify({"message": "Pedido actualizado correctamente", "status": 200})
        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            session.close()
