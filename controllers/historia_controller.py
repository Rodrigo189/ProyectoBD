from flask import jsonify, request
from db_nosql import get_db
# 'ObjectId' ya no es necesario para este controlador
# from bson import ObjectId

def crear_historia():
    """
    Crear o actualizar el resumen de la historia clínica
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: body
        name: body
        required: true
        description: Resumen de la historia clínica del residente
        schema:
          type: object
          properties:
            rut_residente:
              type: string
              example: "11111111-1"
            categoria_residente:
              type: string
              example: "Autovalente"
            alergias:
              type: string
              example: "Penicilina"
            examenes:
              type: string
              example: "Examen de sangre (reciente)"
            medicamentos_asociados:
              type: string
              example: "Losartan 50mg"
    responses:
      200:
        description: Historia clínica registrada o actualizada
    """
    db = get_db()
    data = request.json
    
    # --- CORRECCIÓN ---
    # La lógica ahora usa update_one con upsert=True basado en el RUT
    # y guarda en la colección 'db.historia'
    try:
        rut = data["rut_residente"]
    except KeyError:
        return jsonify({"message": "Error: 'rut_residente' es requerido."}), 400
    except TypeError:
        return jsonify({"message": "Error: JSON inválido."}), 400

    # Usamos la colección 'historia', no 'urgenciasMedicas'
    db.historia.update_one(
        {"rut_residente": rut}, 
        {"$set": data}, 
        upsert=True
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": "Historia clínica registrada correctamente"})

def obtener_historia(rut_residente):
    """
    Obtener el resumen de la historia clínica de un residente
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
    responses:
      200:
        description: Resumen de la historia clínica
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # Buscamos en 'db.historia' y usamos find_one (solo hay un resumen por residente)
    historia = db.historia.find_one(
        {"rut_residente": rut_residente}, 
        {"_id": 0}
    )
    # --- FIN CORRECCIÓN ---
    
    return jsonify(historia if historia else {"message": "Historia no encontrada"})

# --- FUNCIÓN NUEVA AÑADIDA ---
def update_historia(rut_residente):
    """
    Actualizar el resumen de la historia clínica
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente
      - in: body
        name: body
        required: true
        description: Datos a actualizar del resumen
        schema:
          type: object
    responses:
      200:
        description: Historia actualizada correctamente
    """
    db = get_db()
    data = request.json
    
    # Usamos 'db.historia' y buscamos por 'rut_residente'
    result = db.historia.update_one(
        {"rut_residente": rut_residente}, 
        {"$set": data}
    )
    return jsonify({"message": f"{result.modified_count} historia(s) actualizada(s)"})
# --- FIN FUNCIÓN NUEVA ---

def eliminar_historia(rut_residente):
    """
    Eliminar el resumen de la historia clínica
    ---
    tags:
      - Historia Clínica
    parameters:
      - in: path
        name: rut_residente
        type: string
        required: true
        description: RUT del residente cuya historia se eliminará
    responses:
      200:
        description: Historia clínica eliminada
    """
    db = get_db()
    
    # --- CORRECCIÓN ---
    # La función ahora recibe 'rut_residente' (no 'id')
    # y elimina de 'db.historia'
    result = db.historia.delete_one({"rut_residente": rut_residente})
    # --- FIN CORRECCIÓN ---
    
    return jsonify({"message": f"{result.deleted_count} historia(s) eliminada(s)"})