from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
from db import get_connection
from pymysql.cursors import DictCursor
import os


app = Flask(__name__)
CORS(app)

# ----------------------------
# Configuración Swagger
# ----------------------------
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "API Ficha Clínica ELEAM",
        "description": "Backend modular para ficha clínica ELEAM (Grupo 1). Incluye residentes, ficha clínica, apoderados, alergias, patologías, exámenes, medicamentos, atenciones e ingresos/egresos.",
        "version": "1.0.0"
    },
    "basePath": "/",
    "schemes": ["http"],
    "consumes": ["application/json"],
    "produces": ["application/json"]
})
# ============================================================
# ENDPOINT DE PRUEBA
# ============================================================
@app.route('/api/health', methods=['GET'])
def health():
    """Healthcheck
    ---
    tags:
      - System
    responses:
      200:
        description: API funcionando
        examples:
          application/json: { "status": "ok" }
    """
    return jsonify({"status": "ok"})
# ============================================================
# RESIDENTES
# ============================================================

@app.route('/api/residentes', methods=['POST'])
def create_or_update_residente():
    """Crear o actualizar residente
    ---
    tags:
      - Residentes
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - rut
            - nombre
            - fecha_nacimiento
            - fecha_ingreso
          properties:
            rut:
              type: string
              example: "11111111-1"
            nombre:
              type: string
              example: "Ana García"
            fecha_nacimiento:
              type: string
              format: date
              example: "1950-05-15"
            fecha_ingreso:
              type: string
              format: date
              example: "2024-01-01"
            medico_tratante:
              type: string
              example: "Dr. Martínez"
            proximo_control:
              type: string
              format: date
              example: "2025-10-15"
            diagnostico:
              type: string
              example: "Hipertensión"
    responses:
      200:
        description: Residente creado o actualizado
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO residentes (rut, nombre, fecha_nacimiento, fecha_ingreso,
                                        medico_tratante, proximo_control, diagnostico)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE
                    nombre=VALUES(nombre),
                    fecha_nacimiento=VALUES(fecha_nacimiento),
                    fecha_ingreso=VALUES(fecha_ingreso),
                    medico_tratante=VALUES(medico_tratante),
                    proximo_control=VALUES(proximo_control),
                    diagnostico=VALUES(diagnostico)
            """, (
                data.get("rut"),
                data.get("nombre"),
                data.get("fecha_nacimiento"),
                data.get("fecha_ingreso"),
                data.get("medico_tratante"),
                data.get("proximo_control"),
                data.get("diagnostico")
            ))
        conn.commit()
        return jsonify({"message": "Residente creado o actualizado"})
    finally:
        conn.close()


@app.route('/api/residentes', methods=['GET'])
def get_residentes():
    """Obtener listado de todos los residentes
    ---
    tags:
      - Residentes
    responses:
      200:
        description: Lista de residentes básicos
        schema:
          type: array
          items:
            type: object
            properties:
              rut:
                type: string
              nombre:
                type: string
              fecha_nacimiento:
                type: string
                format: date
              fecha_ingreso:
                type: string
                format: date
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("SELECT rut, nombre, fecha_nacimiento, fecha_ingreso FROM residentes")
            residentes = cursor.fetchall()
        return jsonify(residentes)
    finally:
        conn.close()


@app.route('/api/residentes/<rut>', methods=['DELETE'])
def delete_residente(rut):
    """Eliminar residente (y dependencias directas)
    ---
    tags:
      - Residentes
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Residente eliminado correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # Eliminar dependencias primero
            cursor.execute("DELETE FROM contrato_ingreso WHERE residente_rut=%s", (rut,))
            cursor.execute("DELETE FROM residente_apoderado WHERE residente_rut=%s", (rut,))
            cursor.execute("DELETE FROM residente_alergia WHERE residente_rut=%s", (rut,))
            cursor.execute("DELETE FROM residente_patologia WHERE residente_rut=%s", (rut,))
            cursor.execute("DELETE FROM residente_examen WHERE residente_rut=%s", (rut,))
            cursor.execute("DELETE FROM atencion WHERE residente_rut=%s", (rut,))
            cursor.execute("DELETE FROM medicamentos WHERE rut_residente=%s", (rut,))
            cursor.execute("DELETE FROM residente_ficha WHERE residente_rut=%s", (rut,))

            # Finalmente el residente
            cursor.execute("DELETE FROM residentes WHERE rut=%s", (rut,))
        conn.commit()
        return jsonify({"message": f"Residente {rut} eliminado con todas sus dependencias"})
    finally:
        conn.close()
