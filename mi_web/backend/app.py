from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime
import os

# Flask permite levantar el servidor web, CORS (Cross-Origin Resource Sharing) habilita la comunicacion
# entre el frontend (React) y el backend (Flask), evitando bloqueos por politica de mismo origen.

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# PyMongo se utiliza para establecer la conexion con MongoDB,
# donde se almacenan los datos medicos, residentes, funcionarios, etc.

app.config["MONGO_URI"] = "mongodb://localhost:27017/proyectobd"
mongo = PyMongo(app)

try:
    mongo.db.list_collection_names()
    print("Conexión a MongoDB exitosa")
except Exception as e:
    print("Error conectando a MongoDB:", e)

# Cada coleccion representa una entidad dentro del sistema, Son equivalentes a tablas en una base de datos relacional.
residentes_col = mongo.db.residentes
funcionarios_col = mongo.db.funcionarios
medicamentos_col = mongo.db.medicamentos
registros_col = mongo.db.signos_vitales
formularios_col = mongo.db.formularios_turno

# ---------------- RESIDENTES ----------------
# Incluye operaciones CRUD (leer, actualizar, eliminar), sobre los datos personales y médicos de los residentes
@app.route('/api/residentes', methods=['POST'])
def verificar_residente():
    try:
        data = request.get_json()
        if not data or "rut" not in data:
            return jsonify({"error": "RUT es requerido"}), 400

        rut = str(data["rut"]).strip().replace(".", "").upper()


        # Buscar residente en MongoDB
        residente = residentes_col.find_one({"rut": rut})

        if residente:
            return jsonify({
                "existe": True,
                "mensaje": f"Residente con RUT {rut} encontrado",
                "residente": {
                    "nombre": residente.get("nombre"),
                    "fecha_nacimiento": residente.get("fecha_nacimiento"),
                    "diagnostico": residente.get("diagnostico"),
                    "medico_tratante": residente.get("medico_tratante")
                }
            }), 200
        else:
            return jsonify({
                "existe": False,
                "mensaje": f"No se encontró residente con RUT {rut}"
            }), 404

    except Exception as e:
        print("Error al verificar residente:", e)
        return jsonify({"error": str(e)}), 500

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
# Los funcionarios pueden registrarse, actualizar sus datos y autenticarse.
@app.route('/api/funcionarios', methods=['GET', 'POST'])
def listar_o_crear_funcionarios():
    if request.method == 'GET':
        funcionarios = list(funcionarios_col.find())
        for f in funcionarios:
            f["_id"] = str(f["_id"])
        return jsonify(funcionarios)

    elif request.method == 'POST':
        try:
            data = request.get_json()
            print("Datos recibidos para crear funcionario:", data)

            # Validar campo obligatorio
            if not data.get("rut"):
                return jsonify({"error": "El campo 'rut' es obligatorio"}), 400

            # Evitar duplicados
            existente = funcionarios_col.find_one({"rut": data["rut"]})
            if existente:
                return jsonify({"error": "Ya existe un funcionario con ese RUT"}), 400

            # Asegurar tipos correctos
            data["asistencia"] = bool(data.get("asistencia", False))

            # Si no trae fecha de ingreso, poner fecha actual
            from datetime import datetime
            if not data.get("fecha_ingreso"):
                data["fecha_ingreso"] = datetime.now().strftime("%Y-%m-%d")

            # Insertar en MongoDB
            funcionarios_col.insert_one(data)
            print("Funcionario insertado correctamente en la base de datos.")
            return jsonify({"mensaje": "Funcionario guardado correctamente"}), 201
            print("Insertando en DB:", funcionarios_col.database.name)


        except Exception as e:
            print("ERROR al guardar funcionario:", e)
            return jsonify({"error": str(e)}), 500
        
# Actualiza o elimina un funcionario en el boton "Eliminar".
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

    elif request.method == "DELETE":
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
# Maneja la creacion, actualizacion y eliminacion de medicamentos asociados a cada residente.
@app.route('/api/medicamentos', methods=['POST', 'GET'])
def manejar_medicamentos():
    if request.method == 'POST':
        data = request.get_json()
        rut_residente = data.get("rut_residente")

        if not rut_residente:
            return jsonify({"error": "Falta el RUT del residente"}), 400

        residente = residentes_col.find_one({"rut": rut_residente})
        if not residente:
            return jsonify({"error": f"No se encontró residente con RUT {rut_residente}"}), 404

        medicamento = {
            "nombre": data.get("nombre"),
            "dosis": data.get("dosis"),
            "caso_sos": data.get("caso_sos", False),
            "medico_indicador": data.get("medico_indicador"),
            "fecha_inicio": data.get("fecha_inicio"),
            "fecha_termino": data.get("fecha_termino")
        }

        residentes_col.update_one(
            {"rut": rut_residente},
            {"$push": {"medicamentos": medicamento}}
        )

        return jsonify({
            "mensaje": "Medicamento asignado correctamente",
            "id": rut_residente,
            "nombre_residente": residente.get("nombre")
        }), 200

    else:
        # Mostrar todos los medicamentos con nombre del residente y RUT como id
        residentes = list(residentes_col.find({}, {"_id": 0, "rut": 1, "nombre": 1, "medicamentos": 1, "medicamento": 1}))
        medicamentos = []

        for r in residentes:
            meds = r.get("medicamentos", [])
            # Si hay listas anidadas (lista dentro de lista), las aplana
            if len(meds) > 0 and isinstance(meds[0], list):
                meds = [item for sublist in meds for item in sublist]

            for m in meds:
                if isinstance(m, dict):
                    medicamentos.append({
                        "id": r.get("rut"),
                        "nombre_residente": r.get("nombre"),
                        "nombre": m.get("nombre"),
                        "dosis": m.get("dosis"),
                        "caso_sos": m.get("caso_sos", False),
                        "medico_indicador": m.get("medico_indicador"),
                        "fecha_inicio": m.get("fecha_inicio"),
                        "fecha_termino": m.get("fecha_termino")
                    })

        return jsonify(medicamentos)

