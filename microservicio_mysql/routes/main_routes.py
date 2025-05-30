from flask import Blueprint, request, current_app, jsonify
from sqlalchemy.exc import SQLAlchemyError
from services.cliente_service import get_clientes, get_cliente_by_id, create_cliente, update_cliente, delete_cliente
from services.producto_service import get_productos, get_producto_by_id, create_producto, update_producto, delete_producto
from services.pedido_service import get_pedidos, get_pedido_by_id, create_pedido, update_pedido, delete_pedido
from services.detalle_pedido_service import get_detalles, get_detalle_by_id, create_detalle, update_detalle, delete_detalle

main_bp = Blueprint("main", __name__)

# ---- CHECK DB ----
@main_bp.route("/checkdb", methods=["GET"])
def check_db():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    session = SessionLocal()
    try:
        session.execute("SELECT 1")
        return jsonify({"status": "ok"}), 200
    except SQLAlchemyError as e:
        return jsonify({"status": "error", "detail": str(e)}), 500
    finally:
        session.close()

# ---- CLIENTES ----
@main_bp.route("/clientes", methods=["GET"])
def route_get_clientes():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_clientes(SessionLocal)
    return jsonify(data), status

@main_bp.route("/clientes/<int:id>", methods=["GET"])
def route_get_cliente_by_id(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_cliente_by_id(id, SessionLocal)
    return jsonify(data), status

@main_bp.route("/clientes", methods=["POST"])
def route_create_cliente():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_cliente(request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/clientes/<int:id>", methods=["PUT"])
def route_update_cliente(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = update_cliente(id, request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/clientes/<int:id>", methods=["DELETE"])
def route_delete_cliente(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = delete_cliente(id, SessionLocal)
    return jsonify(data), status

# ---- PRODUCTOS ----
@main_bp.route("/productos", methods=["GET"])
def route_get_productos():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_productos(SessionLocal)
    return jsonify(data), status

@main_bp.route("/productos/<int:id>", methods=["GET"])
def route_get_producto_by_id(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_producto_by_id(id, SessionLocal)
    return jsonify(data), status

@main_bp.route("/productos", methods=["POST"])
def route_create_producto():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_producto(request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/productos/<int:id>", methods=["PUT"])
def route_update_producto(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = update_producto(id, request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/productos/<int:id>", methods=["DELETE"])
def route_delete_producto(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = delete_producto(id, SessionLocal)
    return jsonify(data), status

# ---- PEDIDOS ----
@main_bp.route("/pedidos", methods=["GET"])
def route_get_pedidos():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_pedidos(SessionLocal)
    return jsonify(data), status

@main_bp.route("/pedidos/<int:id>", methods=["GET"])
def route_get_pedido_by_id(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_pedido_by_id(id, SessionLocal)
    return jsonify(data), status

@main_bp.route("/pedidos", methods=["POST"])
def route_create_pedido():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_pedido(request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/pedidos/<int:id>", methods=["PUT"])
def route_update_pedido(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = update_pedido(id, request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/pedidos/<int:id>", methods=["DELETE"])
def route_delete_pedido(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = delete_pedido(id, SessionLocal)
    return jsonify(data), status

# ---- DETALLE PEDIDO ----
@main_bp.route("/detalle_pedido", methods=["GET"])
def route_get_detalles():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_detalles(SessionLocal)
    return jsonify(data), status

@main_bp.route("/detalle_pedido/<int:id>", methods=["GET"])
def route_get_detalle_by_id(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = get_detalle_by_id(id, SessionLocal)
    return jsonify(data), status

@main_bp.route("/detalle_pedido", methods=["POST"])
def route_create_detalle():
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = create_detalle(request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/detalle_pedido/<int:id>", methods=["PUT"])
def route_update_detalle(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = update_detalle(id, request.json, SessionLocal)
    return jsonify(data), status

@main_bp.route("/detalle_pedido/<int:id>", methods=["DELETE"])
def route_delete_detalle(id):
    SessionLocal = current_app.config["SESSION_LOCAL"]
    data, status = delete_detalle(id, SessionLocal)
    return jsonify(data), status