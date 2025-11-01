from flask import Blueprint
from controllers.patologias_controller import add_patologia, get_patologias, update_patologia, delete_patologia

patologias_bp = Blueprint("patologias", __name__, url_prefix="/api/patologias")

patologias_bp.route("", methods=["POST"])(add_patologia)
patologias_bp.route("/<rut_residente>", methods=["GET"])(get_patologias)
patologias_bp.route("/<id>", methods=["PUT"])(update_patologia)
patologias_bp.route("/<id>", methods=["DELETE"])(delete_patologia)