# ============================================================
# FICHA CLÍNICA
# ============================================================

@app.route('/api/residentes/<rut>/ficha', methods=['POST'])
def save_ficha(rut):
    """Crear o actualizar ficha clínica del residente
    ---
    tags:
      - Ficha clínica
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - prevision_salud_id
            - prevision_social_id
            - escolaridad_id
            - calidad_apoyo_id
          properties:
            prevision_salud_id:
              type: integer
              example: 1
            prevision_social_id:
              type: integer
              example: 2
            escolaridad_id:
              type: integer
              example: 3
            calidad_apoyo_id:
              type: integer
              example: 1
            vive_solo:
              type: boolean
              example: false
    responses:
      200:
        description: Ficha clínica guardada
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO residente_ficha (residente_rut, prevision_salud_id, prevision_social_id,
                                             escolaridad_id, calidad_apoyo_id, vive_solo)
                VALUES (%s,%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE
                    prevision_salud_id=VALUES(prevision_salud_id),
                    prevision_social_id=VALUES(prevision_social_id),
                    escolaridad_id=VALUES(escolaridad_id),
                    calidad_apoyo_id=VALUES(calidad_apoyo_id),
                    vive_solo=VALUES(vive_solo)
            """, (
                rut,
                data.get("prevision_salud_id"),
                data.get("prevision_social_id"),
                data.get("escolaridad_id"),
                data.get("calidad_apoyo_id"),
                data.get("vive_solo", False)
            ))
        conn.commit()
        return jsonify({"message": "Ficha clínica guardada"})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/ficha', methods=['GET'])
def get_ficha(rut):
    """Obtener ficha clínica parcial de un residente
    ---
    tags:
      - Ficha clínica
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Datos básicos de la ficha clínica
        schema:
          type: object
          properties:
            residente_rut:
              type: string
            prevision_salud_id:
              type: integer
            prevision_social_id:
              type: integer
            escolaridad_id:
              type: integer
            calidad_apoyo_id:
              type: integer
            vive_solo:
              type: boolean
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("SELECT * FROM residente_ficha WHERE residente_rut=%s", (rut,))
            ficha = cursor.fetchone()
        return jsonify(ficha if ficha else {})
    finally:
        conn.close()
# ============================================================
# APODERADOS
# ============================================================

@app.route('/api/residentes/<rut>/apoderado', methods=['POST'])
def save_apoderado(rut):
    """Crear apoderado de un residente
    ---
    tags:
      - Apoderados
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nombre
            - parentesco
            - telefono
          properties:
            nombre:
              type: string
              example: "Juan Pérez"
            parentesco:
              type: string
              example: "Hijo"
            telefono:
              type: string
              example: "+56912345678"
            correo:
              type: string
              example: "juanperez@mail.com"
            es_principal:
              type: boolean
              example: true
    responses:
      200:
        description: Apoderado creado
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO apoderado (nombre, parentesco, telefono, correo)
                VALUES (%s, %s, %s, %s)
            """, (
                data.get("nombre"),
                data.get("parentesco"),
                data.get("telefono"),
                data.get("correo")
            ))
            apoderado_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO residente_apoderado (residente_rut, apoderado_id, es_principal)
                VALUES (%s, %s, %s)
            """, (rut, apoderado_id, data.get("es_principal", 0)))
        conn.commit()
        return jsonify({"message": "Apoderado creado", "apoderado_id": apoderado_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/apoderados', methods=['GET'])
def get_apoderados(rut):
    """Listar apoderados de un residente
    ---
    tags:
      - Apoderados
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de apoderados asociados al residente
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              nombre:
                type: string
              parentesco:
                type: string
              telefono:
                type: string
              correo:
                type: string
              es_principal:
                type: boolean
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT a.id, a.nombre, a.parentesco, a.telefono, a.correo, ra.es_principal
                FROM residente_apoderado ra
                JOIN apoderado a ON ra.apoderado_id = a.id
                WHERE ra.residente_rut = %s
            """, (rut,))
            apoderados = cursor.fetchall()
        return jsonify(apoderados)
    finally:
        conn.close()


@app.route('/api/apoderados/<int:id>', methods=['PUT'])
def update_apoderado(id):
    """Actualizar apoderado
    ---
    tags:
      - Apoderados
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del apoderado
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
              example: "Pedro López"
            parentesco:
              type: string
              example: "Hermano"
            telefono:
              type: string
              example: "+56998765432"
            correo:
              type: string
              example: "pedrolopez@mail.com"
    responses:
      200:
        description: Apoderado actualizado
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE apoderado
                SET nombre=%s, parentesco=%s, telefono=%s, correo=%s
                WHERE id=%s
            """, (
                data.get("nombre"),
                data.get("parentesco"),
                data.get("telefono"),
                data.get("correo"),
                id
            ))
        conn.commit()
        return jsonify({"message": "Apoderado actualizado"})
    finally:
        conn.close()


