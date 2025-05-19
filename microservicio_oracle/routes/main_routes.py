from flask import Blueprint, request, current_app
from services.cliente_service import get_clientes, create_cliente, update_cliente
from services.producto_service import get_productos, create_producto, update_producto
from services.pedido_service import get_pedidos, create_pedido, update_pedido
from services.detalle_pedido_service import get_detalle_pedido, create_detalle_pedido, update_detalle_pedido
from services.rabbitmq_producer import send_message

main_bp = Blueprint("main", __name__)

# ---- CLIENTES ----
@main_bp.route("/clientes", methods=["GET"])
def route_get_clientes():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    return get_clientes(SessionLocal)

@main_bp.route("/clientes/<int:id>", methods=["GET"])
def route_get_cliente_by_id(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    from services.cliente_service import get_cliente_by_id
    return get_cliente_by_id(id, SessionLocal)

@main_bp.route("/clientes", methods=["POST"])
def route_create_cliente():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    return create_cliente(request.json, SessionLocal) 

@main_bp.route("/clientes/<int:id>", methods=["PUT"])
def route_update_cliente(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    return update_cliente(id, request.json, SessionLocal)

# ---- PRODUCTOS ----
@main_bp.route("/productos", methods=["GET"])
def route_get_productos():
    return get_productos()

@main_bp.route("/productos/<int:id>", methods=["GET"])
def route_get_producto_by_id(id):
    from services.producto_service import get_producto_by_id
    return get_producto_by_id(id)

@main_bp.route("/productos", methods=["POST"])
def route_create_producto():
    return create_producto(request.json)

@main_bp.route("/productos/<int:id>", methods=["PUT"])
def route_update_producto(id):
    return update_producto(id, request.json)

# ---- PEDIDOS ----
@main_bp.route("/pedidos", methods=["GET"])
def route_get_pedidos():
    return get_pedidos()

@main_bp.route("/pedidos/<int:id>", methods=["GET"])
def route_get_pedido_by_id(id):
    from services.pedido_service import get_pedido_by_id
    return get_pedido_by_id(id)

@main_bp.route("/pedidos", methods=["POST"])
def route_create_pedido():
    pedido_data, response = create_pedido(request.json)
    if pedido_data:
        pedido_id, pedido_estado = pedido_data
        send_message("pedidos_queue", f"Pedido creado: {pedido_id}, Estado: {pedido_estado}")
    return response

@main_bp.route("/pedidos/<int:idz>", methods=["PUT"])
def route_update_pedido(idz):
    return update_pedido(idz, request.json)

# ---- DETALLE PEDIDO ----
@main_bp.route("/detalle_pedido", methods=["GET"])
def route_get_detalle_pedido():
    return get_detalle_pedido()

@main_bp.route("/detalle_pedido/<int:id>", methods=["GET"])
def route_get_detalle_pedido_by_id(id):
    from services.detalle_pedido_service import get_detalle_pedido_by_id
    return get_detalle_pedido_by_id(id)

@main_bp.route("/detalle_pedido", methods=["POST"])
def route_create_detalle_pedido():
    return create_detalle_pedido(request.json)

@main_bp.route("/detalle_pedido/<int:idz>", methods=["PUT"])
def route_update_detalle_pedido(idz):
    return update_detalle_pedido(idz, request.json)