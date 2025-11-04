# routes/funcionarios_routes.py (NUEVO)

from flask import Blueprint
from controllers.funcionarios_controller import (
    listar_o_crear_funcionarios, 
    actualizar_o_eliminar_funcionario
)

funcionarios_bp = Blueprint('funcionarios', __name__, url_prefix='/api/funcionarios')

# GET, POST /api/funcionarios
funcionarios_bp.route('', methods=['GET', 'POST'])(listar_o_crear_funcionarios)

# PUT, DELETE /api/funcionarios/<rut>
funcionarios_bp.route('/<rut>', methods=['PUT', 'DELETE'])(actualizar_o_eliminar_funcionario)