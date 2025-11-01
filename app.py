from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger

# Importar rutas
from routes.residentes_routes import residentes_bp
from routes.apoderados_routes import apoderados_bp
from routes.alergias_routes import alergias_bp
from routes.patologias_routes import patologias_bp
from routes.examenes_routes import examenes_bp
from routes.medicamentos_routes import medicamentos_bp
from routes.atenciones_routes import atenciones_bp
from routes.ingresos_routes import ingresos_bp
from routes.ficha_completa_routes import ficha_completa_bp
from routes.fichas_routes import fichas_bp
from routes.historia_routes import historia_bp

app = Flask(__name__)
CORS(app)

swagger = Swagger(app, template={
    "info": {
        "title": "API Ficha Clínica ELEAM (Modular - NoSQL)",
        "version": "3.0.0",
        "description": "Backend modular con Flask + MongoDB + Swagger."
    }
})

# Registrar blueprints
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

@app.route('/')
def home():
    return jsonify({
        "message": "API ELEAM en funcionamiento ✅",
        "version": "3.0.0",
        "status": "ok"
    })

@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "db": "MongoDB conectado"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