@app.route('/api/apoderados/<int:id>', methods=['DELETE'])
def delete_apoderado(id):
    """Eliminar apoderado
    ---
    tags:
      - Apoderados
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del apoderado
    responses:
      200:
        description: Apoderado eliminado correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM residente_apoderado WHERE apoderado_id=%s", (id,))
            cursor.execute("DELETE FROM apoderado WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Apoderado eliminado"})
    finally:
        conn.close()
# ============================================================
# ALERGIAS
# ============================================================

@app.route('/api/residentes/<rut>/alergias', methods=['POST'])
def add_alergia(rut):
    """Agregar alergia al residente
    ---
    tags:
      - Alergias
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - descripcion
          properties:
            descripcion:
              type: string
              example: "Alergia a la penicilina"
    responses:
      200:
        description: Alergia agregada correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO residente_alergia (residente_rut, descripcion)
                VALUES (%s, %s)
            """, (rut, data.get("descripcion")))
            alergia_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "Alergia agregada", "id": alergia_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/alergias', methods=['GET'])
def get_alergias(rut):
    """Listar alergias de un residente
    ---
    tags:
      - Alergias
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de alergias del residente
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              descripcion:
                type: string
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT id, descripcion
                FROM residente_alergia
                WHERE residente_rut = %s
            """, (rut,))
            alergias = cursor.fetchall()
        return jsonify(alergias)
    finally:
        conn.close()


@app.route('/api/alergias/<int:id>', methods=['PUT'])
def update_alergia(id):
    """Actualizar alergia
    ---
    tags:
      - Alergias
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID de la alergia
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
              example: "Alergia a la aspirina"
    responses:
      200:
        description: Alergia actualizada correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE residente_alergia
                SET descripcion=%s
                WHERE id=%s
            """, (data.get("descripcion"), id))
        conn.commit()
        return jsonify({"message": "Alergia actualizada"})
    finally:
        conn.close()


@app.route('/api/alergias/<int:id>', methods=['DELETE'])
def delete_alergia(id):
    """Eliminar alergia
    ---
    tags:
      - Alergias
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID de la alergia
    responses:
      200:
        description: Alergia eliminada correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM residente_alergia WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Alergia eliminada"})
    finally:
        conn.close()
# ============================================================
# PATOLOGÍAS
# ============================================================

@app.route('/api/residentes/<rut>/patologias', methods=['POST'])
def add_patologia(rut):
    """Agregar patología al residente
    ---
    tags:
      - Patologías
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - patologia_id
          properties:
            patologia_id:
              type: integer
              example: 1
            detalle:
              type: string
              example: "Diabetes tipo II controlada"
    responses:
      200:
        description: Patología agregada correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO residente_patologia (residente_rut, patologia_id, detalle, vigente)
                VALUES (%s, %s, %s, 1)
            """, (rut, data.get("patologia_id"), data.get("detalle")))
            patologia_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "Patología agregada", "id": patologia_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/patologias', methods=['GET'])
