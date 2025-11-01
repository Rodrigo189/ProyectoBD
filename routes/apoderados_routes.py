from flask import Blueprint
from controllers.apoderados_controller import add_apoderado, get_apoderados, update_apoderado, delete_apoderado

apoderados_bp = Blueprint("apoderados", __name__, url_prefix="/api/apoderados")

apoderados_bp.route("", methods=["POST"])(add_apoderado)
apoderados_bp.route("/<rut_residente>", methods=["GET"])(get_apoderados)
apoderados_bp.route("/<id>", methods=["PUT"])(update_apoderado)
apoderados_bp.route("/<id>", methods=["DELETE"])(delete_apoderado)
