from models import Producto
from config.config import SessionLocal 

def get_productos():
    session = SessionLocal()
    try: 
        productos = session.query(Producto).all()
        return [
            {
                "id_producto": p.id_producto,
                "nombre": p.nombre,
                "precio": float(p.precio),
                "stock": p.stock
            } for p in productos
        ], 200
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally: 
        session.close()
        
def get_producto_by_id(id):
    session = SessionLocal()
    try:
        producto = session.query(Producto).filter_by(id_producto=id).first()
        if producto:
            return {
                "id_producto": producto.id_producto,
                "nombre": producto.nombre,
                "precio": float(producto.precio),
                "stock": producto.stock
            }, 200
        else:
            return {"error": "Producto no encontrado"}, 404
    except Exception as e:
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
        
def create_producto(data):
    session = SessionLocal()
    nombre = data.get("nombre")
    precio = data.get("precio")
    stock = data.get("stock")
    if not nombre or not precio or not stock:
        return {"error": "'nombre', 'precio' y 'stock' son campos obligatorios"}, 400
    try: 
        producto = Producto(nombre=nombre, precio=precio, stock=stock)
        session.add(producto)
        session.commit()
        return {"message": "Producto creado correctamente", "id_producto": producto.id_producto}, 201
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def update_producto(id, data):
    session = SessionLocal()
    try:
        producto = session.query(Producto).filter_by(id_producto=id).first()
        if not producto:
            return {"error": "Producto no encontrado"}, 404
        nombre = data.get("nombre")
        precio = data.get("precio")
        stock = data.get("stock")
        if not nombre or not precio or not stock:
            return {"error": "'nombre', 'precio' y 'stock' son campos obligatorios"}, 400
        producto.nombre = nombre
        producto.precio = precio
        producto.stock = stock
        session.commit()
        return {"message": "Producto actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally: 
        session.close()
