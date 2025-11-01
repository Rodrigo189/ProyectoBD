from flask import Blueprint
from controllers.ingresos_controller import add_ingreso, get_ingresos, update_ingreso, delete_ingreso

ingresos_bp = Blueprint("ingresos", __name__, url_prefix="/api/ingresos")

ingresos_bp.route("", methods=["POST"])(add_ingreso)
ingresos_bp.route("/<rut_residente>", methods=["GET"])(get_ingresos)
ingresos_bp.route("/<id>", methods=["PUT"])(update_ingreso)
ingresos_bp.route("/<id>", methods=["DELETE"])(delete_ingreso)
