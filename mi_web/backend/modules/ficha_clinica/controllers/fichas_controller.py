from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def create_ficha():
    db = get_db()
    data = request.json
    
    # Intenta sacar el RUT de varios lugares posibles
    rut = data.get("rut_residente")
    if not rut and "datos_personales" in data:
        rut = data["datos_personales"].get("rut")
    
    if not rut: return jsonify({"error": "Falta RUT"}), 400

    db.fichas.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    return jsonify({"message": "Datos sociales guardados"})

def get_ficha(rut_residente):
    db = get_db()
    res = db.fichas.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(res if res else {})

def update_ficha(rut_residente):
    db = get_db()
    data = request.json
    db.fichas.update_one({"rut_residente": rut_residente}, {"$set": data})
    return jsonify({"message": "Ficha actualizada"})

def delete_ficha(rut_residente):
    db = get_db()
    db.fichas.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": "Ficha eliminada"})