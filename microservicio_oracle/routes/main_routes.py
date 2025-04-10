from flask import Blueprint, jsonify, request 
from ..config.config import SessionLocal
from ..models import Cliente, Producto, Pedido, DetallePedido  

main_bp = Blueprint("main", __name__)

@main_bp.route("/clientes", methods=["GET"])
def get_clientes():
    session = SessionLocal()
    try:
        
        clientes = session.query(Cliente).all()
        return jsonify([{"id": c.id_cliente, "nombre": c.nombre, "gmail": c.gamil, "telefono": c.telefono} for c in clientes])
    except Exception as e:
        return jsonify({"error": str(e)})
    

    finally: 
        session.close()
@main_bp.route("/create/cliente", methods=["POST"])
def create_cliente():
    session = SessionLocal()
    nombre = request.json.get ("nombre")
    gmail = request.json.get ("gmail")
    telefono = request.json.get ("telefono")
    if not nombre or not gmail or not telefono: 
        return jsonify(({"error": "'nombre', 'gmail' y 'telefono' son campos obligatorios", "status": 400}))
    try: 
        cliente = Cliente(nombre=nombre, gmail=gmail, telefono=telefono)
        session.add(cliente)
        session.commit()
        return jsonify({"message": "Cliente creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error del servidor"}, 500)
    finally:
        session.close()
    
@main_bp.route("/update/cliente/<int:id>", methods=["PUT"])
def update_cliente(id):
    session = SessionLocal()
    cliente = session.query(Cliente).filter_by(id_cliente=id).first()
    if not cliente:
        return jsonify({"error": "Cliente no encontrado", "status": 404})
    gmail = request.json.get ("gmail")
    telefono = request.json.get ("telefono")
    if not gmail or not telefono:
        return jsonify({"error": "'gmail' y 'telefono' son campos obligatorios", "status": 400})
    else:
        try: 
            session.add(cliente)
            cliente.gmail = gmail
            cliente.telefono = telefono 
            session.commit()
        except Exception as e:
            session.rollback()
            return jsonify({"error del servidor"}, 500)
        finally:
            session.close()
            return jsonify({"message": "Cliente actualizado correctamente", "status": 200})
    
@main_bp.route("/productos", methods=["GET"])
def get_productos():
    session = SessionLocal()
    try:
        
        productos = session.query(Producto).all()
        return jsonify([{"id": p.id_producto, "nombre": p.nombre, "precio": p.precio, "stock": p.stock} for p in productos])
    except Exception as e:
        return jsonify({"error": str(e)})
    
    finally: 
        session.close()
        
@main_bp.route("/create/producto", methods=["POST"])
def create_producto():
    session =SessionLocal()
    nombre = request.json.get ("nombre")
    precio = request.json.get ("precio")
    stock = request.json.get ("stock")
    if not nombre or not precio or not stock:
        return jsonify(({"error": "'nombre'. 'precio' y 'stock' son campos obligatorios", "status": 400}))
    try: 
        producto = Producto(nombre=nombre, precio=precio, stock=stock)
        session.add(producto)
        session.commit()
        return jsonify({"message": "Producto creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error del servidor"}, 500)
    finally:
        session.close()

@main_bp.route("/update/producto/<int:id>", methods=["PUT"])
def update_producto(id):
    session = SessionLocal()
    producto = session.query(Producto).filter_by(id_producto=id).first()
    if not producto:
        return jsonify({"error": "Producto no encontrado", "statu": 404})
    nombre = request.json.get ("nombre")
    precio = request.json.get ("precio")
    stock =request.json.get ("stock")
    if not nombre or not precio or not stock:
        return jsonify({"error": "'nombre', 'precio' y 'stock' son campos obligatorios", "status": 400})
    else:
        try:
            session.add(producto)
            producto.nombre = nombre
            producto.precio = precio
            producto.stock = stock
            session.commit()
            return jsonify({"message": "Producto actualizado correctamente", "status": 200})
        except Exception as e:
            session.rollback()
            return jsonify({"error del servidor"}, 500)
        finally: 
            session.close()
            return jsonify({"message": "Prooducto actualizado correctamente", "status": 200})
    
