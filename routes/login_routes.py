# routes/login_routes.py (NUEVO)

from flask import Blueprint
from controllers.login_controller import login

login_bp = Blueprint("login", __name__, url_prefix="/api/login")

# POST /api/login
login_bp.route("", methods=["POST"])(login)