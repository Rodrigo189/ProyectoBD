from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def create_or_update_residente():
    db = get_db()
    data = request.json
    # Se asegura de crear/actualizar en la colección 'residentes' usando el RUT
    db.residentes.update_one({"rut": data["rut"]}, {"$set": data}, upsert=True)
    return jsonify({"message": "Residente actualizado"})

def get_residentes():
    db = get_db()
    # Retorna la lista básica
    residentes = list(db.residentes.find({}, {"_id": 0}))
    return jsonify(residentes)

def update_residente(rut):
    db = get_db()
    data = request.json
    db.residentes.update_one({"rut": rut}, {"$set": data})
    return jsonify({"message": "Residente actualizado"})

def delete_residente(rut):
    db = get_db()
    db.residentes.delete_one({"rut": rut})
    return jsonify({"message": "Residente eliminado"})