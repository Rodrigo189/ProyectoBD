from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def add_patologia():
    db = get_db()
    data = request.json
    rut = data.get("rut_residente")
    if not rut: return jsonify({"error": "Falta rut_residente"}), 400
    
    db.patologias.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    return jsonify({"message": "Patologías guardadas"})

def get_patologias(rut_residente):
    db = get_db()
    res = db.patologias.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(res if res else {})

def update_patologia(rut_residente):
    return add_patologia()

def delete_patologia(rut_residente):
    db = get_db()
    db.patologias.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": "Patologías eliminadas"})