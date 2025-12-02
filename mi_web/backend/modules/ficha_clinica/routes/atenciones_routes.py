from flask import Blueprint
# --- CORRECCIÓN: Importar la nueva función ---
from modules.ficha_clinica.controllers.atenciones_controller import (
    add_atencion, 
    get_atenciones, 
    update_atencion, 
    delete_atenciones_por_rut # Reemplaza a delete_atencion
)
# --- FIN CORRECCIÓN ---

atenciones_bp = Blueprint("atenciones", __name__, url_prefix="/api/atenciones")

# POST (Correcto)
atenciones_bp.route("", methods=["POST"])(add_atencion)

# GET (Correcto)
atenciones_bp.route("/<rut_residente>", methods=["GET"])(get_atenciones)

# PUT (Correcto - usa ID para atenciones individuales)
atenciones_bp.route("/<id>", methods=["PUT"])(update_atencion)

# --- CORRECCIÓN: Cambiado de '<id>' a '<rut_residente>' y usa la nueva función ---
# Esta ruta es la que necesita fichaService.js para las actualizaciones
atenciones_bp.route("/<rut_residente>", methods=["DELETE"])(delete_atenciones_por_rut)
# --- FIN CORRECCIÓN ---