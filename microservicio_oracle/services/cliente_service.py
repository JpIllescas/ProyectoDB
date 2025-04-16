from flask import jsonify 
from ..models import Cliente 
from ..config.config import SessionLocal 

def get_clientes():
    session = SessionLocal()
    try:
        
        clientes = session.query(Cliente).all()
        return jsonify([{"id": c.id_cliente, "nombre": c.nombre, "gmail": c.gmail, "telefono": c.telefono} for c in clientes])
    except Exception as e:
        return jsonify({"error": str(e)})

    finally: 
        session.close()
        
def create_cliente(data):
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
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
    
def update_cliente(id, data):
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
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
        return jsonify({"message": "Cliente actualizado correctamente", "status": 200})