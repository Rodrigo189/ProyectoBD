from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def add_apoderado():
    db = get_db()
    data = request.json
    rut = data.get("rut_residente")
    if not rut: return jsonify({"error": "Falta rut_residente"}), 400
    
    db.apoderado.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    return jsonify({"message": "Apoderado guardado"})

def get_apoderados(rut_residente):
    db = get_db()
    res = db.apoderado.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(res if res else {})

def update_apoderado(rut_residente):
    return add_apoderado()

def delete_apoderado(rut_residente):
    db = get_db()
    db.apoderado.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": "Apoderado eliminado"})