from models import Producto

def get_productos(SessionLocal):
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
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def get_producto_by_id(id, SessionLocal):
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
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def create_producto(data, SessionLocal):
    session = SessionLocal()
    nombre = data.get("nombre")
    precio = data.get("precio")
    stock = data.get("stock")

    if not all([nombre, precio, stock]):
        return {"error": "Todos los campos son obligatorios: nombre, precio, stock"}, 400

    try:
        producto = Producto(
            nombre=nombre,
            precio=precio,
            stock=stock
        )
        session.add(producto)
        session.commit()
        return {"message": "Producto creado correctamente", "id_producto": producto.id_producto}, 201
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def update_producto(id, data, SessionLocal):
    session = SessionLocal()
    try:
        producto = session.query(Producto).filter_by(id_producto=id).first()
        if not producto:
            return {"error": "Producto no encontrado"}, 404

        nombre = data.get("nombre")
        precio = data.get("precio")
        stock = data.get("stock")

        if nombre: producto.nombre = nombre
        if precio: producto.precio = precio
        if stock: producto.stock = stock

        session.commit()
        return {"message": "Producto actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def delete_producto(id, SessionLocal):
    session = SessionLocal()
    try:
        producto = session.query(Producto).filter_by(id_producto=id).first()
        if not producto:
            return {"error": "Producto no encontrado"}, 404

        session.delete(producto)
        session.commit()
        return {"message": "Producto eliminado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()