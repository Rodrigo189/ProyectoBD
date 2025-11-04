from flask import jsonify, request
from db_nosql import get_db
# 'ObjectId' ya no es necesario
# from bson import ObjectId

def add_ingreso():
    """
    Registrar o actualizar un ingreso de residente
    ---
    tags:
      - Ingresos
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del ingreso (sección ubicación de la ficha)
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            habitacion:
              type: string
              example: "Habitación 12B"
            ingresa_desde:
              type: string
              example: "Hospital"
            motivo_institucionalizacion:
              type: string
              example: "Traslado desde hospital"
    responses:
      200:
        description: Ingreso registrado o actualizado correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # Usamos upsert=True para crear o actualizar, basado en el RUT
    # Usamos la colección 'db.ingresos', no 'db.contratoIngresoMedicamentos'
    try:
        rut = data["rut_residente"]
    except KeyError:
        return jsonify({"message": "Error: 'rut_residente' es requerido."}), 400
    except TypeError:
        return jsonify({"message": "Error: JSON inválido."}), 400

    db.ingresos.update_one(
        {"rut_residente": rut}, 
        {"$set": data}, 
        upsert=True
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": "Ingreso registrado"})

def get_ingresos(rut_residente):
    """
    Obtener ingreso de un residente
    ---
    tags:
      - Ingresos
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Datos del ingreso
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Cambiado a 'db.ingresos'
    # Cambiado a find_one() porque tu frontend espera un solo objeto de ubicación
    ingresos = db.ingresos.find_one(
        {"rut_residente": rut_residente}, 
        {"_id": 0}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify(ingresos if ingresos else {"message": "Ingreso no encontrado"})

def update_ingreso(rut_residente):
    """
    Actualizar información de un ingreso
    ---
    tags:
      - Ingresos
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
      - in: body
        name: body
        required: true
        description: Nuevos datos del ingreso
        schema:
          type: object
          properties:
            motivo_institucionalizacion:
              type: string
              example: "Ingreso por recuperación postoperatoria"
            habitacion:
              type: string
              example: "Habitación 14C"
    responses:
      200:
        description: Ingreso actualizado correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # Se usa 'rut_residente' (no 'id') y 'db.ingresos'
    result = db.ingresos.update_one(
        {"rut_residente": rut_residente}, 
        {"$set": data}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.modified_count} ingreso(s) actualizado(s)"})

def delete_ingreso(rut_residente):
    """
    Eliminar un ingreso
    ---
    tags:
      - Ingresos
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuyo ingreso se eliminará
    responses:
      200:
        description: Ingreso eliminado correctamente
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Se usa 'rut_residente' (no 'id') y 'db.ingresos'
    result = db.ingresos.delete_one({"rut_residente": rut_residente})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.deleted_count} ingreso(s) eliminado(s)"})