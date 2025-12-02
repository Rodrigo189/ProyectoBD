from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def add_alergia():
    db = get_db()
    data = request.json
    rut = data.get("rut_residente")
    if not rut: return jsonify({"error": "Falta rut_residente"}), 400
    
    db.alergias.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    return jsonify({"message": "Alergia registrada"})

def get_alergias(rut_residente):
    db = get_db()
    res = db.alergias.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(res if res else {})

def update_alergia(rut_residente):
    return add_alergia()

def delete_alergia(rut_residente):
    db = get_db()
    db.alergias.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": "Alergia eliminada"})