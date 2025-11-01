from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_ingreso():
    """
    Registrar un ingreso de residente
    ---
    tags:
      - Ingresos
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del ingreso
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            fecha_ingreso:
              type: string
              example: "2025-10-01"
            motivo:
              type: string
              example: "Traslado desde hospital"
            habitacion:
              type: string
              example: "Habitación 12B"
    responses:
      200:
        description: Ingreso registrado correctamente
    """
    db = get_db()
    data = request.json
    db.contratoIngresoMedicamentos.insert_one(data)
    return jsonify({"message": "Ingreso registrado"})

def get_ingresos(rut_residente):
    """
    Obtener ingresos de un residente
    ---
    tags:
      - Ingresos
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Lista de ingresos registrados
    """
    db = get_db()
    ingresos = list(db.contratoIngresoMedicamentos.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(ingresos)

def update_ingreso(id):
    """
    Actualizar información de un ingreso
    ---
    tags:
      - Ingresos
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del ingreso
      - in: body
        name: body
        required: true
        description: Nuevos datos del ingreso
        schema:
          type: object
          properties:
            motivo:
              type: string
              example: "Ingreso por recuperación postoperatoria"
            habitacion:
              type: string
              example: "Habitación 14C"
    responses:
      200:
        description: Ingreso actualizado correctamente
    """
    db = get_db()
    data = request.json
    result = db.contratoIngresoMedicamentos.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} ingreso(s) actualizado(s)"})

def delete_ingreso(id):
    """
    Eliminar un ingreso
    ---
    tags:
      - Ingresos
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del ingreso a eliminar
    responses:
      200:
        description: Ingreso eliminado correctamente
    """
    db = get_db()
    result = db.contratoIngresoMedicamentos.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} ingreso(s) eliminado(s)"})
