from flask import jsonify, request
from db_nosql import get_db
# Ya no necesitamos ObjectId
# from bson import ObjectId 

def add_apoderado():
    """
    Agregar o actualizar un apoderado
    ---
    tags:
      - Apoderados
    parameters:
      - in: body
        name: body
        required: true
        description: Datos del apoderado
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
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
    responses:
      200:
        description: Apoderado agregado o actualizado correctamente
    """
    db = get_db()
    data = request.json
    
    # Esta lógica usa update_one con upsert=True.
    # Crea el apoderado si no existe, o lo actualiza si ya existe.
    try:
        rut = data["rut_residente"]
    except KeyError:
        return jsonify({"message": "Error: 'rut_residente' es requerido."}), 400
    except TypeError:
        return jsonify({"message": "Error: JSON inválido."}), 400

    db.apoderado.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    
    return jsonify({"message": "Apoderado agregado o actualizado"})

def get_apoderados(rut_residente):
    """
    Obtener el apoderado de un residente
    ---
    tags:
      - Apoderados
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Datos del apoderado
    """
    db = get_db()
    
    # Tu UI espera UN apoderado, no una lista.
    # Cambiamos find() por find_one()
    apoderado = db.apoderado.find_one({"rut_residente": rut_residente}, {"_id": 0})
    
    return jsonify(apoderado if apoderado else {"message": "Apoderado no encontrado"})

def update_apoderado(rut_residente):
    """
    Actualizar información de un apoderado (usando RUT)
    ---
    tags:
      - Apoderados
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
      - in: body
        name: body
        required: true
        description: Datos actualizados del apoderado
        schema:
          type: object
          properties:
            telefono:
              type: string
            correo:
              type: string
    responses:
      200:
        description: Apoderado actualizado correctamente
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # La función ahora recibe 'rut_residente' de la ruta, no 'id'
    result = db.apoderado.update_one({"rut_residente": rut_residente}, {"$set": data})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.modified_count} apoderado(s) actualizado(s)"})

def delete_apoderado(rut_residente):
    """
    Eliminar un apoderado (usando RUT)
    ---
    tags:
      - Apoderados
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente del apoderado a eliminar
    responses:
      200:
        description: Apoderado eliminado correctamente
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # La función ahora recibe 'rut_residente' de la ruta, no 'id'
    result = db.apoderado.delete_one({"rut_residente": rut_residente})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.deleted_count} apoderado(s) eliminado(s)"})