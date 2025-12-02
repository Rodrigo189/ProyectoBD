from flask import jsonify, request, current_app
from bson import ObjectId

def get_db():
    return current_app.extensions['pymongo'].db

def add_atencion():
    db = get_db()
    data = request.json
    db.atenciones.insert_one(data)
    return jsonify({"message": "Atención registrada"})

def get_atenciones(rut_residente):
    db = get_db()
    atenciones = list(db.atenciones.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(atenciones)

def update_atencion(id):
    db = get_db()
    data = request.json
    try:
        db.atenciones.update_one({"_id": ObjectId(id)}, {"$set": data})
        return jsonify({"message": "Atención actualizada"})
    except:
        return jsonify({"message": "Error ID"}), 400

def delete_atenciones_por_rut(rut_residente):
    db = get_db()
    # Borra TODAS las atenciones de ese residente
    result = db.atenciones.delete_many({"rut_residente": rut_residente})
    return jsonify({"message": f"{result.deleted_count} atenciones eliminadas"})