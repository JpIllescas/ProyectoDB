from flask import jsonify 
from models import Cliente 

def get_clientes(SessionLocal): 
    try:
        session = SessionLocal()
        clientes = session.query(Cliente).all()  
        return jsonify([{"id": c.id_cliente, "nombre": c.nombre, "gmail": c.gmail, "telefono": c.telefono} for c in clientes])
    except Exception as e:
        return print(e)
    
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
    finally:
        session.close()
        
def create_cliente(data, SessionLocal):
    session = SessionLocal()
    nombre = data.get ("nombre")
    gmail = data.get ("gmail")
    telefono = data.get ("telefono")
    if not nombre or not gmail or not telefono: 
        return jsonify({"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios"}), 400
    try: 
        cliente = Cliente(nombre=nombre, gmail=gmail, telefono=telefono)
        session.add(cliente)
        session.commit()
        return jsonify({"message": "Cliente creado correctamente", "status": 201})
    except Exception as e:
        print(e)
        return jsonify({"error": "Error interno del servidor"}), 500
    
def update_cliente(id, data, SessionLocal):
    session = SessionLocal()
    cliente = session.query(Cliente).filter_by(id_cliente=id).first()
    if not cliente:
        return jsonify({"error": "Cliente no encontrado", "status": 404})
    gmail = data.get ("gmail")
    telefono = data.get ("telefono")
    if not gmail or not telefono:
        return jsonify({"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios"}), 400
    
    try: 
        cliente.gmail = gmail
        cliente.telefono = telefono 
        session.commit()
    except Exception as e:
        session.rollback()
        return print(e), 500
    finally:
        return jsonify({"message": "Cliente actualizado correctamente", "status": 200})