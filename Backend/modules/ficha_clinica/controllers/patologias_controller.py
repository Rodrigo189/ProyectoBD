from flask import jsonify, request
from db_nosql import get_db
# 'ObjectId' ya no es necesario
# from bson import ObjectId

def add_patologia():
    """
    Registrar o actualizar patologías de un residente
    ---
    tags:
      - Patologías
    parameters:
      - in: body
        name: body
        required: true
        description: Objeto de antecedentes médicos del residente
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            diabetes_tipo_I:
              type: boolean
            diabetes_tipo_II:
              type: boolean
            glaucoma:
              type: boolean
            patologia_renal:
              type: boolean
            detalle_patologia_renal:
              type: string
            epoc:
              type: boolean
            artrosis:
              type: boolean
            cancer:
              type: string
            otras_patologias:
              type: string
    responses:
      200:
        description: Patologías registradas o actualizadas
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # Usamos upsert=True para crear o actualizar, basado en el RUT
    # Usamos la colección 'db.patologias', no 'db.urgenciasMedicas'
    try:
        rut = data["rut_residente"]
    except KeyError:
        return jsonify({"message": "Error: 'rut_residente' es requerido."}), 400
    except TypeError:
        return jsonify({"message": "Error: JSON inválido."}), 400

    db.patologias.update_one(
        {"rut_residente": rut}, 
        {"$set": data}, 
        upsert=True
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": "Patologías registradas"})

def get_patologias(rut_residente):
    """
    Obtener patologías de un residente
    ---
    tags:
      - Patologías
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Objeto de patologías médicas
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Cambiado a 'db.patologias'
    # Cambiado a find_one() porque tu frontend espera un solo objeto
    patologias = db.patologias.find_one(
        {"rut_residente": rut_residente}, 
        {"_id": 0}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify(patologias if patologias else {"message": "Patologías no encontradas"})

def update_patologia(rut_residente):
    """
    Actualizar patologías de un residente
    ---
    tags:
      - Patologías
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
      - in: body
        name: body
        required: true
        description: Nuevos datos de patologías
        schema:
          type: object
    responses:
      200:
        description: Patologías actualizadas correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # Se usa 'rut_residente' (no 'id') y 'db.patologias'
    result = db.patologias.update_one(
        {"rut_residente": rut_residente}, 
        {"$set": data}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.modified_count} patología(s) actualizada(s)"})

def delete_patologia(rut_residente):
    """
    Eliminar patologías de un residente
    ---
    tags:
      - Patologías
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuyas patologías se eliminarán
    responses:
      200:
        description: Patologías eliminadas correctamente
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Se usa 'rut_residente' (no 'id') y 'db.patologias'
    result = db.patologias.delete_one({"rut_residente": rut_residente})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.deleted_count} patología(s) eliminada(s)"})