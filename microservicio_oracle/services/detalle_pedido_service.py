from flask import jsonify 
from models import DetallePedido
from config.config import SessionLocal 

def get_detalle_pedido():
    session = SessionLocal()
    try:
        detalle_pedido = session.query(DetallePedido).all()
        return jsonify([{"id": d.id_detalle, "id_pedido": d.id_pedido, "id_producto": d.id_producto, "cantidad": d.cantidad } for d in detalle_pedido])
    except Exception as e:
        return jsonify({"error": str (e)})
    finally:
        session.close()

def create_detalle_pedido(data):
    session = SessionLocal()
    id_pedido = data.get ("id_pedido")
    id_producto = data.get ("id_producto")
    cantidad =  data.get ("cantidad")
    if not id_pedido or not id_producto or not cantidad:
        return jsonify({"error": "'id_pedido', 'id_producto' y 'cantidad' son campos obligatorios"}), 400
    try:
        detalle_pedido = DetallePedido(id_pedido=id_pedido, id_producto=id_producto, cantidad=cantidad)
        session.add(detalle_pedido)
        session.commit()
        return jsonify({"message": "Detalle pedido creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

def update_detalle_pedido(idz, data):
    session = SessionLocal()
    detalle_pedido = session.query(DetallePedido).filter_by(id_detalle=idz).first()
    if not detalle_pedido:
        return jsonify({"error": "Detalle pedido no encontrado", "status": 404})
    cantidad = data.get ("cantidad")
    if not cantidad:
        return jsonify({"error": "'cantidad' es un campo obligatorio", "status": 400})
    else:
        try:
            detalle_pedido.cantidad = cantidad
            session.commit()
        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            session.close()
            return jsonify({"message": "Detalle pedido actualizado correctamente", "status": 200})
