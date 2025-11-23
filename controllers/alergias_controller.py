from flask import jsonify, request
from db_nosql import get_db
# 'ObjectId' ya no es necesario
# from bson import ObjectId

def add_alergia():
    """
    Registrar o actualizar una alergia
    ---
    tags:
      - Alergias
    parameters:
      - in: body
        name: body
        required: true
        description: Datos de la alergia
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            descripcion:
              type: string
              example: "Alergia a penicilina"
    responses:
      200:
        description: Alergia registrada o actualizada correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # Usamos upsert=True para crear o actualizar, basado en el RUT
    # Usamos la colección 'db.alergias', no 'db.urgenciasMedicas'
    try:
        rut = data["rut_residente"]
    except KeyError:
        return jsonify({"message": "Error: 'rut_residente' es requerido."}), 400
    except TypeError:
        return jsonify({"message": "Error: JSON inválido."}), 400

    db.alergias.update_one(
        {"rut_residente": rut}, 
        {"$set": data}, 
        upsert=True
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": "Alergia registrada"})

def get_alergias(rut_residente):
    """
    Obtener alergias de un residente
    ---
    tags:
      - Alergias
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Descripción de las alergias
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Cambiado a 'db.alergias'
    # Cambiado a find_one() porque tu frontend maneja esto como un solo campo
    alergias = db.alergias.find_one(
        {"rut_residente": rut_residente}, 
        {"_id": 0}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify(alergias if alergias else {"message": "Alergias no encontradas"})

def update_alergia(rut_residente):
    """
    Actualizar una alergia
    ---
    tags:
      - Alergias
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
      - in: body
        name: body
        required: true
        description: Nuevos datos de la alergia
        schema:
          type: object
          properties:
            descripcion:
              type: string
              example: "Alergia a mariscos"
    responses:
      200:
        description: Alergia actualizada correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # Se usa 'rut_residente' (no 'id') y 'db.alergias'
    result = db.alergias.update_one(
        {"rut_residente": rut_residente}, 
        {"$set": data}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.modified_count} alergia(s) actualizada(s)"})

def delete_alergia(rut_residente):
    """
    Eliminar una alergia
    ---
    tags:
      - Alergias
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuya alergia se eliminará
    responses:
      200:
        description: Alergia eliminada correctamente
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Se usa 'rut_residente' (no 'id') y 'db.alergias'
    result = db.alergias.delete_one({"rut_residente": rut_residente})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.deleted_count} alergia(s) eliminada(s)"})