def get_patologias(rut):
    """Listar patologías de un residente
    ---
    tags:
      - Patologías
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de patologías del residente
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              patologia:
                type: string
              detalle:
                type: string
              vigente:
                type: boolean
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT rp.id, p.nombre AS patologia, rp.detalle, rp.vigente
                FROM residente_patologia rp
                JOIN patologia p ON rp.patologia_id = p.id
                WHERE rp.residente_rut = %s
            """, (rut,))
            patologias = cursor.fetchall()
        return jsonify(patologias)
    finally:
        conn.close()


@app.route('/api/patologias/<int:id>', methods=['PUT'])
def update_patologia(id):
    """Actualizar detalle o vigencia de una patología
    ---
    tags:
      - Patologías
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID de la patología
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            detalle:
              type: string
              example: "Hipertensión en tratamiento"
            vigente:
              type: boolean
              example: true
    responses:
      200:
        description: Patología actualizada correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE residente_patologia
                SET detalle=%s, vigente=%s
                WHERE id=%s
            """, (data.get("detalle"), data.get("vigente", 1), id))
        conn.commit()
        return jsonify({"message": "Patología actualizada"})
    finally:
        conn.close()


@app.route('/api/patologias/<int:id>', methods=['DELETE'])
def delete_patologia(id):
    """Eliminar una patología
    ---
    tags:
      - Patologías
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID de la patología
    responses:
      200:
        description: Patología eliminada correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM residente_patologia WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Patología eliminada"})
    finally:
        conn.close()
# ============================================================
# EXÁMENES
# ============================================================

@app.route('/api/residentes/<rut>/examenes', methods=['POST'])
def add_examen(rut):
    """Registrar examen de un residente
    ---
    tags:
      - Exámenes
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - examen_tipo_id
            - fecha
          properties:
            examen_tipo_id:
              type: integer
              example: 2
            fecha:
              type: string
              example: "2025-09-01"
            resultado_texto:
              type: string
              example: "Hemograma normal"
            archivo_url:
              type: string
              example: "https://mi-eleam.cl/examenes/hemograma123.pdf"
    responses:
      200:
        description: Examen registrado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO residente_examen (residente_rut, examen_tipo_id, fecha, resultado_texto, archivo_url)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                rut,
                data.get("examen_tipo_id"),
                data.get("fecha"),
                data.get("resultado_texto"),
                data.get("archivo_url")
            ))
            examen_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "Examen agregado", "id": examen_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/examenes', methods=['GET'])
def get_examenes(rut):
    """Listar exámenes de un residente
    ---
    tags:
      - Exámenes
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de exámenes del residente
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              tipo_examen:
                type: string
              fecha:
                type: string
              resultado_texto:
                type: string
              archivo_url:
                type: string
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT re.id, et.nombre AS tipo_examen, re.fecha, re.resultado_texto, re.archivo_url
                FROM residente_examen re
                JOIN examen_tipo et ON re.examen_tipo_id = et.id
                WHERE re.residente_rut = %s
            """, (rut,))
            examenes = cursor.fetchall()
        return jsonify(examenes)
    finally:
        conn.close()


@app.route('/api/examenes/<int:id>', methods=['PUT'])
def update_examen(id):
    """Actualizar un examen
    ---
    tags:
      - Exámenes
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del examen
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            examen_tipo_id:
              type: integer
              example: 3
            fecha:
              type: string
              example: "2025-09-10"
            resultado_texto:
              type: string
              example: "Colesterol alto"
            archivo_url:
              type: string
              example: "https://mi-eleam.cl/examenes/colesterol123.pdf"
    responses:
      200:
        description: Examen actualizado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE residente_examen
                SET examen_tipo_id=%s, fecha=%s, resultado_texto=%s, archivo_url=%s
                WHERE id=%s
            """, (
                data.get("examen_tipo_id"),
                data.get("fecha"),
                data.get("resultado_texto"),
                data.get("archivo_url"),
                id
            ))
        conn.commit()
        return jsonify({"message": "Examen actualizado"})
    finally:
        conn.close()


