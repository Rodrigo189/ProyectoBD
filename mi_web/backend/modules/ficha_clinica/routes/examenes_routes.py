from flask import Blueprint
from modules.ficha_clinica.controllers.examenes_controller import add_examen, get_examenes, update_examen, delete_examen

examenes_bp = Blueprint("examenes", __name__, url_prefix="/api/examenes")

examenes_bp.route("", methods=["POST"])(add_examen)
examenes_bp.route("/<rut_residente>", methods=["GET"])(get_examenes)
examenes_bp.route("/<id>", methods=["PUT"])(update_examen)
examenes_bp.route("/<id>", methods=["DELETE"])(delete_examen)
