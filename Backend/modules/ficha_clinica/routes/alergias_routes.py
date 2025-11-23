from flask import Blueprint
from modules.ficha_clinica.controllers.alergias_controller import add_alergia, get_alergias, update_alergia, delete_alergia

alergias_bp = Blueprint("alergias", __name__, url_prefix="/api/alergias")

# POST /api/alergias (Correcto)
alergias_bp.route("", methods=["POST"])(add_alergia)

# GET /api/alergias/<rut_residente> (Correcto)
alergias_bp.route("/<rut_residente>", methods=["GET"])(get_alergias)

# --- CORRECCIÓN: Cambiado de '<id>' a '<rut_residente>' ---
# PUT /api/alergias/<rut_residente>
alergias_bp.route("/<rut_residente>", methods=["PUT"])(update_alergia)

# DELETE /api/alergias/<rut_residente>
alergias_bp.route("/<rut_residente>", methods=["DELETE"])(delete_alergia)
# --- FIN CORRECCIÓN ---