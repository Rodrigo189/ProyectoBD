from flask import Blueprint
# --- CORRECCIÓN: Nombres de funciones actualizados e importación añadida ---
from controllers.historia_controller import (
    crear_historia, 
    obtener_historia, 
    update_historia, 
    eliminar_historia
)

historia_bp = Blueprint("historia", __name__, url_prefix="/api/historia")

# Ruta POST (función renombrada)
historia_bp.route("", methods=["POST"])(crear_historia)

# Ruta GET (sin cambios)
historia_bp.route("/<rut_residente>", methods=["GET"])(obtener_historia)

# --- CORRECCIÓN: Ruta PUT añadida ---
# Esta ruta faltaba y la necesita tu fichaService.js
historia_bp.route("/<rut_residente>", methods=["PUT"])(update_historia)

# --- CORRECCIÓN: Ruta DELETE actualizada ---
# Cambiado de '<id>' a '<rut_residente>' y función renombrada
historia_bp.route("/<rut_residente>", methods=["DELETE"])(eliminar_historia)