@app.route('/api/examenes/<int:id>', methods=['DELETE'])
def delete_examen(id):
    """Eliminar examen
    ---
    tags:
      - Exámenes
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del examen
    responses:
      200:
        description: Examen eliminado correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM residente_examen WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Examen eliminado"})
    finally:
        conn.close()
# ============================================================
# MEDICAMENTOS
# ============================================================

@app.route('/api/residentes/<rut>/medicamentos', methods=['POST'])
def add_medicamento(rut):
    """Agregar medicamento al residente
    ---
    tags:
      - Medicamentos
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nombre
            - dosis
          properties:
            nombre:
              type: string
              example: "Paracetamol"
            dosis:
              type: string
              example: "500mg cada 8 horas"
            caso_sos:
              type: boolean
              example: false
            medico_indicador:
              type: string
              example: "Dr. Martínez"
            fecha_inicio:
              type: string
              example: "2025-09-01"
            fecha_termino:
              type: string
              example: "2025-09-10"
    responses:
      200:
        description: Medicamento agregado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO medicamentos (rut_residente, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (
                rut,
                data.get("nombre"),
                data.get("dosis"),
                data.get("caso_sos", 0),
                data.get("medico_indicador"),
                data.get("fecha_inicio"),
                data.get("fecha_termino")
            ))
            medicamento_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "Medicamento agregado", "id": medicamento_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/medicamentos', methods=['GET'])
def get_medicamentos(rut):
    """Listar medicamentos de un residente
    ---
    tags:
      - Medicamentos
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de medicamentos asociados al residente
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              nombre:
                type: string
              dosis:
                type: string
              caso_sos:
                type: boolean
              medico_indicador:
                type: string
              fecha_inicio:
                type: string
              fecha_termino:
                type: string
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT id, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino
                FROM medicamentos
                WHERE rut_residente=%s
            """, (rut,))
            medicamentos = cursor.fetchall()
        return jsonify(medicamentos)
    finally:
        conn.close()


@app.route('/api/medicamentos/<int:id>', methods=['PUT'])
def update_medicamento(id):
    """Actualizar medicamento
    ---
    tags:
      - Medicamentos
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del medicamento
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
              example: "Ibuprofeno"
            dosis:
              type: string
              example: "400mg cada 12 horas"
            caso_sos:
              type: boolean
              example: true
            medico_indicador:
              type: string
              example: "Dr. López"
            fecha_inicio:
              type: string
              example: "2025-09-15"
            fecha_termino:
              type: string
              example: "2025-09-20"
    responses:
      200:
        description: Medicamento actualizado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE medicamentos
                SET nombre=%s, dosis=%s, caso_sos=%s, medico_indicador=%s, fecha_inicio=%s, fecha_termino=%s
                WHERE id=%s
            """, (
                data.get("nombre"),
                data.get("dosis"),
                data.get("caso_sos", 0),
                data.get("medico_indicador"),
                data.get("fecha_inicio"),
                data.get("fecha_termino"),
                id
            ))
        conn.commit()
        return jsonify({"message": "Medicamento actualizado"})
    finally:
        conn.close()


