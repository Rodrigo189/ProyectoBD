from flask import Blueprint
from modules.ficha_clinica.controllers.fichas_controller import create_ficha, get_ficha, update_ficha, delete_ficha

fichas_bp = Blueprint("fichas", __name__, url_prefix="/api/fichas")

fichas_bp.route("", methods=["POST"])(create_ficha)
fichas_bp.route("/<rut_residente>", methods=["GET"])(get_ficha)
fichas_bp.route("/<rut_residente>", methods=["PUT"])(update_ficha)
fichas_bp.route("/<rut_residente>", methods=["DELETE"])(delete_ficha)
