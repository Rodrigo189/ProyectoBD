from flask import Blueprint
from controllers.ingresos_controller import add_ingreso, get_ingresos, update_ingreso, delete_ingreso

ingresos_bp = Blueprint("ingresos", __name__, url_prefix="/api/ingresos")

# POST (Correcto)
ingresos_bp.route("", methods=["POST"])(add_ingreso)

# GET (Correcto)
ingresos_bp.route("/<rut_residente>", methods=["GET"])(get_ingresos)

# --- CORRECCIÓN: Cambiado de '<id>' a '<rut_residente>' ---
# PUT
ingresos_bp.route("/<rut_residente>", methods=["PUT"])(update_ingreso)

# DELETE
ingresos_bp.route("/<rut_residente>", methods=["DELETE"])(delete_ingreso)
# --- FIN CORRECCIÓN ---