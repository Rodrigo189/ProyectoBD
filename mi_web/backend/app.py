from flask import Flask, request, jsonify # Importa Flask y utilidades para manejar solicitudes y respuestas JSON
from flask_pymongo import PyMongo # Importa PyMongo para interactuar con MongoDB
from flask_cors import CORS # Importa CORS para manejar solicitudes entre diferentes orígenes
from datetime import datetime # Importa datetime para manejar fechas y horas
import os

# Responses: 200 OK, 201 Created, 400 Fallo, 404 Not Found, 500 Internal Server Error
# POST: Crear recurso
# GET: Leer recurso
# PUT: Actualizar recurso
# DELETE: Eliminar recurso

# Flask permite levantar el servidor web, CORS (Cross-Origin Resource Sharing) habilita la comunicacion
# entre el frontend (React) y el backend (Flask), evitando bloqueos por politica de mismo origen.

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True) #Habilita CORS para todas las rutas /api/*

# PyMongo se utiliza para establecer la conexion con MongoDB,
# donde se almacenan los datos medicos, residentes, funcionarios, etc.

app.config["MONGO_URI"] = "mongodb://localhost:27017/proyectobd"
mongo = PyMongo(app) # Inicializa la conexion con MongoDB

try: # Verifica la conexion a la base de datos
    mongo.db.list_collection_names()
    print("Conexión a MongoDB exitosa")
except Exception as e: # Captura errores de conexion
    print("Error conectando a MongoDB:", e)

# Cada coleccion representa una entidad dentro del sistema, Son equivalentes a tablas en una base de datos relacional.
residentes_col = mongo.db.residentes
funcionarios_col = mongo.db.funcionarios
medicamentos_col = mongo.db.medicamentos
registros_col = mongo.db.signos_vitales
formularios_col = mongo.db.formularios_turno

