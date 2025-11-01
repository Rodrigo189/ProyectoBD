from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_patologia():
    """
    Registrar una patología médica
    ---
    tags:
      - Patologías
    parameters:
      - in: body
        name: body
        required: true
        description: Datos de la patología
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            nombre:
              type: string
              example: "Diabetes tipo II"
            detalle:
              type: string
              example: "Controlada con medicación"
    responses:
      200:
        description: Patología registrada correctamente
    """
    db = get_db()
    data = request.json
    db.urgenciasMedicas.insert_one(data)
    return jsonify({"message": "Patología registrada"})

def get_patologias(rut_residente):
    """
    Obtener patologías de un residente
    ---
    tags:
      - Patologías
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Lista de patologías médicas
    """
    db = get_db()
    patologias = list(db.urgenciasMedicas.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(patologias)

def update_patologia(id):
    """
    Actualizar una patología
    ---
    tags:
      - Patologías
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID de la patología
      - in: body
        name: body
        required: true
        description: Nuevos datos de la patología
        schema:
          type: object
          properties:
            detalle:
              type: string
              example: "En tratamiento"
    responses:
      200:
        description: Patología actualizada correctamente
    """
    db = get_db()
    data = request.json
    result = db.urgenciasMedicas.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} patología(s) actualizada(s)"})

def delete_patologia(id):
    """
    Eliminar una patología
    ---
    tags:
      - Patologías
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID de la patología a eliminar
    responses:
      200:
        description: Patología eliminada correctamente
    """
    db = get_db()
    result = db.urgenciasMedicas.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} patología(s) eliminada(s)"})
