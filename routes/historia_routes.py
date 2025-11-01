from flask import Blueprint
from controllers.historia_controller import crear_atencion, obtener_historia, eliminar_atencion

historia_bp = Blueprint("historia", __name__, url_prefix="/api/historia")

historia_bp.route("", methods=["POST"])(crear_atencion)
historia_bp.route("/<rut_residente>", methods=["GET"])(obtener_historia)
historia_bp.route("/<id>", methods=["DELETE"])(eliminar_atencion)
