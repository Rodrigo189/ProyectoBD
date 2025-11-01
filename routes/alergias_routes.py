from flask import Blueprint
from controllers.alergias_controller import add_alergia, get_alergias, update_alergia, delete_alergia

alergias_bp = Blueprint("alergias", __name__, url_prefix="/api/alergias")

alergias_bp.route("", methods=["POST"])(add_alergia)
alergias_bp.route("/<rut_residente>", methods=["GET"])(get_alergias)
alergias_bp.route("/<id>", methods=["PUT"])(update_alergia)
alergias_bp.route("/<id>", methods=["DELETE"])(delete_alergia)
