from flask import Blueprint
from controllers.patologias_controller import add_patologia, get_patologias, update_patologia, delete_patologia

patologias_bp = Blueprint("patologias", __name__, url_prefix="/api/patologias")

# POST (Correcto)
patologias_bp.route("", methods=["POST"])(add_patologia)

# GET (Correcto)
patologias_bp.route("/<rut_residente>", methods=["GET"])(get_patologias)

# --- CORRECCIÓN: Cambiado de '<id>' a '<rut_residente>' ---
# PUT
patologias_bp.route("/<rut_residente>", methods=["PUT"])(update_patologia)

# DELETE
patologias_bp.route("/<rut_residente>", methods=["DELETE"])(delete_patologia)
# --- FIN CORRECCIÓN ---