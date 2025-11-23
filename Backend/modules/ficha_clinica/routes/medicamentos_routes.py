from flask import Blueprint
from modules.ficha_clinica.controllers.medicamentos_controller import add_medicamento, get_medicamentos, update_medicamento, delete_medicamento

medicamentos_bp = Blueprint("medicamentos", __name__, url_prefix="/api/medicamentos")

medicamentos_bp.route("", methods=["POST"])(add_medicamento)
medicamentos_bp.route("/<rut_residente>", methods=["GET"])(get_medicamentos)
medicamentos_bp.route("/<id>", methods=["PUT"])(update_medicamento)
medicamentos_bp.route("/<id>", methods=["DELETE"])(delete_medicamento)
