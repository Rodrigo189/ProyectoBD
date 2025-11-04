from flask import Blueprint
from controllers.apoderados_controller import add_apoderado, get_apoderados, update_apoderado, delete_apoderado

# --- CORRECCIÓN 1: Cambiado a singular ---
apoderados_bp = Blueprint("apoderados", __name__, url_prefix="/api/apoderado")
# --- FIN CORRECCIÓN 1 ---

# POST /api/apoderado
apoderados_bp.route("", methods=["POST"])(add_apoderado)

# GET /api/apoderado/<rut_residente>
apoderados_bp.route("/<rut_residente>", methods=["GET"])(get_apoderados)

# --- CORRECCIÓN 2: Cambiado de '<id>' a '<rut_residente>' ---
# PUT /api/apoderado/<rut_residente>
apoderados_bp.route("/<rut_residente>", methods=["PUT"])(update_apoderado)

# DELETE /api/apoderado/<rut_residente>
apoderados_bp.route("/<rut_residente>", methods=["DELETE"])(delete_apoderado)
# --- FIN CORRECCIÓN 2 ---