from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_atencion():
    """
    Registrar una atención médica
    ---
    tags:
      - Atenciones
    parameters:
      - in: body
        name: body
        required: true
        description: Datos de la atención
        schema:
          type: object
          properties:
            rut_residente:
              type: string
            fecha:
              type: string
              example: "2025-10-10"
            motivo:
              type: string
              example: "Control general"
            profesional:
              type: string
              example: "Dra. López"
    responses:
      200:
        description: Atención registrada correctamente
    """
    db = get_db()
    data = request.json
    db.urgenciasMedicas.insert_one(data)
    return jsonify({"message": "Atención registrada"})

def get_atenciones(rut_residente):
    """
    Obtener atenciones médicas por residente
    ---
    tags:
      - Atenciones
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
    responses:
      200:
        description: Lista de atenciones médicas
    """
    db = get_db()
    atenciones = list(db.urgenciasMedicas.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(atenciones)

def update_atencion(id):
    """
    Actualizar una atención médica
    ---
    tags:
      - Atenciones
    parameters:
      - in: path
        name: id
        type: string
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            motivo:
              type: string
              example: "Chequeo cardiológico"
    responses:
      200:
        description: Atención actualizada correctamente
    """
    db = get_db()
    data = request.json
    result = db.urgenciasMedicas.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} atención(es) actualizada(s)"})

def delete_atencion(id):
    """
    Eliminar una atención médica
    ---
    tags:
      - Atenciones
    parameters:
      - in: path
        name: id
        type: string
        required: true
    responses:
      200:
        description: Atención eliminada correctamente
    """
    db = get_db()
    result = db.urgenciasMedicas.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} atención(es) eliminada(s)"})
