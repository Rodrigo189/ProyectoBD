from flask import Blueprint
from controllers.residentes_controller import (
    create_or_update_residente,
    get_residentes,
    update_residente,
    delete_residente
)

residentes_bp = Blueprint('residentes', __name__, url_prefix='/api/residentes')

residentes_bp.route('', methods=['POST'])(create_or_update_residente)
residentes_bp.route('', methods=['GET'])(get_residentes)
residentes_bp.route('/<rut>', methods=['PUT'])(update_residente)
residentes_bp.route('/<rut>', methods=['DELETE'])(delete_residente)
