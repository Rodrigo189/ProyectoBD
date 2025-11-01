from flask import Blueprint
from controllers.ficha_completa_controller import get_ficha_completa

ficha_completa_bp = Blueprint("ficha_completa", __name__, url_prefix="/api/ficha")

ficha_completa_bp.route("/<rut>", methods=["GET"])(get_ficha_completa)