@app.route('/api/medicamentos/<int:id>', methods=['DELETE'])
def delete_medicamento(id):
    """Eliminar medicamento
    ---
    tags:
      - Medicamentos
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del medicamento
    responses:
      200:
        description: Medicamento eliminado correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM medicamentos WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Medicamento eliminado"})
    finally:
        conn.close()
# ============================================================
# ATENCIONES
# ============================================================

@app.route('/api/residentes/<rut>/atenciones', methods=['POST'])
def add_atencion(rut):
    """Registrar atención médica del residente
    ---
    tags:
      - Atenciones
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - fecha
            - motivo
            - profesional
          properties:
            fecha:
              type: string
              example: "2025-09-27"
            motivo:
              type: string
              example: "Control de presión arterial"
            profesional:
              type: string
              example: "Enfermera Pérez"
            area:
              type: string
              example: "Medicina General"
            observaciones:
              type: string
              example: "Paciente estable, continuar tratamiento actual"
    responses:
      200:
        description: Atención registrada
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO atencion (residente_rut, fecha, motivo, profesional, area, observaciones)
                VALUES (%s,%s,%s,%s,%s,%s)
            """, (
                rut,
                data.get("fecha"),
                data.get("motivo"),
                data.get("profesional"),
                data.get("area"),
                data.get("observaciones")
            ))
            atencion_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "Atención registrada", "id": atencion_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/atenciones', methods=['GET'])
def get_atenciones(rut):
    """Obtener historial de atenciones de un residente
    ---
    tags:
      - Atenciones
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de atenciones del residente
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT id, fecha, motivo, profesional, area, observaciones
                FROM atencion
                WHERE residente_rut=%s
                ORDER BY fecha DESC
            """, (rut,))
            atenciones = cursor.fetchall()
        return jsonify(atenciones)
    finally:
        conn.close()


@app.route('/api/atenciones/<int:id>', methods=['PUT'])
def update_atencion(id):
    """Actualizar una atención
    ---
    tags:
      - Atenciones
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID de la atención
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            fecha:
              type: string
              example: "2025-09-27"
            motivo:
              type: string
              example: "Chequeo post operatorio"
            profesional:
              type: string
              example: "Dr. López"
            area:
              type: string
              example: "Cirugía"
            observaciones:
              type: string
              example: "Se indica reposo y analgésicos"
    responses:
      200:
        description: Atención actualizada correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE atencion
                SET fecha=%s, motivo=%s, profesional=%s, area=%s, observaciones=%s
                WHERE id=%s
            """, (
                data.get("fecha"),
                data.get("motivo"),
                data.get("profesional"),
                data.get("area"),
                data.get("observaciones"),
                id
            ))
        conn.commit()
        return jsonify({"message": "Atención actualizada"})
    finally:
        conn.close()


@app.route('/api/atenciones/<int:id>', methods=['DELETE'])
def delete_atencion(id):
    """Eliminar una atención
    ---
    tags:
      - Atenciones
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID de la atención
    responses:
      200:
        description: Atención eliminada correctamente
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM atencion WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Atención eliminada"})
    finally:
        conn.close()
# ============================================================
# INGRESOS Y EGRESOS
# ============================================================

@app.route('/api/residentes/<rut>/ingreso', methods=['POST'])
def registrar_ingreso(rut):
    """Registrar ingreso del residente
    ---
    tags:
      - Ingresos
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - habitacion_id
            - fecha_ingreso
            - origen_ingreso_id
            - categoria_residente_id
          properties:
            habitacion_id:
              type: integer
              example: 1
            fecha_ingreso:
              type: string
              example: "2025-09-27"
            origen_ingreso_id:
              type: integer
              example: 2
            categoria_residente_id:
              type: integer
              example: 1
    responses:
      200:
        description: Ingreso registrado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO contrato_ingreso (residente_rut, habitacion_id, fecha_ingreso, origen_ingreso_id, categoria_residente_id)
                VALUES (%s,%s,%s,%s,%s)
            """, (
                rut,
                data.get("habitacion_id"),
                data.get("fecha_ingreso"),
                data.get("origen_ingreso_id"),
                data.get("categoria_residente_id")
            ))
            ingreso_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "Ingreso registrado", "id": ingreso_id})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/ingresos', methods=['GET'])
def get_ingresos(rut):
    """Obtener historial de ingresos del residente
    ---
    tags:
      - Ingresos
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Lista de ingresos
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT ci.id, ci.fecha_ingreso, ci.fecha_egreso, ci.motivo_institucionalizacion,
                       h.codigo AS habitacion, h.piso, h.ala,
                       cr.nombre AS categoria, oi.nombre AS origen
                FROM contrato_ingreso ci
                LEFT JOIN habitacion h ON ci.habitacion_id = h.id
                LEFT JOIN categoria_residente cr ON ci.categoria_residente_id = cr.id
                LEFT JOIN origen_ingreso oi ON ci.origen_ingreso_id = oi.id
                WHERE ci.residente_rut=%s
                ORDER BY ci.fecha_ingreso DESC
            """, (rut,))
            ingresos = cursor.fetchall()
        return jsonify(ingresos)
    finally:
        conn.close()


