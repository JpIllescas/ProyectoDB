from models import Cliente
from utils.rabbitmq_utils import publicar_evento


def get_clientes(SessionLocal): 
    session = SessionLocal()
    try:
        clientes = session.query(Cliente).all()  
        return [
            {
                "id_cliente": c.id_cliente,
                "nombre": c.nombre,
                "gmail": c.gmail,
                "telefono": c.telefono
            } for c in clientes
        ], 200
    except Exception as e:
        # logging.error(f"Error al obtener clientes: {e}")
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
                "gmail": cliente.gmail,
                "telefono": cliente.telefono
            }, 200
        else:
            return {"error": "Cliente no encontrado"}, 404
    except Exception as e:
        # logging.error(f"Error al buscar cliente: {e}")
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()
        
def create_cliente(data, SessionLocal):
    session = SessionLocal()
    nombre = data.get("nombre")
    email = data.get("email")
    telefono = data.get("telefono")
    if not nombre or not email or not telefono: 
        return {"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios"}, 400
    try: 
        cliente = Cliente(nombre=nombre, email=email, telefono=telefono)
        session.add(cliente)
        session.commit()
        # Publicar evento a RabbitMQ
        publicar_evento(
            model="clientes",
            data={
                "id_cliente": cliente.id_cliente,
                "nombre": cliente.nombre,
                "telefono": cliente.telefono,
                "email": cliente.email,  # El consumidor MySQL espera "email"
                # Si tienes "direccion", agrégala aquí
            },
            action="create"
        )
        return {"message": "Cliente creado correctamente", "id_cliente": cliente.id_cliente}, 201
    except Exception as e:
        session.rollback()
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
        email = data.get("email")
        telefono = data.get("telefono")
        if not nombre or not email or not telefono:
            return {"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios"}, 400
        cliente.nombre = nombre
        cliente.email = email
        cliente.telefono = telefono 
        session.commit()
        return {"message": "Cliente actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        # logging.error(f"Error al actualizar cliente: {e}")
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
        # Publicar evento a RabbitMQ
        publicar_evento(
            model="clientes",
            data={"id_cliente": id},
            action="delete"
        )
        return {"message": "Cliente eliminado correctamente"}, 200
    except Exception as e:
        session.rollback()
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()