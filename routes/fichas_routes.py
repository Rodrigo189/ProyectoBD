from flask import Blueprint
from controllers.fichas_controller import create_ficha, get_ficha, update_ficha, delete_ficha

fichas_bp = Blueprint("fichas", __name__, url_prefix="/api/fichas")

# Crear ficha clínica
fichas_bp.route("", methods=["POST"])(create_ficha)

# Obtener ficha clínica por RUT de residente
fichas_bp.route("/<rut_residente>", methods=["GET"])(get_ficha)

# Actualizar ficha clínica por RUT
fichas_bp.route("/<rut_residente>", methods=["PUT"])(update_ficha)

# Eliminar ficha clínica por RUT
fichas_bp.route("/<rut_residente>", methods=["DELETE"])(delete_ficha)