@app.route('/api/ingresos/<int:id>', methods=['PUT'])
def update_ingreso(id):
    """Actualizar información de un ingreso
    ---
    tags:
      - Ingresos
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del ingreso
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            habitacion_id:
              type: integer
              example: 1
            fecha_ingreso:
              type: string
              example: "2025-09-27"
            origen_ingreso_id:
              type: integer
              example: 2
            categoria_residente_id:
              type: integer
              example: 1
    responses:
      200:
        description: Ingreso actualizado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE contrato_ingreso
                SET habitacion_id=%s, fecha_ingreso=%s, origen_ingreso_id=%s, categoria_residente_id=%s
                WHERE id=%s
            """, (
                data.get("habitacion_id"),
                data.get("fecha_ingreso"),
                data.get("origen_ingreso_id"),
                data.get("categoria_residente_id"),
                id
            ))
        conn.commit()
        return jsonify({"message": "Ingreso actualizado"})
    finally:
        conn.close()


@app.route('/api/ingresos/<int:id>', methods=['DELETE'])
def delete_ingreso(id):
    """Eliminar un ingreso (solo si no tiene egreso asociado)
    ---
    tags:
      - Ingresos
    parameters:
      - name: id
        in: path
        required: true
        type: integer
        description: ID del ingreso
    responses:
      200:
        description: Ingreso eliminado (si no tenía egreso)
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM contrato_ingreso WHERE id=%s AND fecha_egreso IS NULL", (id,))
        conn.commit()
        return jsonify({"message": "Ingreso eliminado (si no tenía egreso registrado)"})
    finally:
        conn.close()


@app.route('/api/residentes/<rut>/egreso', methods=['POST'])
def registrar_egreso(rut):
    """Registrar egreso del residente (cierra el último ingreso)
    ---
    tags:
      - Egresos
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - fecha_egreso
            - motivo_institucionalizacion
          properties:
            fecha_egreso:
              type: string
              example: "2025-10-01"
            motivo_institucionalizacion:
              type: string
              example: "Alta médica y retorno a su hogar"
    responses:
      200:
        description: Egreso registrado correctamente
    """
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE contrato_ingreso
                SET fecha_egreso=%s, motivo_institucionalizacion=%s
                WHERE residente_rut=%s
                ORDER BY fecha_ingreso DESC
                LIMIT 1
            """, (
                data.get("fecha_egreso"),
                data.get("motivo_institucionalizacion"),
                rut
            ))
        conn.commit()
        return jsonify({"message": "Egreso registrado"})
    finally:
        conn.close()
# ============================================================
# UBICACIÓN ACTUAL DEL RESIDENTE
# ============================================================

