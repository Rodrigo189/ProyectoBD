from flask import Flask, request, jsonify, Blueprint
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime, timedelta
from bson import ObjectId
import os
import jwt
import bcrypt  # 🔧 AGREGADO

# Flask permite levantar el servidor web, CORS habilita la comunicacion
# entre el frontend (React) y el backend (Flask)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Configuración MongoDB y JWT
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.config["SECRET_KEY"] = os.environ.get("JWT_SECRET", "secret_dev")
JWT_SECRET = app.config["SECRET_KEY"]
JWT_EXP_HOURS = 6

print(">>> URI RECIBIDA:", repr(app.config["MONGO_URI"]))

mongo = PyMongo(app)

try:
    mongo.db.list_collection_names()
    print("✅ Conexión a MongoDB exitosa")
except Exception as e:
    print("❌ Error conectando a MongoDB:", e)

# Colecciones
residentes_col = mongo.db.residentes
funcionarios_col = mongo.db.funcionarios
medicamentos_col = mongo.db.medicamentos
registros_col = mongo.db.signos_vitales
formularios_col = mongo.db.formularios_turno

# 🔧 FUNCIONES AUXILIARES
def _create_token(user, rol):
    payload = {
        "sub": str(user.get("_id", "")),
        "rut": user["rut"],
        "role": rol,
        "name": user.get("nombres", ""),
        "last_names": user.get("apellidos", ""),
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

def map_role_from_cargo(cargo: str) -> str:
    c = (cargo or "").lower()
    if "administrador" in c or "administradora" in c:
        return "admin"
    return "funcionario"

def _to_doc(doc):
    """Convierte ObjectId a string"""
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
    return doc

def _find_funcionario(user_id):
    """Busca funcionario por RUT"""
    return funcionarios_col.find_one({"rut": user_id})

# --------------------------------------
# BLUEPRINT PARA PAGOS/REPORTES
# --------------------------------------
api_bp = Blueprint("api_bp", __name__, url_prefix="/api")

# Variable de desarrollo
os.putenv("SEED_DEMO_USERS", "1")

# ---------------- RESIDENTES ----------------
@app.route('/api/residentes/verificar', methods=['POST'])
def verificar_residente():
    try:
        data = request.get_json()
        if not data or "rut" not in data:
            return jsonify({"error": "RUT es requerido"}), 400

        rut = str(data["rut"]).strip().replace(".", "").upper()
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

@app.route("/api/residentes/<rut>", methods=["GET"])
def get_residente(rut):
    residente = residentes_col.find_one({"rut": rut}, {"_id": 0})
    if not residente:
        return jsonify({"message": "No encontrado"}), 404
    return jsonify(residente), 200

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

    campos = {k: v for k, v in campos.items() if v is not None}

    resultado = residentes_col.update_one(
        {"rut": rut},
        {"$set": campos}
    )

    if resultado.matched_count == 0:
        return jsonify({"message": "Residente no encontrado"}), 404

    return jsonify({"message": "Residente actualizado"}), 200

@app.route("/api/residentes/<rut>", methods=["DELETE"])
def eliminar_residente(rut):
    resultado = residentes_col.delete_one({"rut": rut})

    if resultado.deleted_count == 0:
        return jsonify({"message": "Residente no encontrado"}), 404

    return jsonify({"message": "Residente eliminado"}), 200

# ---------------- FUNCIONARIOS ----------------
@app.route('/api/funcionarios', methods=['GET', 'POST'])
def listar_o_crear_funcionarios():
    if request.method == 'GET':
        funcionarios = list(funcionarios_col.find())
        for f in funcionarios:
            f["_id"] = str(f["_id"])
        return jsonify(funcionarios), 200

    elif request.method == 'POST':
        try:
            data = request.get_json()
            print("Datos recibidos para crear funcionario:", data)

            if not data.get("rut"):
                return jsonify({"error": "El campo 'rut' es obligatorio"}), 400

            existente = funcionarios_col.find_one({"rut": data["rut"]})
            if existente:
                return jsonify({"error": "Ya existe un funcionario con ese RUT"}), 400

            data["asistencia"] = bool(data.get("asistencia", False))

            if not data.get("fecha_ingreso"):
                data["fecha_ingreso"] = datetime.now().strftime("%Y-%m-%d")
                
            nombres = data.get("nombres", "").strip().split()
            apellidos = data.get("apellidos", "").strip().split()

            if nombres and apellidos:
                primer_nombre = nombres[0].lower()
                primer_apellido = apellidos[0].lower()
                data["email"] = f"{primer_nombre}.{primer_apellido}@eleam.cl"
            else:
                data["email"] = "desconocido@eleam.cl"

            data.setdefault("nombre", nombres[0] if nombres else "")
            data.setdefault("apellido", apellidos[0] if apellidos else "")
            data.setdefault("telefono", "")
            data.setdefault("direccion", "")
            data.setdefault("nacimiento", "")
            data.setdefault("tipoContrato", "Indefinido")
            data.setdefault("inicio", data["fecha_ingreso"])
            data.setdefault("termino", "")
            data.setdefault("sueldoBruto", 0)
            data.setdefault("sueldoLiquido", 0)
            data.setdefault("bonos", 0)
            data.setdefault("fechaPago", "")

            funcionarios_col.insert_one(data)
            print("✅ Funcionario insertado correctamente")
            return jsonify({"mensaje": "Funcionario guardado correctamente"}), 201

        except Exception as e:
            print("❌ ERROR al guardar funcionario:", e)
            return jsonify({"error": str(e)}), 500

@app.route("/api/funcionarios/<rut>", methods=["PUT", "DELETE"])
def actualizar_o_eliminar_funcionario(rut):
    if request.method == "PUT":
        data = request.get_json().copy()
        data.pop("_id", None)
        if "asistencia" in data:
            data["asistencia"] = bool(data["asistencia"])
        result = funcionarios_col.update_one({"rut": rut}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario actualizado correctamente"}), 200

    elif request.method == "DELETE":
        result = funcionarios_col.delete_one({"rut": rut})
        if result.deleted_count == 0:
            return jsonify({"error": "Funcionario no encontrado"}), 404
        return jsonify({"message": "Funcionario eliminado correctamente"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    rut = data.get("rut")
    clave = data.get("clave")
    user = funcionarios_col.find_one({"rut": rut, "clave": clave})
    if user:
        return jsonify({"mensaje": "Login exitoso", "rut": rut}), 200
    return jsonify({"mensaje": "Credenciales incorrectas"}), 401

# ---------------- MEDICAMENTOS ----------------
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
        residentes = list(residentes_col.find({}, {"_id": 0, "rut": 1, "nombre": 1, "medicamentos": 1, "medicamento": 1}))
        medicamentos = []

        for r in residentes:
            meds = r.get("medicamentos", [])
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

        return jsonify(medicamentos), 200

@app.route('/api/medicamentos/<rut>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_medicamento(rut):
    data = request.get_json() if request.method == 'PUT' else None
    residente = residentes_col.find_one({"rut": rut})

    if not residente:
        return jsonify({"mensaje": "Residente no encontrado"}), 404

    if "medicamentos" not in residente or not isinstance(residente["medicamentos"], list):
        if "medicamento" in residente and residente["medicamento"]:
            residente["medicamentos"] = [residente["medicamento"]]
        else:
            residente["medicamentos"] = []

    if request.method == 'PUT':
        nombre_medicamento = data.get("nombre")
        actualizado = False

        for m in residente["medicamentos"]:
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

        if not actualizado:
            return jsonify({"mensaje": f"No se encontró el medicamento '{nombre_medicamento}'"}), 404

        residentes_col.update_one({"rut": rut}, {"$set": {"medicamentos": residente["medicamentos"]}})

        return jsonify({
            "mensaje": f"Medicamento '{nombre_medicamento}' actualizado correctamente",
            "id": rut,
            "nombre_residente": residente.get("nombre")
        }), 200

    else:
        nombre_medicamento = request.args.get("nombre")
        if not nombre_medicamento:
            return jsonify({"error": "Debe especificar el nombre del medicamento a eliminar"}), 400

        nueva_lista = [m for m in residente["medicamentos"] if m.get("nombre") != nombre_medicamento]

        if len(nueva_lista) == len(residente["medicamentos"]):
            return jsonify({"mensaje": f"No se encontró el medicamento '{nombre_medicamento}'"}), 404

        residentes_col.update_one({"rut": rut}, {"$set": {"medicamentos": nueva_lista}})

        return jsonify({
            "mensaje": f"Medicamento '{nombre_medicamento}' eliminado del residente {residente.get('nombre')}",
            "id": rut,
            "nombre_residente": residente.get("nombre")
        }), 200

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
    try:
        obj_id = ObjectId(id)
    except:
        return jsonify({"error": "ID inválido"}), 400
    if request.method == 'PUT':
        data = request.get_json()
        result = registros_col.update_one({"_id": obj_id}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"mensaje": "Registro no encontrado"}), 404
        return jsonify(data), 200
    else:
        result = registros_col.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            return jsonify({"mensaje": "Registro no encontrado"}), 404
        return jsonify({"mensaje": "Registro eliminado"}), 200

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
    return jsonify(forms), 200

# ---------------- HISTORIAL CLÍNICO ----------------
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
        return jsonify({"mensaje": seed}), 200
    except Exception as e:
        print('No se encontró la variable "SEED_DEMO_USERS"')
        return jsonify({"error": str(e)}), 404

# Ruta para insertar datos de prueba
@app.route('/api/insertar-datos-prueba', methods=['POST'])
def insertar_datos_prueba():
    try:
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
            residentes = list(residentes_col.find(
                {},
                {"_id": 0, "rut": 1, "nombre": 1}
            ).limit(50))
            return jsonify(residentes), 200
        
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

# --------------------------------------
# 🔧 ENDPOINTS BLUEPRINT (PAGOS/REPORTES)
# --------------------------------------

@api_bp.get("/health")
def api_health():
    try:
        mongo.cx.admin.command("ping")
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

# 🔧 LOGIN CORREGIDO PARA PAGOS/REPORTES
@api_bp.post("/auth/login")
def api_login():
    body = request.get_json(force=True) or {}
    rut = (body.get("rut") or "").strip()
    password = (body.get("password") or "")
    role_area = (body.get("roleArea") or "").strip()

    if not rut or not password or not role_area:
        return jsonify({"error": "Faltan datos"}), 400

    funcionario = funcionarios_col.find_one({"rut": rut})
    if not funcionario:
        return jsonify({"error": "Credenciales inválidas"}), 401

    # 🔧 VALIDACIÓN FLEXIBLE: bcrypt o texto plano
    stored_password = funcionario.get("clave", "")
    password_valida = False

    if stored_password.startswith("$2b$"):
        try:
            password_valida = bcrypt.checkpw(
                password.encode("utf-8"),
                stored_password.encode("utf-8")
            )
        except Exception:
            password_valida = False
    else:
        password_valida = (password == stored_password)

    if not password_valida:
        return jsonify({"error": "Credenciales inválidas"}), 401

    rol = map_role_from_cargo(funcionario.get("cargo", ""))
    if rol != role_area:
        return jsonify({"error": f"No autorizado: requiere cuenta de {role_area}"}), 403

    token = _create_token(funcionario, rol)

    return jsonify({
        "token": token,
        "user": {
            "rut": funcionario["rut"],
            "role": rol,
            "cargo": funcionario.get("cargo"),
            "nombre": funcionario.get("nombres", "")
        }
    }), 200

@api_bp.post("/auth/register")
def api_register():
    body = request.get_json(force=True) or {}
    rut = (body.get("rut") or "").strip()
    role = (body.get("role") or "").strip()
    password = (body.get("password") or "").strip()

    if not rut or not role or not password:
        return jsonify({"error": "missing_fields"}), 400

    pwd_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    mongo.db.usuarios.update_one(
        {"rut": rut},
        {"$set": {"rut": rut, "role": role, "passwordHash": pwd_hash}},
        upsert=True,
    )
    return jsonify({"ok": True}), 200

@api_bp.get("/auth/me")
def api_me():
    claims = _verify_token(request)
    if not claims:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"user": claims}), 200

# Registrar Blueprint
app.register_blueprint(api_bp)

# ---------------- INICIO APP ----------------
if __name__ == "__main__":
    print("🚀 Servidor iniciando...")
    app.run(debug=True, port=5000)