from flask import jsonify, request
from db_nosql import get_db

def create_or_update_residente():
    """
    Crear o actualizar un residente
    ---
    tags:
      - Residentes
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del residente
        schema:
          type: object
          properties:
            rut:
              type: string
              example: "11111111-1"
            nombre:
              type: string
              example: "Ana García"
            fecha_nacimiento:
              type: string
              example: "1950-05-15"
            prevision_salud:
              type: string
              example: "Fonasa"
            direccion:
              type: string
              example: "Av. Los Pinos 123"
    responses:
      200:
        description: Residente creado o actualizado correctamente
    """
    db = get_db()
    data = request.json
    db.paciente.update_one({"rut": data["rut"]}, {"$set": data}, upsert=True)
    return jsonify({"message": "Residente creado o actualizado"})

def get_residentes():
    """
    Obtener todos los residentes
    ---
    tags:
      - Residentes
    responses:
      200:
        description: Lista completa de residentes
    """
    db = get_db()
    residentes = list(db.paciente.find({}, {"_id": 0}))
    return jsonify(residentes)

def update_residente(rut):
    """
    Actualizar información de un residente
    ---
    tags:
      - Residentes
    parameters:
      - in: path
        name: rut
        type: string
        required: true
        description: RUT del residente a actualizar
      - in: body
        name: body
        required: true
        description: Campos a modificar
        schema:
          type: object
          properties:
            nombre:
              type: string
            direccion:
              type: string
            estado_civil:
              type: string
    responses:
      200:
        description: Residente actualizado correctamente
    """
    db = get_db()
    data = request.json
    result = db.paciente.update_one({"rut": rut}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} residente(s) actualizado(s)"})

def delete_residente(rut):
    """
    Eliminar un residente
    ---
    tags:
      - Residentes
    parameters:
      - in: path
        name: rut
        type: string
        required: true
        description: RUT del residente a eliminar
    responses:
      200:
        description: Residente eliminado correctamente
    """
    db = get_db()
    result = db.paciente.delete_one({"rut": rut})
    return jsonify({"message": f"{result.deleted_count} residente(s) eliminado(s)"})
