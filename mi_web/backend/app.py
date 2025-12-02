from flask import Flask, request, jsonify # Importa Flask y utilidades para manejar solicitudes y respuestas JSON
from flask_pymongo import PyMongo # Importa PyMongo para interactuar con MongoDB
from flask_cors import CORS # Importa CORS para manejar solicitudes entre diferentes orígenes
from datetime import datetime, timedelta # Importa datetime para manejar fechas y horas
import os

# Responses: 200 OK, 201 Created, 400 Fallo, 404 Not Found, 500 Internal Server Error
# POST: Crear recurso
# GET: Leer recurso
# PUT: Actualizar recurso
# DELETE: Eliminar recurso

# Flask permite levantar el servidor web, CORS (Cross-Origin Resource Sharing) habilita la comunicacion
# entre el frontend (React) y el backend (Flask), evitando bloqueos por politica de mismo origen.

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*" }}, supports_credentials=True) #Habilita CORS para todas las rutas /api/*

# PyMongo se utiliza para establecer la conexion con MongoDB,
# donde se almacenan los datos medicos, residentes, funcionarios, etc.

app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

print(">>> URI RECIBIDA:", repr(app.config["MONGO_URI"]))

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

# Colocar SEED_DEMO_USERS, poner "0" para la publicación
# mientras está en desarrollo, colocar "1"
os.putenv("SEED_DEMO_USERS", "1")
# ---------------- RESIDENTES ----------------
# Incluye operaciones CRUD (leer, actualizar, eliminar), sobre los datos personales y médicos de los residentes
@app.route('/api/residentes/verificar', methods=['POST'])  # <-- CAMBIADO
def verificar_residente():  # Verifica si un residente existe segun su RUT
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

# ------------------------------------------------------------
# GET /api/residentes
# Obtener la lista de residentes (solo los datos basicos)
# ------------------------------------------------------------
@app.route("/api/residentes", methods=["GET"])
def get_residentes():
    residentes = list(residentes_col.find({}, {
        "_id": 0,
        "rut": 1,
        "nombre": 1,
        "datos_personales": 1,
        "ubicacion": 1
    }))

    return jsonify(residentes), 200


# ------------------------------------------------------------
# GET /api/residentes/<rut>
# Obtener la ficha clínica completa
# ------------------------------------------------------------
@app.route("/api/residentes/<rut>", methods=["GET"])
def get_residente(rut):
    residente = residentes_col.find_one({"rut": rut}, {"_id": 0})
    if not residente:
        return jsonify({"message": "No encontrado"}), 404
    return jsonify(residente), 200


# ------------------------------------------------------------
# POST /api/residentes
# Crear residente con ficha COMPLETA en un solo documento
# ------------------------------------------------------------
@app.route("/api/residentes", methods=["POST"])
def crear_residente():
    data = request.get_json()

    if residentes_col.find_one({"rut": data.get("rut")}):
        return jsonify({"error": "El residente ya existe"}), 400

    nuevo_residente = {
        "rut": data.get("rut"),
        "nombre": data.get("nombre"),
        "datos_personales": data.get("datos_personales", {}),
        "ubicacion": data.get("ubicacion", {}),
        "datos_sociales": data.get("datos_sociales", {}),
        "apoderado": data.get("apoderado", {}),
        "antecedentes_medicos": data.get("antecedentes_medicos", {}),
        "historia_clinica": data.get("historia_clinica", {}),
    }

    residentes_col.insert_one(nuevo_residente)

    return jsonify({"message": "Residente creado correctamente"}), 201


# ------------------------------------------------------------
# PUT /api/residentes/<rut>
# Actualizar ficha clinica completa
# ------------------------------------------------------------
@app.route("/api/residentes/<rut>", methods=["PUT"])
def actualizar_residente(rut):
    data = request.get_json()

    campos = {
        "nombre": data.get("nombre"),
        "datos_personales": data.get("datos_personales"),
        "ubicacion": data.get("ubicacion"),
        "datos_sociales": data.get("datos_sociales"),
        "apoderado": data.get("apoderado"),
        "antecedentes_medicos": data.get("antecedentes_medicos"),
        "historia_clinica": data.get("historia_clinica"),
    }

    # Eliminamos campos None
    campos = {k: v for k, v in campos.items() if v is not None}

    resultado = residentes_col.update_one(
        {"rut": rut},
        {"$set": campos}
    )

    if resultado.matched_count == 0:
        return jsonify({"message": "Residente no encontrado"}), 404

    return jsonify({"message": "Residente actualizado"}), 200