@main_bp.route("/pedidos", methods=["GET"])
def get_pedidos():
    session = SessionLocal()
    try:
        pedidos = session.query(Pedido).all()
        return jsonify([{"id": p.id_pedido, "fecha": p.fecha, "estado": p.estado, "id_cliente": p.id_cliente} for p in pedidos])
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        session.close()

@main_bp.route("/create/pedido", methods=["POST"])
def create_pedido():
    session = SessionLocal()
    id_pedido = request.json.get ("id_pedido")
    fecha = request.json.get ("fecha")
    estado = request.json.get ("estado")
    id_cliente = request.json.get ("id_cliente")
    if not id_pedido or not fecha or not estado or not id_cliente:
        return jsonify(({"error": "'id_pedido'. 'fecha'. 'estado' y 'id_cliente' son campos obligatorios", "status": 400}))
    try:
        pedido = Pedido(id_pedido=id_pedido, fecha=fecha, estado=estado, id_cliente=id_cliente)
        session.add(pedido)
        session.commit()
        return jsonify({"message": "Pedido creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error del servidor"}, 500)
    finally:
        session.close()
    
@main_bp.route("/update/pedido/<int:idz>", methods=["PUT"])
def update_pedido(idz):
    session = SessionLocal()
    pedidos = session.query(Pedido).filter_by(id_pedido=idz).first()
    if not pedidos:
        return jsonify({"error": "Pedido no encontrado", "status": 404})
    estado = request.json.get ("estado")
    if not estado:
        return jsonify({"error": "'estado' es un campo obligatorio", "status": 400})
    else:
        try:
            session.add(pedidos)
            pedidos.estado = estado
            session.commit()
            return jsonify({"message": "Pedido actualizado correctamente", "status": 200})
        except Exception as e:
            session.rollback()
            return jsonify({"error del servidor"}, 500)
        finally:
            session.close()
            return jsonify({"message": "Pedido actualizado correctamente", "status": 200})
        
@main_bp.route("/detalle_pedido", methods=["GET"])
def get_detalle_pedido():
    session = SessionLocal()
    try:
        detalle_pedido = session.query(DetallePedido).all()
        return jsonify([{"id": d.id_detalle, "id_pedido": d.id_pedido, "id_producto": d.id_producto, "cantidad": d.cantidad } for d in detalle_pedido])
    except Exception as e:
        return jsonify({"error": str (e)})
    finally:
        session.close()

@main_bp.route("/create/detalle_pedido", methods=["POST"])
def create_detalle_pedido():
    session = SessionLocal()
    id_detalle = request.json.get ("id_detalle")
    id_pedido = request.json.get ("id_pedido")
    id_producto = request.json.get ("id_producto")
    cantidad =  request.json.get ("cantidad")
    if not id_detalle or not id_pedido or not id_producto or not cantidad:
        return jsonify(({"error": "'id_detalle', 'id_pedido', 'id_producto' y 'cantidad' son campos obligatorios", "status": 400}))
    try:
        detalle_pedido = DetallePedido(id_detalle=id_detalle, id_pedido=id_pedido, id_producto=id_producto, cantidad=cantidad)
        session.add(detalle_pedido)
        session.commit()
        return jsonify({"message": "Detalle pedido creado correctamente", "status": 201})
    except Exception as e:
        return jsonify({"error del servidor"}, 500)
    finally:
        session.close()

@main_bp.route("/update/detalle_pedido/<int:idz>", methods=["PUT"])
def update_detalle_pedido(idz):
    session = SessionLocal()
    detalle_pedido = session.query(DetallePedido).filter_by(id_detalle=idz).first()
    if not detalle_pedido:
        return jsonify({"error": "Detalle pedido no encontrado", "status": 404})
    cantidad = request.json.get ("cantidad")
    if not cantidad:
        return jsonify({"error": "'cantidad' es un campo obligatorio", "status": 400})
    else:
        try:
            session.add(detalle_pedido)
            detalle_pedido.cantidad = cantidad
            session.commit()
        except Exception as e:
            session.rollback()
            return jsonify({"error del servidor"}, 500)
        finally:
            session.close()
            return jsonify({"message": "Detalle pedido actualizado correctamente", "status": 200})
        
        
        
    
        
    
        
        

    
    