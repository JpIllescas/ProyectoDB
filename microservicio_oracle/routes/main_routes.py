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

@main_bp.route("/create/cliente", methods=["POST"])
def route_create_cliente():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    return create_cliente(request.json, SessionLocal) 

@main_bp.route("/update/cliente/<int:id>", methods=["PUT"])
def route_update_cliente(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    return update_cliente(id, request.json, SessionLocal)

# ---- PRODUCTOS ----
@main_bp.route("/productos", methods=["GET"])
def route_get_productos():
    return get_productos()

@main_bp.route("/create/producto", methods=["POST"])
def route_create_producto():
    return create_producto(request.json)

@main_bp.route("/update/producto/<int:id>", methods=["PUT"])
def route_update_producto(id):
    return update_producto(id, request.json)

# ---- PEDIDOS ----
@main_bp.route("/pedidos", methods=["GET"])
def route_get_pedidos():
    return get_pedidos()

@main_bp.route("/create/pedido", methods=["POST"])
def route_create_pedido():
    pedido = create_pedido(request.json)
    send_message("pedidos_queue", f"Pedido creado: {pedido.id_pedido}, Estado: {pedido.estado}")
    return pedido

@main_bp.route("/update/pedido/<int:idz>", methods=["PUT"])
def route_update_pedido(idz):
    return update_pedido(idz, request.json)

# ---- DETALLE PEDIDO ----
@main_bp.route("/detalle_pedido", methods=["GET"])
def route_get_detalle_pedido():
    return get_detalle_pedido()

@main_bp.route("/create/detalle_pedido", methods=["POST"])
def route_create_detalle_pedido():
    return create_detalle_pedido(request.json)

@main_bp.route("/update/detalle_pedido/<int:idz>", methods=["PUT"])
def route_update_detalle_pedido(idz):
    return update_detalle_pedido(idz, request.json)