# ------------------------------------------------------------
# DELETE /api/residentes/<rut>
# Eliminacion total de la ficha
# ------------------------------------------------------------
@app.route("/api/residentes/<rut>", methods=["DELETE"])
def eliminar_residente(rut):
    resultado = residentes_col.delete_one({"rut": rut})

    if resultado.deleted_count == 0:
        return jsonify({"message": "Residente no encontrado"}), 404

    return jsonify({"message": "Residente eliminado"}), 201

# ---------------- FUNCIONARIOS ----------------
# Los funcionarios pueden registrarse, actualizar sus datos y autenticarse.
@app.route('/api/funcionarios', methods=['GET', 'POST']) # Listar o crear funcionarios
def listar_o_crear_funcionarios(): # Maneja la lista y creacion de funcionarios
    if request.method == 'GET': # Listar todos los funcionarios
        funcionarios = list(funcionarios_col.find())
        for f in funcionarios:
            f["_id"] = str(f["_id"]) # Convierte ObjectId a string para JSON
        return jsonify(funcionarios), 200

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
                
            # Genera el email del funcionario
            nombres = data.get("nombres", "").strip().split()
            apellidos = data.get("apellidos", "").strip().split()

            if nombres and apellidos:
                primer_nombre = nombres[0].lower()
                primer_apellido = apellidos[0].lower()
                data["email"] = f"{primer_nombre}.{primer_apellido}@eleam.cl"
            else:
                data["email"] = "desconocido@eleam.cl"

             # Esto se usa para que el otro grupo tenga toda la info lista para editar.
            data.setdefault("nombre", primer_nombre)
            data.setdefault("apellido", primer_apellido)
            data.setdefault("telefono", "")
            data.setdefault("direccion", "")
            data.setdefault("nacimiento", "")          # o None si prefieres
            data.setdefault("tipoContrato", "Indefinido")
            data.setdefault("inicio", data["fecha_ingreso"])  # por defecto igual a fecha_ingreso
            data.setdefault("termino", "")             # contrato sin termino definido

            # Campos numericos de remuneraciones
            data.setdefault("sueldoBruto", 0)
            data.setdefault("sueldoLiquido", 0)
            data.setdefault("bonos", 0)
            data.setdefault("fechaPago", "")           # lo pueden setear despues

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
        return jsonify({"message": "Funcionario actualizado correctamente"}), 201

    elif request.method == "DELETE": # Eliminar funcionario
        result = funcionarios_col.delete_one({"rut": rut})
        if result.deleted_count == 0: # Si no se encontro el funcionario
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario eliminado correctamente"}), 201

@app.route('/api/login', methods=['POST']) # Autentica a un funcionario
def login(): # Maneja el login de funcionarios
    data = request.get_json()
    rut = data.get("rut") # Extrae RUT y clave
    clave = data.get("clave")
    user = funcionarios_col.find_one({"rut": rut, "clave": clave}) # Busca en MongoDB
    if user: # Si se encuentra el usuario, devuelve exito
        return jsonify({"mensaje": "Login exitoso", "rut": rut}), 200
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

        return jsonify(medicamentos), 200 # Devuelve la lista de medicamentos

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
        return jsonify(data), 201
    else:
        result = registros_col.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            return jsonify({"mensaje": "Registro no encontrado"}), 404
        return jsonify({"mensaje": "Registro eliminado"}), 201

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
    return jsonify(forms), 200

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
        return jsonify({"existe": True, "rut": rut}), 200
    else:
        return jsonify({"existe": False}), 404

@app.route('/api/obtener-estado-seed', methods=['GET'])
def obtener_estado_seed():
    try:
        seed = os.getenv("SEED_DEMO_USERS")
        return (jsonify({"mensaje": seed})), 200
    except Exception as e:
        print('No se encontró la variable "SEED_DEMO_USERS"')
        return (jsonify({"error": str(e)})), 404

