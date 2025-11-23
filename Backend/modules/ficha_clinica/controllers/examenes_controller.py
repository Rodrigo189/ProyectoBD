from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_examen():
    """
    Registrar un examen médico
    ---
    tags:
      - Exámenes
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del examen
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            tipo_examen:
              type: string
              example: "Hemograma completo"
            fecha:
              type: string
              example: "2025-10-01"
            resultado:
              type: string
              example: "Dentro de parámetros normales"
    responses:
      200:
        description: Examen registrado correctamente
    """
    db = get_db()
    data = request.json
    db.registrosVitales.insert_one(data)
    return jsonify({"message": "Examen agregado"})

def get_examenes(rut_residente):
    """
    Obtener exámenes por residente
    ---
    tags:
      - Exámenes
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Lista de exámenes médicos
    """
    db = get_db()
    examenes = list(db.registrosVitales.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(examenes)

def update_examen(id):
    """
    Actualizar un examen
    ---
    tags:
      - Exámenes
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del examen
      - in: body
        name: body
        required: true
        description: Nuevos datos del examen
        schema:
          type: object
          properties:
            resultado:
              type: string
              example: "Leve anemia detectada"
    responses:
      200:
        description: Examen actualizado correctamente
    """
    db = get_db()
    data = request.json
    result = db.registrosVitales.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} examen(es) actualizado(s)"})

def delete_examen(id):
    """
    Eliminar un examen
    ---
    tags:
      - Exámenes
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del examen a eliminar
    responses:
      200:
        description: Examen eliminado correctamente
    """
    db = get_db()
    result = db.registrosVitales.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} examen(es) eliminado(s)"})
