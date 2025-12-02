from flask import jsonify, request, current_app

def get_db():
    return current_app.extensions['pymongo'].db

def add_ingreso():
    db = get_db()
    data = request.json
    rut = data.get("rut_residente")
    if not rut: return jsonify({"error": "Falta rut_residente"}), 400
    
    db.ingresos.update_one({"rut_residente": rut}, {"$set": data}, upsert=True)
    return jsonify({"message": "Ingreso/Ubicación guardado"})

def get_ingresos(rut_residente):
    db = get_db()
    res = db.ingresos.find_one({"rut_residente": rut_residente}, {"_id": 0})
    return jsonify(res if res else {})

def update_ingreso(rut_residente):
    return add_ingreso()

def delete_ingreso(rut_residente):
    db = get_db()
    db.ingresos.delete_one({"rut_residente": rut_residente})
    return jsonify({"message": "Ingreso eliminado"})