@app.route('/api/residentes/<rut>/ubicacion', methods=['GET'])
def get_ubicacion(rut):
    """Obtener la ubicación actual (habitación) del residente
    ---
    tags:
      - Residentes
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Habitación actual del residente
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            cursor.execute("""
                SELECT h.codigo, h.piso, h.ala, h.estado
                FROM contrato_ingreso ci
                JOIN habitacion h ON ci.habitacion_id = h.id
                WHERE ci.residente_rut=%s
                ORDER BY ci.fecha_ingreso DESC
                LIMIT 1
            """, (rut,))
            ubicacion = cursor.fetchone()
        return jsonify(ubicacion if ubicacion else {})
    finally:
        conn.close()


# ============================================================
# FICHA CLÍNICA COMPLETA
# ============================================================

@app.route('/api/residentes/<rut>/ficha-completa', methods=['GET'])
def get_ficha_completa(rut):
    """Ficha clínica completa del residente
    ---
    tags:
      - Ficha clínica
    parameters:
      - name: rut
        in: path
        required: true
        type: string
        description: RUT del residente
    responses:
      200:
        description: Datos completos de la ficha clínica
    """
    conn = get_connection()
    try:
        with conn.cursor(DictCursor) as cursor:
            # Datos personales del residente
            cursor.execute("""
                SELECT rut, nombre, fecha_nacimiento,
                       TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS edad,
                       fecha_ingreso, medico_tratante, proximo_control, diagnostico
                FROM residentes
                WHERE rut = %s
            """, (rut,))
            residente = cursor.fetchone()

            # Ficha clínica
            cursor.execute("""
                SELECT f.*, 
                       ps.nombre AS prevision_salud,
                       psoc.nombre AS prevision_social,
                       e.nombre AS escolaridad,
                       ca.descripcion AS calidad_apoyo
                FROM residente_ficha f
                LEFT JOIN prevision_salud ps ON f.prevision_salud_id = ps.id
                LEFT JOIN prevision_social psoc ON f.prevision_social_id = psoc.id
                LEFT JOIN escolaridad e ON f.escolaridad_id = e.id
                LEFT JOIN calidad_apoyo ca ON f.calidad_apoyo_id = ca.id
                WHERE f.residente_rut = %s
            """, (rut,))
            ficha = cursor.fetchone()

            # Ubicación actual
            cursor.execute("""
                SELECT h.codigo, h.piso, h.ala, h.estado
                FROM contrato_ingreso ci
                JOIN habitacion h ON ci.habitacion_id = h.id
                WHERE ci.residente_rut = %s
                ORDER BY ci.fecha_ingreso DESC
                LIMIT 1
            """, (rut,))
            ubicacion = cursor.fetchone()

            # Categoría de residente
            cursor.execute("""
                SELECT cr.nombre, cr.descripcion
                FROM contrato_ingreso ci
                JOIN categoria_residente cr ON ci.categoria_residente_id = cr.id
                WHERE ci.residente_rut = %s
                ORDER BY ci.fecha_ingreso DESC
                LIMIT 1
            """, (rut,))
            categoria = cursor.fetchone()

            # Apoderados
            cursor.execute("""
                SELECT a.id, a.nombre, a.parentesco, a.telefono, a.correo
                FROM residente_apoderado ra
                JOIN apoderado a ON ra.apoderado_id = a.id
                WHERE ra.residente_rut = %s
            """, (rut,))
            apoderados = cursor.fetchall()

            # Alergias
            cursor.execute("""
                SELECT id, descripcion
                FROM residente_alergia
                WHERE residente_rut = %s
            """, (rut,))
            alergias = cursor.fetchall()

            # Patologías
            cursor.execute("""
                SELECT rp.id, p.nombre AS patologia, rp.detalle, rp.vigente
                FROM residente_patologia rp
                JOIN patologia p ON rp.patologia_id = p.id
                WHERE rp.residente_rut = %s
            """, (rut,))
            patologias = cursor.fetchall()

            # Exámenes
            cursor.execute("""
                SELECT re.id, et.nombre AS tipo_examen, re.fecha, re.resultado_texto, re.archivo_url
                FROM residente_examen re
                JOIN examen_tipo et ON re.examen_tipo_id = et.id
                WHERE re.residente_rut = %s
            """, (rut,))
            examenes = cursor.fetchall()

            # Atenciones
            cursor.execute("""
                SELECT id, fecha, motivo, profesional, area, observaciones
                FROM atencion
                WHERE residente_rut = %s
                ORDER BY fecha DESC
            """, (rut,))
            atenciones = cursor.fetchall()

            # Medicamentos asociados
            cursor.execute("""
                SELECT id, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino
                FROM medicamentos
                WHERE rut_residente = %s
            """, (rut,))
            medicamentos = cursor.fetchall()

        return jsonify({
            "residente": residente,
            "ficha": ficha,
            "ubicacion": ubicacion,
            "categoria_residente": categoria,
            "apoderados": apoderados,
            "alergias": alergias,
            "patologias": patologias,
            "examenes": examenes,
            "atenciones": atenciones,
            "medicamentos": medicamentos
        })
    finally:
        conn.close()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)



