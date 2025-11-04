from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime, timedelta
import os

# Flask permite levantar el servidor web, CORS (Cross-Origin Resource Sharing) habilita la comunicacion
# entre el frontend (React) y el backend (Flask), evitando bloqueos por politica de mismo origen.

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# PyMongo se utiliza para establecer la conexion con MongoDB,
# donde se almacenan los datos medicos, residentes, funcionarios, etc.

app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/eleam")
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
# Incluye operaciones CRUD (crear, leer, actualizar, eliminar), sobre los datos personales y médicos de los residentes
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
# Los funcionarios pueden registrarse, actualizar sus datos y autenticarse.
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
    data = request.get_json() if request.method == 'PUT' else None
    residente = residentes_col.find_one({"rut": rut})

    if not residente:
        return jsonify({"mensaje": "Residente no encontrado"}), 404

    # Asegurar formato lista
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
        CORS(app, resources={r"/api/*": {"origins": "*"}})
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
    return "admin" if "admin" in c else "funcionario"

def seed_users_from_funcionarios(default_fun_pwd="fun123", default_admin_pwd="admin123"):
    """
    Crea usuarios reales a partir de la colección 'funcionarios'.
    - role: admin si 'cargo' contiene 'admin'; si no, 'funcionario'.
    - username = rut (opcional).
    - passwordHash: por defecto fun123/admin123 (configurable por env).
    No sobreescribe si ya existe un usuario con ese rut.
    """
    db = mongo.db
    created = 0
    fun_hash = bcrypt.hashpw(default_fun_pwd.encode(), bcrypt.gensalt()).decode()
    adm_hash = bcrypt.hashpw(default_admin_pwd.encode(), bcrypt.gensalt()).decode()

    for f in db.funcionarios.find({}, {"rut": 1, "nombre": 1, "apellido": 1, "cargo": 1, "email": 1}):
        rut = (f.get("rut") or "").strip()
        if not rut:
            continue
        if db.usuarios.find_one({"rut": rut}):
            continue
        role = map_role_from_cargo(f.get("cargo"))
        pwd_hash = adm_hash if role == "admin" else fun_hash
        nombre = " ".join(x for x in [f.get("nombre"), f.get("apellido")] if x)
        db.usuarios.insert_one({
            "rut": rut,
            "username": rut,
            "nombre": nombre or f.get("nombre") or "",
            "role": role,
            "passwordHash": pwd_hash,
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

# Ejecutar seed real desde funcionarios (solo si lo pides con variable de entorno)
if os.getenv("SEED_FROM_FUNCIONARIOS") == "1":
    try:
        created = seed_users_from_funcionarios(
            os.getenv("DEFAULT_FUN_PWD", "fun123"),
            os.getenv("DEFAULT_ADMIN_PWD", "admin123"),
        )
        print(f"[seed] usuarios creados desde funcionarios: {created}")
    except Exception as e:
        print("[seed] error:", e)

api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.get("/health")
def api_health():
    try:
        mongo.cx.admin.command("ping")
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}, 500

# ---- Auth endpoints ----
@api_bp.post("/auth/login")
def api_login():
    body = request.get_json(force=True) or {}
    # Preferimos autenticación por RUT (RUN)
    rut = (body.get("rut") or "").strip()
    username = (body.get("username") or "").strip()
    pwd = (body.get("password") or "").encode()
    role_area = (body.get("roleArea") or "").strip()  # opcional: "admin" | "funcionario"

    q = {"rut": rut} if rut else {"username": username}
    u = mongo.db.usuarios.find_one(q)
    if not u or not pwd or not bcrypt.checkpw(pwd, u["passwordHash"].encode()):
        return jsonify({"error": "invalid_credentials"}), 401

    if role_area and u.get("role") != role_area:
        return jsonify({"error": "wrong_role", "expected": role_area, "actual": u.get("role")}), 403

    token = _create_token(u)
    user = {"id": str(u["_id"]), "username": u.get("username"), "rut": u.get("rut"), "nombre": u.get("nombre"), "role": u.get("role")}
    return jsonify({"token": token, "user": user})

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
    return jsonify({"ok": True})

@api_bp.get("/auth/me")
def api_me():
    claims = _verify_token(request)
    if not claims:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"user": claims})

# ---- Datos para dashboards (reales desde Mongo) ----
@api_bp.get("/funcionarios-list")
def api_funcionarios():
    cur = mongo.db.funcionarios.find({})
    return jsonify([_to_doc(x) for x in cur])

@api_bp.get("/funcionarios/<user_id>")
def api_funcionario(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify({"error": "not_found"}), 404
    return jsonify(_to_doc(f))

@api_bp.get("/probabilidades/<user_id>")
def api_probabilidades(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify([])
    doc = mongo.db.probabilidades.find_one({"rut": f.get("rut")})
    return jsonify(doc.get("items", [])) if doc else jsonify([])

@api_bp.get("/riesgos/<user_id>")
def api_riesgos(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify([])
    doc = mongo.db.riesgos.find_one({"rut": f.get("rut")})
    return jsonify(doc.get("items", [])) if doc else jsonify([])

@api_bp.get("/sis/<user_id>")
def api_sis(user_id):
    f = _find_funcionario(user_id)
    if not f:
        return jsonify({"turnos": 0, "horas": 0, "incidentes": 0, "extra": 0})
    doc = mongo.db.sis.find_one({"rut": f.get("rut")})
    if not doc:
        return jsonify({"turnos": 0, "horas": 0, "incidentes": 0, "extra": 0})
    d = _to_doc(doc)
    d.pop("rut", None); d.pop("id", None)
    return jsonify(d)

# Registrar el blueprint una sola vez
if "api" not in app.blueprints:
    app.register_blueprint(api_bp)

# ---------------- INICIO APP ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)