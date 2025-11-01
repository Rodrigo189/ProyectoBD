from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def crear_atencion():
    """
    Registrar una atención médica en la historia clínica
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: body
        name: body
        required: true
        description: Datos de la atención médica
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            fecha:
              type: string
              example: "2025-10-25"
            motivo:
              type: string
              example: "Control post operatorio"
            observaciones:
              type: string
              example: "Evolución estable, sin signos de infección"
    responses:
      200:
        description: Atención médica registrada correctamente
    """
    db = get_db()
    data = request.json
    data["tipo"] = "atencion"  # importante para que la ficha completa lo detecte
    db.urgenciasMedicas.insert_one(data)
    return jsonify({"message": "Atención médica registrada correctamente"})

def obtener_historia(rut_residente):
    """
    Obtener todas las atenciones médicas de un residente
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Lista de atenciones médicas registradas
    """
    db = get_db()
    historia = list(db.urgenciasMedicas.find(
        {"rut_residente": rut_residente, "tipo": "atencion"}, {"_id": 0}
    ))
    return jsonify(historia)

def eliminar_atencion(id):
    """
    Eliminar una atención médica específica
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID de la atención a eliminar
    responses:
      200:
        description: Atención médica eliminada correctamente
    """
    db = get_db()
    result = db.urgenciasMedicas.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": f"{result.deleted_count} atención(es) eliminada(s)"})
