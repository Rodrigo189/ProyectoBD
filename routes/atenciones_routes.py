from flask import Blueprint
from controllers.atenciones_controller import add_atencion, get_atenciones, update_atencion, delete_atencion

atenciones_bp = Blueprint("atenciones", __name__, url_prefix="/api/atenciones")

atenciones_bp.route("", methods=["POST"])(add_atencion)
atenciones_bp.route("/<rut_residente>", methods=["GET"])(get_atenciones)
atenciones_bp.route("/<id>", methods=["PUT"])(update_atencion)
atenciones_bp.route("/<id>", methods=["DELETE"])(delete_atencion)
