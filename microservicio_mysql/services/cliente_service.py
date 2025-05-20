# clientes_service.py
from flask import jsonify
from models import Cliente

def get_clientes(SessionLocal):
    session = SessionLocal()
    try:
        clientes = session.query(Cliente).all()
        return [
            {
                "id_cliente": c.id_cliente,
                "nombre": c.nombre,
                "telefono": c.telefono,
                "direccion": c.direccion,
                "email": c.email
            } for c in clientes
        ], 200
    except Exception as e:
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def get_cliente_by_id(id, SessionLocal):
    session = SessionLocal()
    try:
        cliente = session.query(Cliente).filter_by(id_cliente=id).first()
        if cliente:
            return {
                "id_cliente": cliente.id_cliente,
                "nombre": cliente.nombre,
                "telefono": cliente.telefono,
                "direccion": cliente.direccion,
                "email": cliente.email
            }, 200
        else:
            return {"error": "Cliente no encontrado"}, 404
    except Exception as e:
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def create_cliente(data, SessionLocal):
    session = SessionLocal()
    nombre = data.get("nombre")
    telefono = data.get("telefono")
    direccion = data.get("direccion")
    email = data.get("email")

    if not all([nombre, telefono, direccion, email]):
        return {"error": "Todos los campos son obligatorios: nombre, apellido, telefono, direccion, email"}, 400

    try:
        cliente = Cliente(
            nombre=nombre,
            telefono=telefono,
            direccion=direccion,
            email=email
        )
        session.add(cliente)
        session.commit()
        return {"message": "Cliente creado correctamente", "id_cliente": cliente.id_cliente}, 201
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def update_cliente(id, data, SessionLocal):
    session = SessionLocal()
    try:
        cliente = session.query(Cliente).filter_by(id_cliente=id).first()
        if not cliente:
            return {"error": "Cliente no encontrado"}, 404

        nombre = data.get("nombre")
        telefono = data.get("telefono")
        direccion = data.get("direccion")
        email = data.get("email")

        if nombre: cliente.nombre = nombre
        if telefono: cliente.telefono = telefono
        if direccion: cliente.direccion = direccion
        if email: cliente.email = email

        session.commit()
        return {"message": "Cliente actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()

def delete_cliente(id, SessionLocal):
    session = SessionLocal()
    try:
        cliente = session.query(Cliente).filter_by(id_cliente=id).first()
        if not cliente:
            return {"error": "Cliente no encontrado"}, 404

        session.delete(cliente)
        session.commit()
        return {"message": "Cliente eliminado correctamente"}, 200
    except Exception as e:
        session.rollback()
        print(e)
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()