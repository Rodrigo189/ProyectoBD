from flask import jsonify, request
from db_nosql import get_db

def create_ficha():
    """
    Crear ficha clínica y social base del residente
    ---
    tags:
      - Fichas
    parameters:
      - in: body
        name: body
        required: true
        description: Datos sociales, clínicos y complementarios del residente
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            religion:
              type: string
              example: "Católica"
            actividad_laboral_previa:
              type: string
              example: "Agricultor"
            estado_civil:
              type: string
              example: "Viudo"
            vive_solo:
              type: boolean
              example: false
            calidad_apoyo:
              type: string
              example: "Buena"
            prevision_social:
              type: string
              example: "AFP Habitat"
            escolaridad:
              type: object
              properties:
                lectoescritura:
                  type: string
                  example: "Sí"
                analfabeto:
                  type: string
                  example: "No"
                educacion_basica:
                  type: string
                  example: "Completa"
                educacion_media:
                  type: string
                  example: "Incompleta"
                educacion_superior:
                  type: string
                  example: "Técnica"
            categoria:
              type: string
              example: "Dependencia moderada"
            observaciones:
              type: string
              example: "Buena adaptación al entorno del ELEAM"
    responses:
      200:
        description: Ficha creada o actualizada correctamente
    """
    db = get_db()
    data = request.json
    db.fichas.update_one({"rut_residente": data["rut_residente"]}, {"$set": data}, upsert=True)
    return jsonify({"message": "Ficha creada o actualizada correctamente"})

def get_ficha(rut_residente):
    """
    Obtener ficha clínica y social del residente
    ---
    tags:
      - Fichas
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
    responses:
      200:
        description: Ficha completa del residente
    """
    db = get_db()
    ficha = db.fichas.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(ficha if ficha else {"message": "Ficha no encontrada"})

def update_ficha(rut_residente):
    """
    Actualizar ficha clínica y social
    ---
    tags:
      - Fichas
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
      - in: body
        name: body
        required: true
        description: Campos a actualizar en la ficha
        schema:
          type: object
    responses:
      200:
        description: Ficha actualizada correctamente
    """
    db = get_db()
    data = request.json
    result = db.fichas.update_one({"rut_residente": rut_residente}, {"$set": data})
    return jsonify({"message": f"{result.modified_count} ficha(s) actualizada(s)"})

def delete_ficha(rut_residente):
    """
    Eliminar ficha del residente
    ---
    tags:
      - Fichas
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
    responses:
      200:
        description: Ficha eliminada correctamente
    """
    db = get_db()
    result = db.fichas.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": f"{result.deleted_count} ficha(s) eliminada(s)"})
