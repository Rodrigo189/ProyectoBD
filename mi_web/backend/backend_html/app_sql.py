from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import re

app = Flask(__name__)
CORS(app)

DATABASE_PATH = 'medical_database.db'

def get_db_connection():
    try:
        connection = sqlite3.connect(DATABASE_PATH)
        connection.row_factory = sqlite3.Row  
        return connection
    except sqlite3.Error as e:
        print(f"Error de conexión: {e}")
        return None

def create_tables():
    connection = get_db_connection()
    if not connection:
        return False
        
    cursor = connection.cursor()
    
    # Tabla residentes
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS residentes (
            rut TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            fecha_nacimiento DATE,
            fecha_ingreso DATE,
            medico_tratante TEXT,
            diagnostico TEXT,
            proximo_control DATE
        )
    """)
    
    # Tabla medicamentos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut_residente TEXT,
            nombre TEXT,
            dosis TEXT,
            caso_sos TEXT DEFAULT 'NO',
            medico_indicador TEXT,
            fecha_inicio DATE,
            fecha_termino DATE,
            FOREIGN KEY (rut_residente) REFERENCES residentes(rut)
        )
    """)
    
    # Tabla registros_vitales
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS registros_vitales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut_residente TEXT,
            fecha DATE,
            hora TIME,
            tipo_signo_vital TEXT,
            valor REAL,
            unidad TEXT,
            registrado_por TEXT,
            turno TEXT,
            observaciones TEXT,
            FOREIGN KEY (rut_residente) REFERENCES residentes(rut)
        )
    """)
    
    connection.commit()
    connection.close()
    return True

def execute_query(query):
    create_tables()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        cursor.execute(query)
        
        query_type = query.strip().upper().split()[0]
        
        if query_type == 'SELECT':
            results = cursor.fetchall()
            data = [dict(row) for row in results]
            return {"success": True, "data": data, "count": len(data)}
        else:
            connection.commit()
            affected_rows = cursor.rowcount if cursor.rowcount != -1 else 1
            return {"success": True, "affected_rows": affected_rows}
            
    except sqlite3.Error as e:
        return {"error": f"Error: {str(e)}"}
    finally:
        connection.close()

@app.route('/')
def index():
    return sql_basico()

@app.route('/sql-basico')
@app.route('/sql_basico')
def sql_basico():
    try:
        with open('sql_basico.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Archivo no encontrado", 404

@app.route('/sql-relacionado')
def sql_relacionado():
    try:
        with open('sql_relacionado.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Archivo no encontrado", 404

@app.route('/api/execute-sql', methods=['POST'])
def execute_sql():
    data = request.get_json()
    query = data.get('query', '').strip()
    
    if not query:
        return jsonify({"error": "No se proporcionó consulta"})
    
    # Validaciones básicas
    dangerous = ['DROP DATABASE', 'TRUNCATE']
    if any(keyword in query.upper() for keyword in dangerous):
        return jsonify({"error": "Consulta no permitida"})
    
    result = execute_query(query)
    return jsonify(result)

@app.route('/api/populate-db', methods=['POST'])
def populate_database():
    try:
        create_tables()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({"success": False, "error": "Error de conexión"})
        
        cursor = connection.cursor()
        
        # Datos de ejemplo
        residentes_data = [
            ('12345678-9', 'María González', '1945-03-15', '2023-01-10', 'Dr. Pérez', 'Hipertensión', '2024-01-15'),
            ('98765432-1', 'Juan Rodríguez', '1950-07-22', '2023-02-05', 'Dr. López', 'Diabetes', '2024-02-10'),
            ('11223344-5', 'Ana Martínez', '1940-12-03', '2023-03-01', 'Dr. García', 'Artritis', '2024-03-05')
        ]
        
        cursor.executemany("""
            INSERT OR REPLACE INTO residentes 
            (rut, nombre, fecha_nacimiento, fecha_ingreso, medico_tratante, diagnostico, proximo_control)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, residentes_data)
        
        medicamentos_data = [
            ('12345678-9', 'Losartán', '50mg', 'NO', 'Dr. Pérez', '2023-01-10', None),
            ('98765432-1', 'Metformina', '850mg', 'NO', 'Dr. López', '2023-02-05', None),
            ('11223344-5', 'Ibuprofeno', '400mg', 'SI', 'Dr. García', '2023-03-01', None)
        ]
        
        cursor.executemany("""
            INSERT OR REPLACE INTO medicamentos 
            (rut_residente, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, medicamentos_data)
        
        registros_data = [
            ('12345678-9', '2023-12-01', '08:00', 'Presión Arterial', 140.80, 'mmHg', 'Enfermera Ana', 'Mañana', 'Normal'),
            ('98765432-1', '2023-12-01', '09:00', 'Glucosa', 180, 'mg/dL', 'Enfermera María', 'Mañana', 'Elevada'),
            ('11223344-5', '2023-12-01', '10:00', 'Dolor', 7, 'escala 1-10', 'Enfermera Carmen', 'Mañana', 'Moderado')
        ]
        
        cursor.executemany("""
            INSERT OR REPLACE INTO registros_vitales 
            (rut_residente, fecha, hora, tipo_signo_vital, valor, unidad, registrado_por, turno, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, registros_data)
        
        connection.commit()
        connection.close()
        
        return jsonify({"success": True, "message": "Datos cargados correctamente"})
        
    except Exception as e:
        return jsonify({"success": False, "error": f"Error: {str(e)}"})

if __name__ == '__main__':
    print("Iniciando servidor...")
    print("URL: http://localhost:5003")
    app.run(debug=True, host='0.0.0.0', port=5003)