# Ruta para insertar datos de prueba
@app.route('/api/insertar-datos-prueba', methods=['POST'])
def insertar_datos_prueba():
    try:
        # Verificar si el residente ya existe
        residente_existe = residentes_col.find_one({"rut": "11111111-1"})
        if not residente_existe:
            residente_prueba = {
                "rut": "11111111-1",
                "nombre": "Ana García",
                "diagnostico": "Hipertensión",
                "medico_tratante": "Dr. Martínez",
                "proximo_control": "2025-10-15",
                "signos_vitales": [
                    {
                        "fecha": "2025-11-03",
                        "hora": "23:23",
                        "presionSistolica": "120 mmHg",
                        "presionDiastolica": "80 mmHg",
                        "temperatura": "36 °C",
                        "pulso": "75 lpm",
                        "saturacionO2": "98 %",
                        "frecuenciaRespiratoria": "16 rpm",
                        "hemoglucotest": "100 mg/dL"
                    },
                    {
                        "fecha": "2025-11-03",
                        "hora": "23:24",
                        "presionSistolica": "110 mmHg",
                        "presionDiastolica": "60 mmHg",
                        "temperatura": "40 °C",
                        "pulso": "40 lpm",
                        "saturacionO2": "70 %",
                        "frecuenciaRespiratoria": "16 rpm",
                        "hemoglucotest": "120 mg/dL"
                    },
                    {
                        "fecha": "2025-11-03",
                        "hora": "23:28",
                        "presionSistolica": "110 mmHg",
                        "presionDiastolica": "80 mmHg",
                        "temperatura": "40 °C",
                        "pulso": "40 lpm",
                        "saturacionO2": "70 %",
                        "frecuenciaRespiratoria": "16 rpm",
                        "hemoglucotest": "100 mg/dL"
                    },
                    {
                        "fecha": "2025-11-04",
                        "hora": "11:40",
                        "presionSistolica": "60 mmHg",
                        "presionDiastolica": "60 mmHg",
                        "temperatura": "36 °C",
                        "pulso": "75 lpm",
                        "saturacionO2": "70 %",
                        "frecuenciaRespiratoria": "16 rpm",
                        "hemoglucotest": "100 mg/dL"
                    },
                    {
                        "fecha": "2025-11-27",
                        "hora": "17:47",
                        "presionSistolica": "123 mmHg",
                        "presionDiastolica": "80 mmHg",
                        "temperatura": "40 °C",
                        "pulso": "123 lpm",
                        "saturacionO2": "70 %",
                        "frecuenciaRespiratoria": "16 rpm",
                        "hemoglucotest": "100 mg/dL"
                    }
                ]
            }
            residentes_col.insert_one(residente_prueba)
            return jsonify({"mensaje": "Datos de prueba insertados correctamente"}), 200
        else:
            return jsonify({"mensaje": "El residente ya existe"}), 200
    except Exception as e:
        print("Error al insertar datos de prueba:", e)
        return jsonify({"error": str(e)}), 500

