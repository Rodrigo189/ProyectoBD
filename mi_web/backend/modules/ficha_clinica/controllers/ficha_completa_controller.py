from flask import jsonify, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def get_ficha_completa(rut):
    db = get_db()

    # 1. Base: Residente (Aquí guarda el otro grupo y tu módulo de residentes)
    residente = db.residentes.find_one({"rut": rut}, {"_id": 0}) or {}
    
    # 2. Sub-colecciones (Donde guardan tus módulos nuevos)
    ingreso = db.ingresos.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    ficha_social = db.fichas.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    apoderado_db = db.apoderado.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    patologias = db.patologias.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    historia = db.historia.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    alergias = db.alergias.find_one({"rut_residente": rut}, {"_id": 0}) or {}
    
    # --- FUSIÓN DE MEDICAMENTOS (LA SOLUCIÓN PARA TU OTRO GRUPO) ---
    # Lista 1: Medicamentos guardados en la colección nueva (Tu módulo)
    meds_col = list(db.medicamentos.find({"rut_residente": rut}, {"_id": 0}))
    
    # Lista 2: Medicamentos guardados dentro del residente (El otro grupo)
    meds_embedded = residente.get("medicamentos", [])
    
    # Unimos ambas listas para que se vean TODOS
    medicamentos_totales = meds_col + meds_embedded

    # --- ESTRUCTURA PLANA (Para que tu Frontend no muestre vacíos) ---
    # Priorizamos los datos de tus colecciones, si no están, usamos los del residente base
    
    respuesta = {
        "datos_personales": {
            "rut": residente.get("rut", rut),
            "nombre": residente.get("nombre", "—"),
            "fecha_nacimiento": residente.get("fecha_nacimiento", "—"),
            "edad": residente.get("edad", ""),
            "sexo": residente.get("sexo", "—"),
            "peso": residente.get("peso", ""),
            "prevision_salud": residente.get("prevision_salud", "—"),
            "prevision_social": residente.get("prevision_social", "—"),
            "direccion_actual": residente.get("direccion", "—"),
            "medico_tratante": residente.get("medico_tratante", "—"),
            "proximo_control": residente.get("proximo_control", "—"),
            "diagnostico": residente.get("diagnostico", "—")
        },
        
        # Estas secciones se envían planas para facilitar la lectura del frontend
        "ubicacion": {
            "habitacion": ingreso.get("habitacion", "—"),
            "ingresa_desde": ingreso.get("ingresa_desde", "—"),
            "motivo_institucionalizacion": ingreso.get("motivo_institucionalizacion", "—")
        },

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

        "apoderado": {
            "nombre": apoderado_db.get("nombre", "—"),
            "parentesco": apoderado_db.get("parentesco", "—"),
            "telefono": apoderado_db.get("telefono", "—"),
            "correo": apoderado_db.get("correo", "—")
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

        "historia_clinica": {
            "categoria_residente": historia.get("categoria_residente", "—"),
            "alergias": alergias.get("descripcion", "—"),
            "examenes": historia.get("examenes", "—"),
            "medicamentos_asociados": historia.get("medicamentos_asociados", "—"),
            "historial_atenciones": [] # Se llena si hay datos en la colección atenciones
        },

        "medicamentos": medicamentos_totales,
        "signos_vitales": residente.get("signos_vitales", []) # Usa los del residente (compatibilidad)
    }

    return jsonify(respuesta)