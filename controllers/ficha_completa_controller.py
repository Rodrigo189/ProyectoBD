from flask import jsonify
from db_nosql import get_db

def get_ficha_completa(rut):
    """
    Obtener la ficha clínica completa del residente
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
        description: Ficha clínica completa consolidada según el formato oficial del Grupo 1
    """
    db = get_db()

    # === DATOS PERSONALES (colección paciente) ===
    paciente = db.paciente.find_one({"rut": rut}, {"_id": 0}) or {}
    datos_personales = {
        "nombre": paciente.get("nombre", ""),
        "rut": paciente.get("rut", rut),
        "fecha_nacimiento": paciente.get("fecha_nacimiento", ""),
        "edad": paciente.get("edad", ""),
        "sexo": paciente.get("sexo", ""),
        "peso": paciente.get("peso", ""),
        "prevision_salud": paciente.get("prevision_salud", ""),
        "direccion_actual": paciente.get("direccion", "")
    }

    # === DATOS SOCIALES Y CLÍNICOS (colección fichas) ===
    ficha = db.fichas.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    datos_sociales = {
        "actividad_laboral_previa": ficha.get("actividad_laboral_previa", ""),
        "religion": ficha.get("religion", ""),
        "estado_civil": ficha.get("estado_civil", ""),
        "vive_solo": ficha.get("vive_solo", ""),
        "calidad_apoyo": ficha.get("calidad_apoyo", ""),
        "prevision_social": ficha.get("prevision_social", ""),
        "escolaridad": ficha.get("escolaridad", {
            "lectoescritura": "",
            "analfabeto": "",
            "educacion_basica": "",
            "educacion_media": "",
            "educacion_superior": ""
        }),
        "categoria_residente": ficha.get("categoria", ""),
        "observaciones": ficha.get("observaciones", "")
    }

    # === DATOS DE INGRESO / UBICACIÓN (colección contratoIngresoMedicamentos) ===
    ingreso = db.contratoIngresoMedicamentos.find_one(
        {"rut_residente": rut},
        sort=[("_id", -1)],
        projection={"_id": 0}
    ) or {}
    ubicacion = ingreso.get("habitacion", "No asignada")
    ingresa_desde = ingreso.get("ingresa_desde", "No especificado")
    motivo_institucionalizacion = ingreso.get("motivo", "")

    # === DATOS DEL APODERADO (colección apoderado) ===
    apoderado = db.apoderado.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    datos_apoderado = {
        "nombre": apoderado.get("nombre", ""),
        "parentesco": apoderado.get("parentesco", ""),
        "telefono": apoderado.get("telefono", ""),
        "correo": apoderado.get("correo", "")
    }

    # === ANTECEDENTES MÉDICOS, PATOLOGÍAS Y ALERGIAS (colección urgenciasMedicas) ===
    alergias = list(db.urgenciasMedicas.find(
        {"rut_residente": rut, "tipo": "alergia"}, {"_id": 0}
    )) or []
    patologias = list(db.urgenciasMedicas.find(
        {"rut_residente": rut, "tipo": "patologia"}, {"_id": 0}
    )) or []
    antecedentes_medicos = {
        "diabetes_tipo_I": any("Diabetes tipo I" in p.get("nombre", "") for p in patologias),
        "diabetes_tipo_II": any("Diabetes tipo II" in p.get("nombre", "") for p in patologias),
        "glaucoma": any("Glaucoma" in p.get("nombre", "") for p in patologias),
        "patologia_renal": any("Patología renal" in p.get("nombre", "") for p in patologias),
        "epoc": any("EPOC" in p.get("nombre", "") for p in patologias),
        "cancer": [p for p in patologias if "Cancer" in p.get("nombre", "")],
        "artrosis": any("Artrosis" in p.get("nombre", "") for p in patologias),
        "otras_patologias": [p for p in patologias if p.get("nombre") not in [
            "Diabetes tipo I", "Diabetes tipo II", "Glaucoma", "Patología renal", "EPOC", "Artrosis"
        ]]
    }

    # === HISTORIA CLÍNICA (tipo atencion en urgenciasMedicas) ===
    historia_clinica = list(db.urgenciasMedicas.find(
        {"rut_residente": rut, "tipo": "atencion"}, {"_id": 0}
    )) or []

    # === EXÁMENES Y MEDICAMENTOS ===
    examenes = list(db.registrosVitales.find({"rut_residente": rut}, {"_id": 0})) or []
    medicamentos = list(db.medicamentos.find({"rut_residente": rut}, {"_id": 0})) or []

    # === FICHA CLÍNICA CONSOLIDADA ===
    ficha_completa = {
        "rut": rut,
        "datos_personales": datos_personales,
        "datos_sociales": datos_sociales,
        "ubicacion": ubicacion,
        "ingresa_desde": ingresa_desde,
        "motivo_institucionalizacion": motivo_institucionalizacion,
        "apoderado": datos_apoderado,
        "antecedentes_medicos": antecedentes_medicos,
        "alergias": alergias,
        "historia_clinica": historia_clinica,
        "examenes": examenes,
        "medicamentos_asociados": medicamentos
    }

    return jsonify(ficha_completa)
