from flask import Blueprint, request, current_app, jsonify
from services.tracking_services import get_all_tracking, get_tracking_by_id, create_tracking, update_tracking, delete_tracking
from services.cliente_service import get_clientes, create_cliente
from services.pedido_service import get_pedidos, create_pedido

tracking_bp = Blueprint("tracking", __name__)

# CORS(app) en tu app.py se encargará de OPTIONS/preflight

# — TRACKING — #

@tracking_bp.route("/tracking", methods=["GET", "POST"])
def route_collection_tracking():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    if request.method == "GET":
        data, status = get_all_tracking(SessionLocal)
    else:  # POST
        data, status = create_tracking(request.json, SessionLocal)
    return jsonify(data), status

@tracking_bp.route("/tracking/<int:id>", methods=["GET", "PUT", "DELETE"])
def route_item_tracking(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    if request.method == "GET":
        data, status = get_tracking_by_id(id, SessionLocal)
    elif request.method == "PUT":
        payload = request.json.copy()
        payload["id"] = id
        data, status = update_tracking(payload, SessionLocal)
    else:  # DELETE
        data, status = delete_tracking(id, SessionLocal)
    return jsonify(data), status

# — CLIENTES — #

@tracking_bp.route("/clientes", methods=["GET", "POST"])
def route_clientes():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    if request.method == "GET":
        data, status = get_clientes(SessionLocal)
    else:
        data, status = create_cliente(request.json, SessionLocal)
    return jsonify(data), status

# — PEDIDOS — #

@tracking_bp.route("/pedidos", methods=["GET", "POST"])
def route_pedidos():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    if request.method == "GET":
        data, status = get_pedidos(SessionLocal)
    else:
        data, status = create_pedido(request.json, SessionLocal)
    return jsonify(data), status
