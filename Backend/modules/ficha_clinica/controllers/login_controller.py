# controllers/login_controller.py (Corregido con Swagger)

from flask import jsonify, request
from db_nosql import get_db
from werkzeug.security import check_password_hash

def login():
    """
    Autenticar un funcionario (tratante)
    ---
    tags:
      - Login
    parameters:
      - in: body
        name: body
        required: true
        description: Credenciales del funcionario
        schema:
          type: object
          properties:
            rut:
              type: string
              example: "1-1"
            clave:
              type: string
              example: "admin123"
    responses:
      200:
        description: Login exitoso, devuelve datos del usuario
      401:
        description: Credenciales incorrectas
    """
    db = get_db()
    data = request.get_json()
    rut = data.get("rut")
    clave_ingresada = data.get("clave")
    
    user = db.funcionarios.find_one({"rut": rut})
    
    if user and check_password_hash(user.get("clave"), clave_ingresada):
        user_data = {
            "rut": user.get("rut"),
            "nombre": user.get("nombre"),
            "rol": user.get("rol", "tratante")
        }
        return jsonify({"message": "Login exitoso", "usuario": user_data})
        
    return jsonify({"message": "Credenciales incorrectas"}), 401