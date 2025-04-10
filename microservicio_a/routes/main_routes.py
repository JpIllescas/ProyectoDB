from flask import Blueprint, jsonify
from ..config.config import SessionLocal
from ..models import Usuario  # Corrige la importación de Usuario

main_bp = Blueprint("main", __name__)

@main_bp.route("/usuarios", methods=["GET"])
def get_usuarios():
    session = SessionLocal()
    try:
        usuarios = session.query(Usuario).all()
        return jsonify([{"id": u.id, "nombre": u.nombre, "correo": u.correo} for u in usuarios])
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        session.close()
