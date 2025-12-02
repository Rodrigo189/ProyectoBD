from flask import jsonify, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def get_ficha_completa(rut):
    db = get_db()

    # 1. Base: Residente
    residente = db.residentes.find_one({"rut": rut}, {"_id": 0}) or {}
    
    # 2. Sub-colecciones (Buscamos por rut_residente)
    ingreso = db.ingresos.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    ficha_social = db.fichas.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    apoderado_db = db.apoderado.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    patologias = db.patologias.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    historia = db.historia.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    alergias = db.alergias.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    
    # Listas
    medicamentos = list(db.medicamentos.find({"rut_residente": rut}, {"_id": 0}))
    
    # Signos vitales: Prioridad array del residente, si no, busca en colección externa
    signos_vitales = residente.get("signos_vitales", [])
    if not signos_vitales:
        signos_vitales = list(db.registrosVitales.find({"rut_residente": rut}, {"_id": 0}))

    # --- CONSTRUCCIÓN DEL JSON FINAL ---
    respuesta = {
        "rut": residente.get("rut", rut),
        "nombre": residente.get("nombre", "—"),
        "fecha_nacimiento": residente.get("fecha_nacimiento", "—"),
        "fecha_ingreso": residente.get("fecha_ingreso", "—"),
        "sexo": residente.get("sexo", "—"),
        "direccion": residente.get("direccion", "—"),
        "prevision_salud": residente.get("prevision_salud", "—"),
        "medico_tratante": residente.get("medico_tratante", "—"),
        "proximo_control": residente.get("proximo_control", "—"),
        "diagnostico": residente.get("diagnostico", "—"),

        "apoderado": {
            "nombre": apoderado_db.get("nombre", "—"),
            "parentesco": apoderado_db.get("parentesco", "—"),
            "telefono": apoderado_db.get("telefono", "—"),
            "correo": apoderado_db.get("correo", "—")
        },

        "ficha_clinica": {
            "datos_sociales": {
                "religion": ficha_social.get("religion", "—"),
                "actividad_laboral_previa": ficha_social.get("actividad_laboral_previa", "—"),
                "estado_civil": ficha_social.get("estado_civil", "—"),
                "vive_solo": ficha_social.get("vive_solo", False),
                "calidad_apoyo": ficha_social.get("calidad_apoyo", "—"),
                "escolaridad": ficha_social.get("escolaridad", {
                    "lectoescritura": "—", "analfabeto": "—", 
                    "educacion_basica": "—", "educacion_media": "—", "educacion_superior": "—"
                })
            },
            "antecedentes_medicos": {
                "diabetes_tipo_I": patologias.get("diabetes_tipo_I", False),
                "diabetes_tipo_II": patologias.get("diabetes_tipo_II", False),
                "glaucoma": patologias.get("glaucoma", False),
                "patologia_renal": patologias.get("patologia_renal", False),
                "detalle_patologia_renal": patologias.get("detalle_patologia_renal", "—"),
                "epoc": patologias.get("epoc", False),
                "artrosis": patologias.get("artrosis", False),
                "cancer": patologias.get("cancer", "—"),
                "otras_patologias": patologias.get("otras_patologias", "—")
            },
            "ubicacion": {
                "habitacion": ingreso.get("habitacion", "—"),
                "ingresa_desde": ingreso.get("ingresa_desde", "—"),
                "motivo_institucionalizacion": ingreso.get("motivo_institucionalizacion", "—")
            },
            "historia_clinica": {
                "categoria_residente": historia.get("categoria_residente", "—"),
                "alergias": alergias.get("descripcion", "—"),
                "examenes": historia.get("examenes", "—"),
                "medicamentos_asociados": historia.get("medicamentos_asociados", "—"),
                "historial_atenciones": [] 
            }
        },

        "medicamentos": medicamentos,
        "signos_vitales": signos_vitales
    }

    return jsonify(respuesta)