from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Conexión MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/proyectobd"
mongo = PyMongo(app)

try:
    mongo.db.list_collection_names()
    print("Conexión a MongoDB exitosa")
except Exception as e:
    print("Error conectando a MongoDB:", e)

# Colecciones
residentes_col = mongo.db.residentes
funcionarios_col = mongo.db.funcionarios
medicamentos_col = mongo.db.medicamentos
registros_col = mongo.db.registros_vitales
formularios_col = mongo.db.formularios_turno

# ---------------- RESIDENTES ----------------
@app.route('/api/residentes', methods=['POST'])
def crear_residente():
    data = request.get_json()
    if "rut" not in data:
        return jsonify({"error": "RUT es requerido"}), 400
    residentes_col.insert_one(data)
    return jsonify(data), 201

@app.route('/api/residentes/<rut>', methods=['GET', 'PUT', 'DELETE'])
def manejar_residente(rut):
    if request.method == 'GET':
        residente = residentes_col.find_one({"rut": rut})
        if not residente:
            return jsonify({"mensaje": "Residente no encontrado"}), 404
        residente["_id"] = str(residente["_id"])
        return jsonify(residente)
    elif request.method == 'PUT':
        data = request.get_json()
        result = residentes_col.update_one({"rut": rut}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"mensaje": "Residente no encontrado"}), 404
        return jsonify(data)
    elif request.method == 'DELETE':
        result = residentes_col.delete_one({"rut": rut})
        if result.deleted_count == 0:
            return jsonify({"mensaje": "Residente no encontrado"}), 404
        return jsonify({"mensaje": "Residente eliminado"})

# ---------------- FUNCIONARIOS ----------------
@app.route('/api/funcionarios', methods=['GET', 'POST'])
def listar_o_crear_funcionarios():
    if request.method == 'GET':
        funcionarios = list(funcionarios_col.find())
        for f in funcionarios:
            f["_id"] = str(f["_id"])
        return jsonify(funcionarios)

    else:  # POST
        try:
            data = request.get_json()
            # DEBUG: imprime lo que recibe el backend
            print("Datos recibidos para crear funcionario:", data)

            result = funcionarios_col.insert_one(data)
            print("Funcionario insertado con _id:", result.inserted_id)

            return jsonify(data), 201
        except Exception as e:
            print("ERROR al guardar funcionario:", e)
            return jsonify({"error": str(e)}), 500


@app.route("/api/funcionarios/<rut>", methods=["PUT", "DELETE"])
def actualizar_o_eliminar_funcionario(rut):
    if request.method == "PUT":
        data = request.get_json().copy()
        data.pop("_id", None)  # Evitar problemas con MongoDB
        if "asistencia" in data:
            data["asistencia"] = bool(data["asistencia"])
        result = funcionarios_col.update_one({"rut": rut}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario actualizado correctamente"})
    else:  # DELETE
        result = funcionarios_col.delete_one({"rut": rut})
        if result.deleted_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario eliminado correctamente"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    rut = data.get("rut")
    clave = data.get("clave")
    user = funcionarios_col.find_one({"rut": rut, "clave": clave})
    if user:
        return jsonify({"mensaje": "Login exitoso", "rut": rut})
    return jsonify({"mensaje": "Credenciales incorrectas"}), 401

# ---------------- MEDICAMENTOS ----------------
@app.route('/api/medicamentos', methods=['POST', 'GET'])
def manejar_medicamentos():
    if request.method == 'POST':
        data = request.get_json()
        medicamentos_col.insert_one(data)
        return jsonify(data), 201
    else:
        meds = list(medicamentos_col.find())
        for m in meds:
            m["_id"] = str(m["_id"])
        return jsonify(meds)

@app.route('/api/medicamentos/<id>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_medicamento(id):
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        return jsonify({"error": "ID inválido"}), 400
    if request.method == 'PUT':
        data = request.get_json()
        result = medicamentos_col.update_one({"_id": obj_id}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"mensaje": "Medicamento no encontrado"}), 404
        return jsonify(data)
    else:
        result = medicamentos_col.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            return jsonify({"mensaje": "Medicamento no encontrado"}), 404
        return jsonify({"mensaje": "Medicamento eliminado"})

# ---------------- REGISTROS VITALES ----------------
@app.route('/api/registros-vitales', methods=['POST'])
def crear_registro():
    data = request.get_json()
    if "fecha" not in data:
        data["fecha"] = datetime.now().strftime("%Y-%m-%d")
    if "hora" not in data:
        data["hora"] = datetime.now().strftime("%H:%M:%S")
    registros_col.insert_one(data)
    return jsonify({"mensaje": "Registro guardado con éxito"}), 201

@app.route('/api/registros-vitales/<id>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_registro(id):
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        return jsonify({"error": "ID inválido"}), 400
    if request.method == 'PUT':
        data = request.get_json()
        result = registros_col.update_one({"_id": obj_id}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"mensaje": "Registro no encontrado"}), 404
        return jsonify(data)
    else:
        result = registros_col.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            return jsonify({"mensaje": "Registro no encontrado"}), 404
        return jsonify({"mensaje": "Registro eliminado"})

# ---------------- FORMULARIOS ----------------
@app.route('/api/formulario', methods=['POST'])
def guardar_formulario():
    data = request.get_json()
    formularios_col.insert_one(data)
    return jsonify({"mensaje": "Formulario guardado con éxito"}), 201

@app.route('/api/formulario', methods=['GET'])
def obtener_formularios():
    forms = list(formularios_col.find())
    for f in forms:
        f["_id"] = str(f["_id"])
    return jsonify(forms)

# ---------------- INICIO APP ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
