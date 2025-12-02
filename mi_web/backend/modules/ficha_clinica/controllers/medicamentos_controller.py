from flask import jsonify, request, current_app
from bson import ObjectId

def get_db():
    return current_app.extensions['pymongo'].db

def add_medicamento():
    db = get_db()
    data = request.json
    db.medicamentos.insert_one(data)
    return jsonify({"message": "Medicamento agregado"})

def get_medicamentos(rut_residente):
    db = get_db()
    # Retornamos la lista
    medicamentos = list(db.medicamentos.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(medicamentos)

def update_medicamento(id):
    db = get_db()
    data = request.json
    try:
        db.medicamentos.update_one({"_id": ObjectId(id)}, {"$set": data})
        return jsonify({"message": "Medicamento actualizado"})
    except:
        return jsonify({"message": "Error en ID"}), 400

def delete_medicamento(id):
    db = get_db()
    try:
        db.medicamentos.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Medicamento eliminado"})
    except:
        return jsonify({"message": "Error en ID"}), 400