@app.route('/api/medicamentos/<rut>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_medicamento(rut):
    # Si el metodo es PUT, obtiene los datos enviados por el cliente.
    # Si es DELETE, no se espera ningun cuerpo (data sera None).
    data = request.get_json() if request.method == 'PUT' else None

    # Busca al residente en la base de datos segun su RUT.
    residente = residentes_col.find_one({"rut": rut})

    # Si no existe el residente, devuelve un mensaje de error.
    if not residente:
        return jsonify({"mensaje": "Residente no encontrado"}), 404

    # Asegura que el campo "medicamentos" sea una lista valida.
    # Si no existe o no es una lista, lo crea vacio o convierte un unico medicamento en lista.
    if "medicamentos" not in residente or not isinstance(residente["medicamentos"], list):
        if "medicamento" in residente and residente["medicamento"]:
            residente["medicamentos"] = [residente["medicamento"]]
        else:
            residente["medicamentos"] = []

    # -------------------- ACTUALIZAR MEDICAMENTO --------------------
    if request.method == 'PUT':
        nombre_medicamento = data.get("nombre")
        actualizado = False

        # Recorre la lista de medicamentos del residente.
        for m in residente["medicamentos"]:
            # Si el nombre coincide, actualiza los datos del medicamento.
            if m.get("nombre") == nombre_medicamento:
                m.update({
                    "dosis": data.get("dosis", m.get("dosis")),
                    "caso_sos": data.get("caso_sos", m.get("caso_sos")),
                    "medico_indicador": data.get("medico_indicador", m.get("medico_indicador")),
                    "fecha_inicio": data.get("fecha_inicio", m.get("fecha_inicio")),
                    "fecha_termino": data.get("fecha_termino", m.get("fecha_termino"))
                })
                actualizado = True
                break

        # Si no encontro el medicamento a actualizar, devuelve error.
        if not actualizado:
            return jsonify({"mensaje": f"No se encontro el medicamento '{nombre_medicamento}'"}), 404

        # Guarda la lista modificada en la base de datos.
        residentes_col.update_one({"rut": rut}, {"$set": {"medicamentos": residente["medicamentos"]}})

        # Devuelve confirmacion de actualizacion.
        return jsonify({
            "mensaje": f"Medicamento '{nombre_medicamento}' actualizado correctamente",
            "id": rut,
            "nombre_residente": residente.get("nombre")
        }), 200

    # -------------------- ELIMINAR MEDICAMENTO --------------------
    else:
        # Obtiene el nombre del medicamento desde los parametros de la URL.
        nombre_medicamento = request.args.get("nombre")
        if not nombre_medicamento:
            return jsonify({"error": "Debe especificar el nombre del medicamento a eliminar"}), 400

        # Crea una nueva lista sin el medicamento indicado.
        nueva_lista = [m for m in residente["medicamentos"] if m.get("nombre") != nombre_medicamento]

        # Si las listas tienen el mismo largo, no se elimino nada (no lo encontro).
        if len(nueva_lista) == len(residente["medicamentos"]):
            return jsonify({"mensaje": f"No se encontro el medicamento '{nombre_medicamento}'"}), 404

        # Actualiza la base de datos con la lista filtrada (medicamento eliminado).
        residentes_col.update_one({"rut": rut}, {"$set": {"medicamentos": nueva_lista}})

        # Devuelve confirmacion de eliminacion.
        return jsonify({
            "mensaje": f"Medicamento '{nombre_medicamento}' eliminado del residente {residente.get('nombre')}",
            "id": rut,
            "nombre_residente": residente.get("nombre")
        }), 200


# ---------------- REGISTROS VITALES ----------------
# Permiten registrar parametros clinicos como presion arterial, temperatura o pulso, vinculados a un residente.
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
# Permiten registrar informacion relacionada a los turnos de los funcionarios.
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

# ---------------- HISTORIAL CLÍNICO ----------------
# Devuelve toda la informacion clinica relevante del residente, incluyendo su diagnostico, medico tratante, proximo control y signos vitales.
@app.route('/api/historial-clinico/<rut>', methods=['GET'])
def obtener_historial_clinico(rut):
    try:
        residente = residentes_col.find_one({"rut": rut})
        if not residente:
            return jsonify({"error": "Residente no encontrado"}), 404

        residente["_id"] = str(residente["_id"])
        signos = residente.get("signos_vitales", {})

        ficha = {
            "rut": residente.get("rut"),
            "nombre": residente.get("nombre"),
            "diagnostico": residente.get("diagnostico"),
            "medico_tratante": residente.get("medico_tratante"),
            "proximo_control": residente.get("proximo_control"),
            "signos_vitales": signos
        }

        return jsonify(ficha), 200

    except Exception as e:
        print("Error al obtener historial clínico:", e)
        return jsonify({"error": str(e)}), 500
    
# ---------------- BUSCAR PACIENTE ----------------
# Verifica la existencia de un residente segun su RUT.
@app.route('/api/buscar-residente', methods=['POST'])
def buscar_residente():
    data = request.get_json()
    rut = data.get("rut")

    if not rut:
        return jsonify({"error": "Debe ingresar un RUT"}), 400

    residente = residentes_col.find_one({"rut": rut})

    if residente:
        return jsonify({"existe": True, "rut": rut})
    else:
        return jsonify({"existe": False})

# ---------------- INICIO APP ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
