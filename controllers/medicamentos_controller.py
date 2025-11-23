from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_medicamento():
    """
    Registrar medicamento
    ---
    tags:
      - Medicamentos
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del medicamento
        schema:
          type: object
          properties:
            rut_residente:
              type: string
            nombre:
              type: string
              example: "Paracetamol"
            dosis:
              type: string
              example: "500mg cada 8 horas"
    responses:
      200:
        description: Medicamento agregado correctamente
    """
    db = get_db()
    data = request.json
    db.medicamentos.insert_one(data)
    return jsonify({"message": "Medicamento agregado"})

def get_medicamentos(rut_residente):
    """
    Obtener medicamentos por residente
    ---
    tags:
      - Medicamentos
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
    responses:
      200:
        description: Lista de medicamentos
    """
    db = get_db()
    medicamentos = list(db.medicamentos.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(medicamentos)

def update_medicamento(id):
    """
    Actualizar un medicamento
    ---
    tags:
      - Medicamentos
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del medicamento
      - in: body
        name: body
        required: true
        description: Datos actualizados del medicamento
        schema:
          type: object
          properties:
            dosis:
              type: string
              example: "1 comprimido cada 12 horas"
    responses:
      200:
        description: Medicamento actualizado correctamente
    """
    db = get_db()
    data = request.json
    result = db.medicamentos.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} medicamento(s) actualizado(s)"})

def delete_medicamento(id):
    """
    Eliminar un medicamento
    ---
    tags:
      - Medicamentos
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del medicamento a eliminar
    responses:
      200:
        description: Medicamento eliminado correctamente
    """
    db = get_db()
    result = db.medicamentos.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} medicamento(s) eliminado(s)"})
