from models import Cliente

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
    gmail = data.get("gmail")
    telefono = data.get("telefono")
    if not nombre or not gmail or not telefono: 
        return {"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios"}, 400
    try: 
        cliente = Cliente(nombre=nombre, gmail=gmail, telefono=telefono)
        session.add(cliente)
        session.commit()
        return {"message": "Cliente creado correctamente", "id_cliente": cliente.id_cliente}, 201
    except Exception as e:
        session.rollback()
        # logging.error(f"Error al crear cliente: {e}")
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
        gmail = data.get("gmail")
        telefono = data.get("telefono")
        if not nombre or not gmail or not telefono:
            return {"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios"}, 400
        cliente.nombre = nombre
        cliente.gmail = gmail
        cliente.telefono = telefono 
        session.commit()
        return {"message": "Cliente actualizado correctamente"}, 200
    except Exception as e:
        session.rollback()
        # logging.error(f"Error al actualizar cliente: {e}")
        return {"error": "Error interno del servidor"}, 500
    finally:
        session.close()