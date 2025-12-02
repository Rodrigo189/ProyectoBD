from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def crear_historia():
    db = get_db()
    data = request.json
    rut = data.get("rut_residente")
    if not rut: return jsonify({"error": "Falta rut_residente"}), 400

    db.historia.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    return jsonify({"message": "Historia clínica registrada"})

def obtener_historia(rut_residente):
    db = get_db()
    res = db.historia.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(res if res else {})

def update_historia(rut_residente):
    return crear_historia()

def eliminar_historia(rut_residente):
    db = get_db()
    db.historia.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": "Historia eliminada"})