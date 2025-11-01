from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_alergia():
    """
    Registrar una alergia
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
        description: Alergia registrada correctamente
    """
    db = get_db()
    data = request.json
    db.urgenciasMedicas.insert_one(data)
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
        description: Lista de alergias
    """
    db = get_db()
    alergias = list(db.urgenciasMedicas.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(alergias)

def update_alergia(id):
    """
    Actualizar una alergia
    ---
    tags:
      - Alergias
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID de la alergia
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
    result = db.urgenciasMedicas.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} alergia(s) actualizada(s)"})

def delete_alergia(id):
    """
    Eliminar una alergia
    ---
    tags:
      - Alergias
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID de la alergia a eliminar
    responses:
      200:
        description: Alergia eliminada correctamente
    """
    db = get_db()
    result = db.urgenciasMedicas.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} alergia(s) eliminada(s)"})