# ---------------- RESIDENTES ----------------
# Incluye operaciones CRUD (leer, actualizar, eliminar), sobre los datos personales y médicos de los residentes
@app.route('/api/residentes', methods=['POST']) # Crear un nuevo residente
def verificar_residente(): # Verifica si un residente existe segun su RUT
    try:
        data = request.get_json() # Obtiene datos JSON del cuerpo de la solicitud
        if not data or "rut" not in data: # Verifica que el RUT este presente
            return jsonify({"error": "RUT es requerido"}), 400 # Respuesta de error si falta RUT

        rut = str(data["rut"]).strip().replace(".", "").upper() # Normaliza el RUT


        # Buscar residente en MongoDB
        residente = residentes_col.find_one({"rut": rut})

        if residente: # Si se encuentra el residente, devuelve sus datos relevantes
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
        else: # Si no se encuentra, indica que no existe
            return jsonify({
                "existe": False,
                "mensaje": f"No se encontró residente con RUT {rut}"
            }), 404

    except Exception as e: # Captura errores generales
        print("Error al verificar residente:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/residentes/<rut>', methods=['GET', 'PUT', 'DELETE']) # Leer, actualizar o eliminar un residente por RUT
def manejar_residente(rut): # Maneja operaciones CRUD para un residente especifico
    if request.method == 'GET': # Obtener datos del residente
        residente = residentes_col.find_one({"rut": rut})
        if not residente: # Si no se encuentra, devuelve error 404
            return jsonify({"mensaje": "Residente no encontrado"}), 404
        residente["_id"] = str(residente["_id"]) # Convierte ObjectId a string para JSON
        return jsonify(residente)

# ---------------- FUNCIONARIOS ----------------
# Los funcionarios pueden registrarse, actualizar sus datos y autenticarse.
@app.route('/api/funcionarios', methods=['GET', 'POST']) # Listar o crear funcionarios
def listar_o_crear_funcionarios(): # Maneja la lista y creacion de funcionarios
    if request.method == 'GET': # Listar todos los funcionarios
        funcionarios = list(funcionarios_col.find())
        for f in funcionarios:
            f["_id"] = str(f["_id"]) # Convierte ObjectId a string para JSON
        return jsonify(funcionarios)

    elif request.method == 'POST': # Crear un nuevo funcionario
        try:
            data = request.get_json() # Obtiene datos JSON del cuerpo de la solicitud
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
@app.route("/api/funcionarios/<rut>", methods=["PUT", "DELETE"]) # Actualizar o eliminar un funcionario por RUT
def actualizar_o_eliminar_funcionario(rut): # Maneja la actualizacion y eliminacion de un funcionario
    if request.method == "PUT": # Actualizar datos del funcionario
        data = request.get_json().copy()
        data.pop("_id", None)  # Evitar problemas con MongoDB
        if "asistencia" in data:
            data["asistencia"] = bool(data["asistencia"]) # Asegurar tipo booleano
        result = funcionarios_col.update_one({"rut": rut}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario actualizado correctamente"})

    elif request.method == "DELETE": # Eliminar funcionario
        result = funcionarios_col.delete_one({"rut": rut})
        if result.deleted_count == 0: # Si no se encontro el funcionario
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario eliminado correctamente"})

@app.route('/api/login', methods=['POST']) # Autentica a un funcionario
def login(): # Maneja el login de funcionarios
    data = request.get_json()
    rut = data.get("rut") # Extrae RUT y clave
    clave = data.get("clave")
    user = funcionarios_col.find_one({"rut": rut, "clave": clave}) # Busca en MongoDB
    if user: # Si se encuentra el usuario, devuelve exito
        return jsonify({"mensaje": "Login exitoso", "rut": rut})
    return jsonify({"mensaje": "Credenciales incorrectas"}), 401

# ---------------- MEDICAMENTOS ----------------
# Maneja la creacion, actualizacion y eliminacion de medicamentos asociados a cada residente.
@app.route('/api/medicamentos', methods=['POST', 'GET']) # Crear o listar medicamentos
def manejar_medicamentos(): # Maneja la creacion y listado de medicamentos
    if request.method == 'POST': # Asignar un medicamento a un residente
        data = request.get_json()
        rut_residente = data.get("rut_residente") # Extrae RUT del residente

        if not rut_residente: # Verifica que el RUT este presente
            return jsonify({"error": "Falta el RUT del residente"}), 400

        residente = residentes_col.find_one({"rut": rut_residente}) # Busca el residente en MongoDB
        if not residente: # Si no se encuentra, devuelve error 404
            return jsonify({"error": f"No se encontró residente con RUT {rut_residente}"}), 404

        medicamento = { # Crea el objeto medicamento
            "nombre": data.get("nombre"),
            "dosis": data.get("dosis"),
            "caso_sos": data.get("caso_sos", False),
            "medico_indicador": data.get("medico_indicador"),
            "fecha_inicio": data.get("fecha_inicio"),
            "fecha_termino": data.get("fecha_termino")
        }
        # Asegurar que "medicamentos" es una lista
        residentes_col.update_one( 
            {"rut": rut_residente},
            {"$push": {"medicamentos": medicamento}}
        )
        # Respuesta de exito
        return jsonify({
            "mensaje": "Medicamento asignado correctamente",
            "id": rut_residente,
            "nombre_residente": residente.get("nombre")
        }), 200

    else:
        # Mostrar todos los medicamentos con nombre del residente y RUT como id
        residentes = list(residentes_col.find({}, {"_id": 0, "rut": 1, "nombre": 1, "medicamentos": 1, "medicamento": 1}))
        medicamentos = [] # Lista para almacenar medicamentos

        for r in residentes: # Itera sobre cada residente
            meds = r.get("medicamentos", [])
            # Si hay listas anidadas (lista dentro de lista), las aplana
            if len(meds) > 0 and isinstance(meds[0], list):
                meds = [item for sublist in meds for item in sublist] # Aplana la lista

            for m in meds: # Itera sobre cada medicamento
                if isinstance(m, dict): # Asegura que es un diccionario
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

        return jsonify(medicamentos) # Devuelve la lista de medicamentos

@app.route('/api/medicamentos/<rut>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_medicamento(rut): # Actualiza o elimina un medicamento de un residente
    data = request.get_json() if request.method == 'PUT' else None # Obtiene datos JSON si es PUT
    residente = residentes_col.find_one({"rut": rut}) # Busca el residente en MongoDB

    if not residente: # Si no se encuentra, devuelve error 404
        return jsonify({"mensaje": "Residente no encontrado"}), 404

    # Asegurar formato lista
    if "medicamentos" not in residente or not isinstance(residente["medicamentos"], list): # Verifica si "medicamentos" es una lista
        if "medicamento" in residente and residente["medicamento"]: # Si existe un solo medicamento
            residente["medicamentos"] = [residente["medicamento"]] # Convierte a lista
        else: # Si no existe ningun medicamento
            residente["medicamentos"] = [] # Inicializa lista vacia

    if request.method == 'PUT': # Actualizar medicamento
        nombre_medicamento = data.get("nombre")
        actualizado = False

        for m in residente["medicamentos"]:
            if m.get("nombre") == nombre_medicamento:
                # Actualizar medicamento específico
                m.update({
                    "dosis": data.get("dosis", m.get("dosis")),
                    "caso_sos": data.get("caso_sos", m.get("caso_sos")),
                    "medico_indicador": data.get("medico_indicador", m.get("medico_indicador")),
                    "fecha_inicio": data.get("fecha_inicio", m.get("fecha_inicio")),
                    "fecha_termino": data.get("fecha_termino", m.get("fecha_termino"))
                })
                actualizado = True
                break

        if not actualizado: # Si no se encontro el medicamento
            return jsonify({"mensaje": f"No se encontró el medicamento '{nombre_medicamento}'"}), 404 # Respuesta de error

        residentes_col.update_one({"rut": rut}, {"$set": {"medicamentos": residente["medicamentos"]}}) # Guarda los cambios en MongoDB

        return jsonify({ # Respuesta de exito
            "mensaje": f"Medicamento '{nombre_medicamento}' actualizado correctamente",
            "id": rut,
            "nombre_residente": residente.get("nombre")
        }), 200

    else: # Eliminar medicamento
        nombre_medicamento = request.args.get("nombre")
        if not nombre_medicamento:
            return jsonify({"error": "Debe especificar el nombre del medicamento a eliminar"}), 400

        nueva_lista = [m for m in residente["medicamentos"] if m.get("nombre") != nombre_medicamento] # Filtra el medicamento a eliminar

        if len(nueva_lista) == len(residente["medicamentos"]): # Si no se elimino ningun medicamento
            return jsonify({"mensaje": f"No se encontró el medicamento '{nombre_medicamento}'"}), 404 # Respuesta de error

        residentes_col.update_one({"rut": rut}, {"$set": {"medicamentos": nueva_lista}}) # Actualiza la lista en MongoDB

        return jsonify({ # Respuesta de exito
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
@app.route('/api/formulario', methods=['POST']) # Crear un nuevo formulario
def guardar_formulario(): # Guarda un formulario de turno en la base de datos
    data = request.get_json() # Obtiene datos JSON del cuerpo de la solicitud
    formularios_col.insert_one(data)
    return jsonify({"mensaje": "Formulario guardado con éxito"}), 201

@app.route('/api/formulario', methods=['GET']) # Obtener todos los formularios
def obtener_formularios(): # Devuelve todos los formularios de turno almacenados
    forms = list(formularios_col.find()) # Obtiene todos los formularios de MongoDB
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
