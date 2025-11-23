# controllers/funcionarios_controller.py (Corregido con Schema de respuesta)

from flask import jsonify, request
from db_nosql import get_db
from datetime import datetime
from werkzeug.security import generate_password_hash

def listar_o_crear_funcionarios():
    """
    Obtener lista de funcionarios o crear uno nuevo
    ---
    tags:
      - Funcionarios (Tratantes)
    
    # --- GET (Obtener lista) ---
    get:
      description: Obtener todos los funcionarios (tratantes) registrados.
      # --- CORRECCIÓN AQUÍ (Añadido el schema de respuesta) ---
      responses:
        200:
          description: Lista de funcionarios.
          schema:
            type: array
            items:
              type: object
              properties:
                rut:
                  type: string
                  example: "1-1"
                nombre:
                  type: string
                  example: "Dr. Admin"
                rol:
                  type: string
                  example: "Administrador"
                clave:
                  type: string
                  example: "pbkdf2:sha256:..."
                fecha_ingreso:
                  type: string
                  example: "2025-11-04"
      # --- FIN CORRECCIÓN ---
          
    # --- POST (Crear nuevo) ---
    post:
      description: Crear un nuevo funcionario (tratante).
      parameters:
        - in: body
          name: body
          required: true
          description: Datos del funcionario a crear
          schema:
            type: object
            properties:
              rut:
                type: string
                example: "1-1"
              nombre:
                type: string
                example: "Dr. Admin"
              rol:
                type: string
                example: "Administrador"
              clave:
                type: string
                example: "admin123"
      responses:
        201:
          description: Funcionario creado correctamente.
        400:
          description: "Error de validación (ej: RUT duplicado o campos faltantes)."
    """
    db = get_db()
    
    if request.method == 'GET':
        # Esta lógica está bien (muestra la clave)
        funcionarios = list(db.funcionarios.find({}, {"_id": 0})) 
        return jsonify(funcionarios)

    elif request.method == 'POST':
        try:
            data = request.get_json()
            if not data.get("rut") or not data.get("clave"):
                return jsonify({"error": "El 'rut' y la 'clave' son obligatorios"}), 400

            existente = db.funcionarios.find_one({"rut": data["rut"]})
            if existente:
                return jsonify({"error": "Ya existe un funcionario con ese RUT"}), 400

            if not data.get("fecha_ingreso"):
                data["fecha_ingreso"] = datetime.now().strftime("%Y-%m-%d")
            
            data["clave"] = generate_password_hash(data["clave"])
            
            db.funcionarios.insert_one(data)
            return jsonify({"message": "Funcionario (tratante) creado correctamente"}), 201
        
        except Exception as e:
            print("ERROR al guardar funcionario:", e)
            return jsonify({"error": str(e)}), 500

def actualizar_o_eliminar_funcionario(rut):
    """
    Actualizar o eliminar un funcionario (tratante)
    ---
    tags:
      - Funcionarios (Tratantes)
      
    # --- PUT (Actualizar) ---
    put:
      description: Actualizar datos de un funcionario (no se puede cambiar el RUT).
      parameters:
        - in: path
          name: rut
          type: string
          required: true
          description: RUT del funcionario a actualizar
        - in: body
          name: body
          required: true
          description: Datos a actualizar
          schema:
            type: object
            properties:
              nombre:
                type: string
              rol:
                type: string
              clave:
                type: string
                description: "Opcional. Enviar solo si se desea cambiar la contraseña."
      responses:
        200:
          description: Funcionario actualizado.
        404:
          description: Funcionario no encontrado.

    # --- DELETE (Eliminar) ---
    delete:
      description: Eliminar un funcionario por su RUT.
      parameters:
        - in: path
          name: rut
          type: string
          required: true
          description: RUT del funcionario a eliminar
      responses:
        200:
          description: Funcionario eliminado.
        404:
          description: Funcionario no encontrado.
    """
    db = get_db()
    
    if request.method == "PUT":
        data = request.get_json().copy()
        data.pop("_id", None)
        
        if data.get("clave"):
            data["clave"] = generate_password_hash(data["clave"])
        else:
            data.pop("clave", None)
        
        result = db.funcionarios.update_one({"rut": rut}, {"$set": data})
        
        if result.matched_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario actualizado correctamente"})

    elif request.method == "DELETE":
        result = db.funcionarios.delete_one({"rut": rut})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario eliminado correctamente"})