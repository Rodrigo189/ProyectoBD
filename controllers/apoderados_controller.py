from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_apoderado():
    """
    Agregar un apoderado
    ---
    tags:
      - Apoderados
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del apoderado
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            nombre:
              type: string
              example: "Juan Pérez"
            parentesco:
              type: string
              example: "Hijo"
            telefono:
              type: string
              example: "+56912345678"
            correo:
              type: string
              example: "juanperez@mail.com"
    responses:
      200:
        description: Apoderado agregado correctamente
    """
    db = get_db()
    data = request.json
    db.apoderado.insert_one(data)
    return jsonify({"message": "Apoderado agregado"})

def get_apoderados(rut_residente):
    """
    Obtener todos los apoderados de un residente
    ---
    tags:
      - Apoderados
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Lista de apoderados asociados
    """
    db = get_db()
    apoderados = list(db.apoderado.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(apoderados)

def update_apoderado(id):
    """
    Actualizar información de un apoderado
    ---
    tags:
      - Apoderados
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del apoderado
      - in: body
        name: body
        required: true
        description: Datos actualizados del apoderado
        schema:
          type: object
          properties:
            telefono:
              type: string
            correo:
              type: string
    responses:
      200:
        description: Apoderado actualizado correctamente
    """
    db = get_db()
    data = request.json
    result = db.apoderado.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} apoderado(s) actualizado(s)"})

def delete_apoderado(id):
    """
    Eliminar un apoderado
    ---
    tags:
      - Apoderados
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del apoderado a eliminar
    responses:
      200:
        description: Apoderado eliminado correctamente
    """
    db = get_db()
    result = db.apoderado.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} apoderado(s) eliminado(s)"})
