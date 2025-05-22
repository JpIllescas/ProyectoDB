from flask import Blueprint, request, current_app, jsonify
from services.tracking_services import get_all_tracking, create_tracking
from services.cliente_service import get_clientes, create_cliente 
from services.pedido_service import get_pedidos, create_pedido 

tracking_bp = Blueprint("tracking", __name__)

# TRACKING
@tracking_bp.route("/tracking", methods=["GET"])
def route_get_tracking():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_all_tracking(SessionLocal)
    return jsonify(data), status

@tracking_bp.route("/tracking", methods=["POST"])
def route_create_tracking():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_tracking(request.json, SessionLocal)
    return jsonify(data), status

# CLIENTES
@tracking_bp.route("/clientes", methods=["GET"])
def route_get_clientes():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_clientes(SessionLocal)
    return jsonify(data), status

@tracking_bp.route("/clientes", methods=["POST"])
def route_create_clientes():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_cliente(request.json, SessionLocal)
    return jsonify(data), status

# PEDIDOS
@tracking_bp.route("/pedidos", methods=["GET"])
def route_get_pedidos():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_pedidos(SessionLocal)
    return jsonify(data), status

@tracking_bp.route("/pedidos", methods=["POST"])
def route_create_pedidos():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_pedido(request.json, SessionLocal)
    return jsonify(data), status