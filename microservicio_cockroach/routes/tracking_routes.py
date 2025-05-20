from flask import Blueprint, request
from services.tracking_services import get_all_tracking, create_tracking

tracking_bp = Blueprint ("tracking", __name__)

@tracking_bp.route("/tracking", methods=["GET"])
def route_get_tracking():
    return get_all_tracking()

@tracking_bp.route("/tracking", methods=["POST"])
def route_create_tracking():
    return create_tracking(request.json)