from flask import jsonify, request
from db_nosql import get_db
from bson import ObjectId

def add_atencion():
    """
    Registrar una atención médica
    ---
    tags:
      - Atenciones
    parameters:
      - in: body
        name: body
        required: true
        description: Datos de la atención
        schema:
          type: object
          properties:
            rut_residente:
              type: string
            fecha:
              type: string
              example: "2025-10-10"
            hora:
              type: string
              example: "10:30"
            motivo:
              type: string
              example: "Control general"
            tratante:
              type: string
              example: "Dra. López"
            medicamentos:
              type: string
              example: "Paracetamol 500mg"
    responses:
      200:
        description: Atención registrada correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN: Usar la colección 'db.atenciones' ---
    db.atenciones.insert_one(data)
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": "Atención registrada"})

def get_atenciones(rut_residente):
    """
    Obtener atenciones médicas por residente
    ---
    tags:
      - Atenciones
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
    responses:
      200:
        description: Lista de atenciones médicas
    """
    db = get_db()
    
    # --- CORRECCIÓN: Usar la colección 'db.atenciones' ---
    atenciones = list(db.atenciones.find({"rut_residente": rut_residente}, {"_id": 0}))
    # --- FIN CORRECCIÓN ---
    
    return jsonify(atenciones)

def update_atencion(id):
    """
    Actualizar una atención médica
    ---
    tags:
      - Atenciones
    parameters:
      - in: path
        name: id
        type: string
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            motivo:
              type: string
              example: "Chequeo cardiológico"
    responses:
      200:
        description: Atención actualizada correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN: Usar la colección 'db.atenciones' ---
    result = db.atenciones.update_one({"_id": ObjectId(id)}, {"$set": data})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.modified_count} atención(es) actualizada(s)"})

def delete_atenciones_por_rut(rut_residente):
    """
    Eliminar TODAS las atenciones médicas de un residente
    ---
    tags:
      - Atenciones
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuyas atenciones se eliminarán
    responses:
      200:
        description: Atenciones eliminadas correctamente
    """
    db = get_db()
    
    # --- CORRECCIÓN: Borrar por RUT (delete_many) y usar 'db.atenciones' ---
    result = db.atenciones.delete_many({"rut_residente": rut_residente})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.deleted_count} atención(es) eliminada(s)"})