from flask import jsonify 
from ..models import Producto
from ..config.config import SessionLocal 


def get_productos():
    session = SessionLocal()
    try: 
        productos = session.query(Producto).all()
        return jsonify([{"id": p.id_producto, "nombre": p.nombre, "precio": p.precio, "stock": p.stock} for p in productos])
    except Exception as e:
        return jsonify({"error": str(e)})
    
    finally: 
        session.close()
        
def create_producto(data):
    session =SessionLocal()
    nombre = data.get ("nombre")
    precio = data.get ("precio")
    stock = data.get ("stock")
    if not nombre or not precio or not stock:
        return jsonify({"error": "'nombre', 'precio' y 'stock' son campos obligatorios"}), 400
    try: 
        producto = Producto(nombre=nombre, precio=precio, stock=stock)
        session.add(producto)
        session.commit()
        return jsonify({"message": "Producto creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

def update_producto(id, data):
    session = SessionLocal()
    producto = session.query(Producto).filter_by(id_producto=id).first()
    if not producto:
        return jsonify({"error": "Producto no encontrado", "status": 404})
    nombre = data.get ("nombre")
    precio = data.get ("precio")
    stock = data.get ("stock")
    if not nombre or not precio or not stock:
        return jsonify({"error": "'nombre', 'precio' y 'stock' son campos obligatorios", "status": 400})

    try:
        producto.nombre = nombre
        producto.precio = precio
        producto.stock = stock
        session.commit()
        return jsonify({"message": "Producto actualizado correctamente", "status": 200})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally: 
        session.close()
