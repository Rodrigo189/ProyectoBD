from flask import jsonify
from db_nosql import get_db

def get_ficha_completa(rut):
    """
    Obtener la ficha clínica completa del residente (estructura compatible con frontend React)
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
        description: Ficha clínica completa consolidada en estructura anidada
    """
    db = get_db()

    # === PACIENTE / DATOS PERSONALES ===
    paciente = db.paciente.find_one({"rut": rut}, {"_id": 0}) or {}
    datos_personales = {
        "rut_residente": paciente.get("rut", rut),
        "nombre": paciente.get("nombre", ""),
        "fecha_nacimiento": paciente.get("fecha_nacimiento", ""),
        "edad": paciente.get("edad", ""),
        "sexo": paciente.get("sexo", ""),
        "peso": paciente.get("peso", ""),
        "prevision_salud": paciente.get("prevision_salud", ""),
        "prevision_social": paciente.get("prevision_social", ""),  # por consistencia
        "direccion_actual": paciente.get("direccion", "")
    }

    # === UBICACIÓN ===
    ingreso = db.contratoIngresoMedicamentos.find_one(
        {"rut_residente": rut},
        sort=[("_id", -1)],
        projection={"_id": 0}
    ) or {}
    ubicacion = {
        "habitacion": ingreso.get("habitacion", ""),
        "ingresa_desde": ingreso.get("ingresa_desde", ""),
        "motivo_institucionalizacion": ingreso.get("motivo", "")
    }

    # === DATOS SOCIALES ===
    ficha = db.fichas.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    datos_sociales = {
        "religion": ficha.get("religion", ""),
        "actividad_laboral_previa": ficha.get("actividad_laboral_previa", ""),
        "estado_civil": ficha.get("estado_civil", ""),
        "vive_solo": ficha.get("vive_solo", False),
        "calidad_apoyo": ficha.get("calidad_apoyo", ""),
        "escolaridad": ficha.get("escolaridad", {
            "lectoescritura": False,
            "analfabeto": False,
            "educacion_basica": False,
            "educacion_media": False,
            "educacion_superior": False
        })
    }

    # === APODERADO ===
    apoderado_db = db.apoderado.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    apoderado = {
        "nombre": apoderado_db.get("nombre", ""),
        "parentesco": apoderado_db.get("parentesco", ""),
        "telefono": apoderado_db.get("telefono", ""),
        "correo": apoderado_db.get("correo", "")
    }

    # === ANTECEDENTES MÉDICOS ===
    patologias = list(db.urgenciasMedicas.find(
        {"rut_residente": rut, "tipo": "patologia"}, {"_id": 0}
    )) or []
    antecedentes_medicos = {
        "diabetes_tipo_I": any("Diabetes tipo I" in p.get("nombre", "") for p in patologias),
        "diabetes_tipo_II": any("Diabetes tipo II" in p.get("nombre", "") for p in patologias),
        "glaucoma": any("Glaucoma" in p.get("nombre", "") for p in patologias),
        "patologia_renal": any("Patología renal" in p.get("nombre", "") for p in patologias),
        "epoc": any("EPOC" in p.get("nombre", "") for p in patologias),
        "artrosis": any("Artrosis" in p.get("nombre", "") for p in patologias),
        "cancer": ", ".join([p.get("nombre", "") for p in patologias if "Cancer" in p.get("nombre", "")]),
        "otras_patologias": ", ".join([
            p.get("nombre", "") for p in patologias
            if p.get("nombre") not in [
                "Diabetes tipo I", "Diabetes tipo II", "Glaucoma",
                "Patología renal", "EPOC", "Artrosis"
            ]
        ])
    }

    # === HISTORIA CLÍNICA ===
    alergias = list(db.urgenciasMedicas.find(
        {"rut_residente": rut, "tipo": "alergia"}, {"_id": 0}
    )) or []
    historia_atenciones = list(db.urgenciasMedicas.find(
        {"rut_residente": rut, "tipo": "atencion"}, {"_id": 0}
    )) or []
    examenes = list(db.registrosVitales.find({"rut_residente": rut}, {"_id": 0})) or []
    medicamentos = list(db.medicamentos.find({"rut_residente": rut}, {"_id": 0})) or []

    historia_clinica = {
        "categoria_residente": ficha.get("categoria", ""),
        "alergias": ", ".join([a.get("nombre", "") for a in alergias]),
        "examenes": ", ".join([e.get("nombre", "") for e in examenes]),
        "medicamentos_asociados": ", ".join([m.get("nombre", "") for m in medicamentos]),
        "historial_atenciones": [
            {
                "fecha": a.get("fecha", ""),
                "motivo": a.get("nombre", ""),
                "detalle": a.get("detalle", "")
            }
            for a in historia_atenciones
        ]
    }

    # === ESTRUCTURA FINAL (idéntica a la del frontend) ===
    ficha_completa = {
        "datos_personales": datos_personales,
        "ubicacion": ubicacion,
        "datos_sociales": datos_sociales,
        "apoderado": apoderado,
        "antecedentes_medicos": antecedentes_medicos,
        "historia_clinica": historia_clinica
    }

    return jsonify(ficha_completa)
