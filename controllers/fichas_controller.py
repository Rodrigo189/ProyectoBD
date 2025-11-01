from flask import jsonify, request
from db_nosql import get_db

def create_ficha():
    """
    Crear ficha clínica base
    ---
    tags:
      - Fichas
    parameters:
      - in: body
        name: body
        required: true
        description: Datos generales de la ficha clínica del residente
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            categoria:
              type: string
              example: "Dependencia severa"
            observaciones:
              type: string
              example: "Requiere asistencia permanente y control diario"
    responses:
      200:
        description: Ficha clínica creada correctamente
    """
    db = get_db()
    data = request.json
    db.fichas.insert_one(data)
    return jsonify({"message": "Ficha creada correctamente"})

def get_ficha(rut_residente):
    """
    Obtener ficha clínica base
    ---
    tags:
      - Fichas
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Datos de la ficha clínica base
    """
    db = get_db()
    ficha = db.fichas.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(ficha if ficha else {"message": "Ficha no encontrada"})

def update_ficha(rut_residente):
    """
    Actualizar ficha clínica base
    ---
    tags:
      - Fichas
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuya ficha se actualizará
      - in: body
        name: body
        required: true
        description: Nuevos datos de la ficha
        schema:
          type: object
          properties:
            categoria:
              type: string
              example: "Dependencia moderada"
            observaciones:
              type: string
              example: "Mejoras observadas, mayor independencia"
    responses:
      200:
        description: Ficha clínica actualizada correctamente
    """
    db = get_db()
    data = request.json
    result = db.fichas.update_one({"rut_residente": rut_residente}, {"$set": data})
    if result.modified_count > 0:
        return jsonify({"message": "Ficha actualizada correctamente"})
    return jsonify({"message": "No se encontró la ficha o no hubo cambios"})

def delete_ficha(rut_residente):
    """
    Eliminar ficha clínica base
    ---
    tags:
      - Fichas
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuya ficha se eliminará
    responses:
      200:
        description: Ficha clínica eliminada correctamente
    """
    db = get_db()
    result = db.fichas.delete_one({"rut_residente": rut_residente})
    if result.deleted_count > 0:
        return jsonify({"message": "Ficha eliminada correctamente"})
    return jsonify({"message": "Ficha no encontrada"})