# Rutas para Signos Vitales
@app.route('/api/signos-vitales', methods=['POST'])
def crear_signo_vital():
    try:
        data = request.get_json()
        rut = data.get('rut')
        
        # Crear el registro de signo vital
        nuevo_registro = {
            "fecha": data.get("fecha", datetime.now().strftime("%Y-%m-%d")),
            "hora": data.get("hora"),
            "presionSistolica": data.get("presionSistolica"),
            "presionDiastolica": data.get("presionDiastolica"),
            "pulso": data.get("pulso"),
            "saturacionO2": data.get("saturacionO2"),
            "temperatura": data.get("temperatura"),
            "frecuenciaRespiratoria": data.get("frecuenciaRespiratoria"),
            "hemoglucotest": data.get("hemoglucotest"),
            "diuresisDia": data.get("diuresisDia"),
            "diuresisNoche": data.get("diuresisNoche"),
            "deposicion": data.get("deposicion"),
            "vomito": data.get("vomito"),
            "peso": data.get("peso"),
            "registradoPor": data.get("registradoPor"),
            "cargo": data.get("cargo"),
            "turno": data.get("turno"),
            "observaciones": data.get("observaciones")
        }
        
        # Agregar el registro al array signos_vitales del residente
        result = residentes_col.update_one(
            {"rut": rut},
            {"$push": {"signos_vitales": nuevo_registro}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Residente no encontrado"}), 404
        
        return jsonify({"mensaje": "Signo vital guardado correctamente"}), 201
    except Exception as e:
        print("Error al guardar signo vital:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/signos-vitales/<rut>/<fecha>/<hora>', methods=['DELETE'])
def eliminar_signo_vital(rut, fecha, hora):
    try:
        result = residentes_col.update_one(
            {"rut": rut},
            {"$pull": {"signos_vitales": {"fecha": fecha, "hora": hora}}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Residente no encontrado"}), 404
        
        if result.modified_count == 0:
            return jsonify({"error": "Registro no encontrado"}), 404
        
        return jsonify({"mensaje": "Registro eliminado correctamente"}), 200
    except Exception as e:
        print("Error al eliminar signo vital:", e)
        return jsonify({"error": str(e)}), 500

# Ruta para buscar residentes por nombre o RUT
@app.route('/api/buscar-residentes', methods=['GET'])
def buscar_residentes_api():
    try:
        query = request.args.get('q', '').lower().strip()
        
        if not query or len(query) < 1:
            # Si no hay búsqueda, retornar todos los residentes
            residentes = list(residentes_col.find(
                {},
                {"_id": 0, "rut": 1, "nombre": 1}
            ).limit(50))
            return jsonify(residentes), 200
        
        # Buscar por RUT o nombre
        residentes = list(residentes_col.find(
            {
                "$or": [
                    {"rut": {"$regex": query, "$options": "i"}},
                    {"nombre": {"$regex": query, "$options": "i"}}
                ]
            },
            {"_id": 0, "rut": 1, "nombre": 1}
        ).limit(50))
        
        return jsonify(residentes), 200
    except Exception as e:
        print("Error al buscar residentes:", e)
        return jsonify({"error": str(e)}), 500
    
# --- API Mongo extra (Blueprint, datos de dashboards, Auth JWT) ---
import os  # noqa
from flask import Blueprint, jsonify, request  # noqa
try:
    from flask_cors import CORS  # noqa
except ImportError:
    CORS = None
try:
    from bson import ObjectId  # noqa
except Exception:
    ObjectId = None

# Instanciar PyMongo solo si no existe 'mongo' (ya existe arriba)
try:
    mongo  # type: ignore
except NameError:
    from flask_pymongo import PyMongo
    mongo = PyMongo(app)

# Activar CORS para /api/* (si está instalado)
if CORS:
    try:
        CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    except Exception:
        pass

def _oid(x):
    if ObjectId and isinstance(x, str) and len(x) == 24:
        try:
            return ObjectId(x)
        except Exception:
            return x
    return x

def _to_doc(d):
    if not d:
        return d
    d = dict(d)
    if "_id" in d:
        d["id"] = str(d.pop("_id"))
    return d

def _find_funcionario(user_id_or_rut):
    db = mongo.db
    f = db.funcionarios.find_one({"_id": _oid(user_id_or_rut)})
    if f:
        return f
    return db.funcionarios.find_one({"rut": user_id_or_rut})

# --- Auth (JWT) agregado ---
import jwt, bcrypt  # noqa

JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret")
JWT_EXP_HOURS = int(os.getenv("JWT_EXP_HOURS", "12"))

def _create_token(user):
    payload = {
        "sub": str(user["_id"]),
        "rut": user.get("rut"),
        "role": user.get("role"),
        "name": user.get("nombre"),
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXP_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def _verify_token(req):
    auth = req.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1].strip()
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        return None

# --- Reglas de roles y seed desde funcionarios ---
ALLOWED_ROLES = {"admin", "funcionario"}

def map_role_from_cargo(cargo: str) -> str:
    c = (cargo or "").lower()
    if not c:
        return null
    return "admin" if "Administrador" in c or "Administradora" in c else "funcionario"

def seed_users_from_funcionarios(default_fun_pwd="fun123", default_admin_pwd="admin123"):
    """
    Crea usuarios reales a partir de la colección 'funcionarios'.
    """
    db = mongo.db
    created = 0
    
    # Hashea las contraseñas por defecto
    fun_hash = bcrypt.hashpw(default_fun_pwd.encode(), bcrypt.gensalt()).decode()
    adm_hash = bcrypt.hashpw(default_admin_pwd.encode(), bcrypt.gensalt()).decode()


    for f in db.funcionarios.find({}, {"rut": 1, "nombre": 1, "apellido": 1, "cargo": 1, "email": 1}):
        rut = (f.get("rut") or "").strip()
        if not rut:
            continue
        
        # ✅ SI YA EXISTE UN USUARIO CON ESE RUT, LO SALTA
        if db.usuarios.find_one({"rut": rut}):
            continue
        

        role = map_role_from_cargo(f.get("cargo"))  # "admin" o "funcionario"
        
 
        pwd_hash = adm_hash if role == "admin" else fun_hash
        
        nombre = " ".join(x for x in [f.get("nombre"), f.get("apellido")] if x)
       
        db.usuarios.insert_one({
            "rut": rut,
            "username": rut,
            "nombre": nombre or f.get("nombre") or "",
            "role": role,
            "passwordHash": pwd_hash,  # ← Hash de "fun123" o "admin123"
            "email": f.get("email"),
        })
        created += 1
    
    return created

def _ensure_indexes_and_seed():
    db = mongo.db
    try:
        db.funcionarios.create_index("rut", unique=True)
        db.probabilidades.create_index("rut")
        db.riesgos.create_index("rut")
        db.sis.create_index("rut")
        db.usuarios.create_index("rut", unique=True)
        db.usuarios.create_index("username", unique=False)
    except Exception:
        pass

    # Seed demo opcional (deshabilitado por defecto)
    if os.getenv("SEED_DEMO_USERS") == "1" and db.usuarios.estimated_document_count() == 0:
        admin_pwd = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()
        func_pwd  = bcrypt.hashpw(b"fun123",   bcrypt.gensalt()).decode()
        db.usuarios.insert_many([
            {"username": "admin", "rut": "99999999-9", "nombre": "Admin", "role": "admin", "passwordHash": admin_pwd},
            {"username": "func",  "rut": "11111111-1", "nombre": "Funcionario", "role": "funcionario", "passwordHash": func_pwd},
        ])

_ensure_indexes_and_seed()

# Ejecutar seed real desde funcionarios SIEMPRE al iniciar
api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.get("/health")
def api_health():
    try:
        mongo.cx.admin.command("ping")
        return {"ok": True}, 200
    except Exception as e:
        return {"ok": False, "error": str(e)}, 500

# ---- Auth endpoints ----



@api_bp.post("/auth/login")
def api_login():
    body = request.get_json(force=True) or {}
    # Preferimos autenticación por RUT (RUN)
    rut = (body.get("rut") or "").strip()
    pwd = (body.get("password") or "").encode()
    role_area = (body.get("roleArea") or "").strip()  # opcional: "admin" | "funcionario"
    funcionario = funcionarios_col.find_one({"rut": rut})
    rol = map_role_from_cargo(funcionario.get("cargo"))
    if not funcionario or not pwd or not bcrypt.checkpw(pwd, funcionario.get("clave").encode()):
        return jsonify({"error": "invalid_credentials"}), 401


    if role_area and rol != role_area:
        return jsonify({"error": "wrong_role", "expected": role_area, "actual": rol}), 403

    token = _create_token(funcionario)
    return jsonify({"token": token, "user": funcionario}), 200

@api_bp.post("/auth/register")
def api_register():
    body = request.get_json(force=True) or {}
    rut = (body.get("rut") or "").strip()
    role = (body.get("role") or "").strip()
    password = (body.get("password") or "").strip()
    username = (body.get("username") or "").strip() or rut
    nombre = (body.get("nombre") or "").strip()
    email = (body.get("email") or "").strip()

    if not rut or not role or not password:
        return jsonify({"error": "missing_fields", "required": ["rut", "role", "password"]}), 400
    if role not in ALLOWED_ROLES:
        return jsonify({"error": "invalid_role", "allowed": list(ALLOWED_ROLES)}), 400

    pwd_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    mongo.db.usuarios.update_one(
        {"rut": rut},
        {"$set": {"rut": rut, "role": role, "passwordHash": pwd_hash, "username": username, "nombre": nombre, "email": email}},
        upsert=True,
    )
    return jsonify({"ok": True}), 200

@api_bp.get("/auth/me")
def api_me():
    claims = _verify_token(request)
    if not claims:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"user": claims}), 200

# ---- Datos para dashboards (reales desde Mongo) ----
@api_bp.get("/funcionarios-list")
def api_funcionarios():
    cur = mongo.db.funcionarios.find({})
    return jsonify([_to_doc(x) for x in cur]), 200

@api_bp.get("/funcionarios/<user_id>")
def api_funcionario(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify({"error": "not_found"}), 404
    return jsonify(_to_doc(f)), 200

@api_bp.get("/probabilidades/<user_id>")
def api_probabilidades(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify([])
    doc = mongo.db.probabilidades.find_one({"rut": f.get("rut")})
    return jsonify(doc.get("items", [])), 200 if doc else jsonify([]), 404 

@api_bp.get("/riesgos/<user_id>")
def api_riesgos(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify([])
    doc = mongo.db.riesgos.find_one({"rut": f.get("rut")})
    return jsonify(doc.get("items", [])), 200 if doc else jsonify([]), 404

@api_bp.get("/sis/<user_id>")
def api_sis(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify({"turnos": 0, "horas": 0, "incidentes": 0, "extra": 0}), 404
    doc = mongo.db.sis.find_one({"rut": f.get("rut")})
    if not doc:
        return jsonify({"turnos": 0, "horas": 0, "incidentes": 0, "extra": 0}), 404
    d = _to_doc(doc)
    d.pop("rut", None); d.pop("id", None)
    return jsonify(d), 200

# ---- NUEVOS ENDPOINTS PUT PARA EDICIÓN ----
@api_bp.put("/probabilidades/<user_id>")
def actualizar_probabilidades(user_id):
    """Admin puede actualizar probabilidades de otro usuario (no las suyas)"""
    payload = request.get_json() or {}
    current_user = _verify_token(request)
    
    if not current_user:
        return jsonify({"error": "unauthorized"}), 401
    
    # Verificar que no está editando su propio perfil
    if current_user["rut"] == user_id:
        return jsonify({"error": "No puedes editar tus propias probabilidades"}), 403
    
    # Verificar que es admin
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    items = payload.get("items", [])
    db = mongo.db
    
    try:
        db.probabilidades.update_one(
            {"rut": user_id},
            {"$set": {"items": items}},
            upsert=True
        )
        return jsonify({"ok": True, "message": "Probabilidades actualizadas"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.put("/riesgos/<user_id>")
def actualizar_riesgos(user_id):
    """Admin puede actualizar riesgos de otro usuario (no los suyos)"""
    payload = request.get_json() or {}
    current_user = _verify_token(request)
    
    if not current_user:
        return jsonify({"error": "unauthorized"}), 401
    
    if current_user["rut"] == user_id:
        return jsonify({"error": "No puedes editar tus propios riesgos"}), 403
    
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    items = payload.get("items", [])
    db = mongo.db
    
    try:
        db.riesgos.update_one(
            {"rut": user_id},
            {"$set": {"items": items}},
            upsert=True
        )
        return jsonify({"ok": True, "message": "Riesgos actualizados"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.put("/sis/<user_id>")
def actualizar_sis(user_id):
    """Admin puede actualizar datos SIS de otro usuario (no los suyos)"""
    payload = request.get_json() or {}
    current_user = _verify_token(request)
    
    if not current_user:
        return jsonify({"error": "unauthorized"}), 401
    
    if current_user["rut"] == user_id:
        return jsonify({"error": "No puedes editar tus propios datos del sistema"}), 403
    
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    db = mongo.db
    
    try:
        db.sis.update_one(
            {"rut": user_id},
            {"$set": payload},
            upsert=True
        )
        return jsonify({"ok": True, "message": "Datos SIS actualizados"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- INICIO APP ----------------
if __name__ == "__main__":
    # Seed usuarios desde funcionarios SIEMPRE al iniciar
    created = seed_users_from_funcionarios(
        os.getenv("DEFAULT_FUN_PWD", "fun123"),
        os.getenv("DEFAULT_ADMIN_PWD", "admin123"),
    )
    print(f"[seed] usuarios creados desde funcionarios: {created}")
    app.run(debug=True, port=5000)