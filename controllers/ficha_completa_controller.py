from flask import jsonify
from db_nosql import get_db

def get_ficha_completa(rut):
    """
    Obtener la ficha clínica completa de un residente
    ---
    tags:
      - Ficha Clínica Completa
    parameters:
      - in: path
        name: rut
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Ficha clínica completa consolidada
        schema:
          type: object
          properties:
            datos_personales:
              type: object
            apoderado:
              type: object
            ingresos:
              type: array
              items:
                type: object
            alergias:
              type: array
              items:
                type: object
            medicamentos:
              type: array
              items:
                type: object
            examenes:
              type: array
              items:
                type: object
    """
    db = get_db()

    paciente = db.paciente.find_one({"rut": rut}, {"_id": 0}) or {}
    apoderado = db.apoderado.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    ingresos = list(db.contratoIngresoMedicamentos.find({"rut_residente": rut}, {"_id": 0})) or []
    alergias = list(db.urgenciasMedicas.find({"rut_residente": rut}, {"_id": 0})) or []
    medicamentos = list(db.medicamentos.find({"rut_residente": rut}, {"_id": 0})) or []
    examenes = list(db.registrosVitales.find({"rut_residente": rut}, {"_id": 0})) or []

    ficha = {
        "datos_personales": paciente,
        "apoderado": apoderado,
        "ingresos": ingresos,
        "alergias": alergias,
        "medicamentos": medicamentos,
        "examenes": examenes
    }
    return jsonify(ficha)
