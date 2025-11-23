from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from db_nosql import get_db

# --- IMPORTACIÓN DE MÓDULOS ---
# Fíjate cómo ahora la ruta incluye 'modules.ficha_clinica'

from modules.ficha_clinica.routes.residentes_routes import residentes_bp
from modules.ficha_clinica.routes.apoderados_routes import apoderados_bp
from modules.ficha_clinica.routes.alergias_routes import alergias_bp
from modules.ficha_clinica.routes.patologias_routes import patologias_bp
from modules.ficha_clinica.routes.examenes_routes import examenes_bp
from modules.ficha_clinica.routes.medicamentos_routes import medicamentos_bp
from modules.ficha_clinica.routes.atenciones_routes import atenciones_bp
from modules.ficha_clinica.routes.ingresos_routes import ingresos_bp
from modules.ficha_clinica.routes.ficha_completa_routes import ficha_completa_bp
from modules.ficha_clinica.routes.fichas_routes import fichas_bp
from modules.ficha_clinica.routes.historia_routes import historia_bp
from modules.ficha_clinica.routes.login_routes import login_bp
from modules.ficha_clinica.routes.funcionarios_routes import funcionarios_bp

app = Flask(__name__)

# Configuración CORS
CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, 
     supports_credentials=True
)

# Configuración Swagger
swagger = Swagger(app, template={
    "info": {
        "title": "API ELEAM Modular",
        "version": "3.0.0",
        "description": "API Modular: Ficha Clínica y Gestión"
    }
})

# --- REGISTRO DE BLUEPRINTS ---
app.register_blueprint(ficha_completa_bp)
app.register_blueprint(residentes_bp)
app.register_blueprint(apoderados_bp)
app.register_blueprint(alergias_bp)
app.register_blueprint(patologias_bp)
app.register_blueprint(examenes_bp)
app.register_blueprint(medicamentos_bp)
app.register_blueprint(atenciones_bp)
app.register_blueprint(ingresos_bp)
app.register_blueprint(fichas_bp)
app.register_blueprint(historia_bp)
app.register_blueprint(login_bp)
app.register_blueprint(funcionarios_bp)

@app.route('/')
def home():
    return jsonify({
        "message": "API ELEAM Modular Funcionando 🚀",
        "modules": ["Ficha Clínica"],
        "status": "ok"
    })

@app.route('/api/health')
def health():
    try:
        db = get_db()
        # Intentamos un comando simple para verificar conexión real
        db.command('ping')
        return jsonify({"status": "ok", "db": "MongoDB conectado exitosamente"})
    except Exception as e:
        return jsonify({"status": "error", "db": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)