from flask import jsonify, request, current_app
from bson import ObjectId

def get_db():
    return current_app.extensions['pymongo'].db

def add_examen():
    db = get_db()
    data = request.json
    # Guarda en colección 'examenes' (o 'registrosVitales' según tu preferencia, aquí usamos examenes)
    db.examenes.insert_one(data)
    return jsonify({"message": "Examen agregado"})

def get_examenes(rut_residente):
    db = get_db()
    examenes = list(db.examenes.find({"rut_residente": rut_residente}, {"_id": 0}))
    return jsonify(examenes)

def update_examen(id):
    db = get_db()
    data = request.json
    try:
        db.examenes.update_one({"_id": ObjectId(id)}, {"$set": data})
        return jsonify({"message": "Examen actualizado"})
    except:
        return jsonify({"message": "Error ID"}), 400

def delete_examen(id):
    db = get_db()
    try:
        db.examenes.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Examen eliminado"})
    except:
        return jsonify({"message": "Error ID"}), 400