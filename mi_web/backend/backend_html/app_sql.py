from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos SQLite
DATABASE_PATH = 'medical_database.db'

def get_db_connection():
    """Establece conexión con la base de datos SQLite"""
    try:
        connection = sqlite3.connect(DATABASE_PATH)
        connection.row_factory = sqlite3.Row  # Para acceder a columnas por nombre
        return connection
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def create_tables_if_not_exist():
    """Crea las tablas básicas si no existen"""
    try:
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
        
    except sqlite3.Error as e:
        print(f"Error creating tables: {e}")
        return False

def execute_query(query, params=None, fetch=True):
    """Ejecuta una consulta SQL y retorna los resultados"""
    # Crear tablas si es la primera vez
    create_tables_if_not_exist()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        
        if fetch:
            # Para consultas SELECT
            results = cursor.fetchall()
            # Convertir sqlite3.Row a diccionarios
            data = [dict(row) for row in results]
            return {"success": True, "data": data, "count": len(data)}
        else:
            # Para INSERT/UPDATE/DELETE
            connection.commit()
            affected_rows = cursor.rowcount
            if affected_rows == -1:
                # Si SQLite devuelve -1, intentar calcular manualmente
                affected_rows = 1  # Asumir al menos 1 cambio si no hay error
            
            return {"success": True, "affected_rows": affected_rows}
            
    except sqlite3.Error as e:
        return {"error": f"Error en la consulta: {str(e)}"}
    finally:
        connection.close()

def execute_update_with_tracking(query):
    """Ejecuta UPDATE con seguimiento antes/después"""
    # Crear tablas si es la primera vez
    create_tables_if_not_exist()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        
        # Verificar si la tabla 'residentes' existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='residentes'")
        if not cursor.fetchone():
            return {
                "success": False,
                "error": "La tabla 'residentes' no existe en la base de datos"
            }
        
        # Extraer RUT del WHERE clause para mostrar antes/después
        import re
        rut_match = re.search(r"WHERE\s+rut\s*=\s*['\"]([^'\"]+)['\"]", query, re.IGNORECASE)
        
        if rut_match:
            rut = rut_match.group(1)
            
            # Verificar si el registro existe ANTES del UPDATE
            cursor.execute("SELECT * FROM residentes WHERE rut = ?", (rut,))
            before_data = cursor.fetchone()
            
            if not before_data:
                # El registro no existe
                cursor.execute("SELECT * FROM residentes ORDER BY nombre")
                all_data = cursor.fetchall()
                all_records = [dict(row) for row in all_data]
                
                return {
                    "success": True,
                    "affected_rows": 0,
                    "message": f"No se encontró ningún residente con RUT '{rut}' para actualizar",
                    "all_data": all_records
                }
            
            before_dict = dict(before_data)
            
            # Ejecutar el UPDATE
            cursor.execute(query)
            connection.commit()
            
            # Para UPDATE, verificar si realmente cambió algo comparando datos
            cursor.execute("SELECT * FROM residentes WHERE rut = ?", (rut,))
            after_data = cursor.fetchone()
            after_dict = dict(after_data) if after_data else None
            
            # Calcular si hubo cambios reales
            actual_affected_rows = 1 if (before_dict != after_dict) else 0
            
            # Obtener todos los registros para mostrar el estado completo
            cursor.execute("SELECT * FROM residentes ORDER BY nombre")
            all_data = cursor.fetchall()
            all_records = [dict(row) for row in all_data]
            
            return {
                "success": True, 
                "affected_rows": actual_affected_rows,  # Número real de cambios
                "update_tracking": True,
                "before_data": before_dict,
                "after_data": after_dict,
                "all_data": all_records,  # Todos los datos para mostrar
                "count": len(all_records),
                "rut": rut
            }
        else:
            # Si no se puede extraer RUT, ejecutar UPDATE normal pero mostrar todos los datos
            cursor.execute(query)
            connection.commit()
            affected_rows = cursor.rowcount
            
            # Obtener todos los registros
            cursor.execute("SELECT * FROM residentes ORDER BY nombre")
            all_data = cursor.fetchall()
            all_records = [dict(row) for row in all_data]
            
            return {
                "success": True, 
                "affected_rows": affected_rows,
                "all_data": all_records,
                "count": len(all_records)
            }
            
    except sqlite3.Error as e:
        return {"error": f"Error en la consulta: {str(e)}"}
    finally:
        connection.close()

def execute_insert_with_tracking(query):
    """Ejecuta INSERT y muestra el registro insertado"""
    # Crear tablas si es la primera vez
    create_tables_if_not_exist()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        
        # Extraer RUT del INSERT para mostrar el registro insertado
        import re
        rut_match = re.search(r"VALUES\s*\(\s*['\"]([^'\"]+)['\"]", query, re.IGNORECASE)
        
        # Contar registros ANTES del INSERT
        cursor.execute("SELECT COUNT(*) FROM residentes")
        records_before = cursor.fetchone()[0]
        
        # Ejecutar el INSERT
        cursor.execute(query)
        connection.commit()
        
        # Contar registros DESPUÉS del INSERT para calcular filas afectadas
        cursor.execute("SELECT COUNT(*) FROM residentes")
        records_after = cursor.fetchone()[0]
        actual_affected_rows = records_after - records_before
        
        # Siempre intentar obtener el registro insertado
        inserted_dict = None
        if rut_match and actual_affected_rows > 0:
            rut = rut_match.group(1)
            # Obtener el registro recién insertado
            cursor.execute("SELECT * FROM residentes WHERE rut = ?", (rut,))
            inserted_data = cursor.fetchone()
            inserted_dict = dict(inserted_data) if inserted_data else None
        
        # También obtener todos los registros para mostrar el estado completo
        cursor.execute("SELECT * FROM residentes ORDER BY nombre")
        all_data = cursor.fetchall()
        all_records = [dict(row) for row in all_data]
        
        return {
            "success": True,
            "affected_rows": actual_affected_rows,  # Número real de filas insertadas
            "insert_tracking": True,
            "inserted_data": inserted_dict,
            "all_data": all_records,  # Todos los datos para mostrar
            "count": len(all_records),
            "rut": rut_match.group(1) if rut_match else None
        }
            
    except sqlite3.Error as e:
        return {"error": f"Error en la consulta: {str(e)}"}
    finally:
        connection.close()

def execute_delete_with_tracking(query):
    """Ejecuta DELETE y muestra qué registros se eliminaron"""
    # Crear tablas si es la primera vez
    create_tables_if_not_exist()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        
        # Extraer RUT del WHERE clause para mostrar qué se va a eliminar
        import re
        rut_match = re.search(r"WHERE\s+rut\s*=\s*['\"]([^'\"]+)['\"]", query, re.IGNORECASE)
        
        deleted_dict = None
        records_before = 0
        
        # Contar registros ANTES del DELETE
        cursor.execute("SELECT COUNT(*) FROM residentes")
        records_before = cursor.fetchone()[0]
        
        if rut_match:
            rut = rut_match.group(1)
            # Obtener datos ANTES del DELETE
            cursor.execute("SELECT * FROM residentes WHERE rut = ?", (rut,))
            deleted_data = cursor.fetchone()
            deleted_dict = dict(deleted_data) if deleted_data else None
        
        # Ejecutar el DELETE
        cursor.execute(query)
        connection.commit()
        
        # Contar registros DESPUÉS del DELETE para calcular filas afectadas
        cursor.execute("SELECT COUNT(*) FROM residentes")
        records_after = cursor.fetchone()[0]
        actual_affected_rows = records_before - records_after
        
        # Obtener todos los registros restantes para mostrar el estado actual
        cursor.execute("SELECT * FROM residentes ORDER BY nombre")
        all_data = cursor.fetchall()
        all_records = [dict(row) for row in all_data]
        
        return {
            "success": True,
            "affected_rows": actual_affected_rows,  # Número real de filas eliminadas
            "delete_tracking": True,
            "deleted_data": deleted_dict,
            "all_data": all_records,  # Todos los datos restantes
            "count": len(all_records),
            "rut": rut_match.group(1) if rut_match else None
        }
            
    except sqlite3.Error as e:
        return {"error": f"Error en la consulta: {str(e)}"}
    finally:
        connection.close()

def execute_create_with_tracking(query):
    """Ejecuta CREATE TABLE y muestra información de la tabla creada"""
    # Crear tablas si es la primera vez
    create_tables_if_not_exist()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        
        # Extraer nombre de tabla del CREATE
        import re
        table_match = re.search(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_]+)", query, re.IGNORECASE)
        table_name = table_match.group(1) if table_match else "desconocida"
        
        # VERIFICAR SI LA TABLA YA EXISTE ANTES DE CREAR
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", (table_name,))
        table_exists = cursor.fetchone()
        
        if table_exists and "IF NOT EXISTS" not in query.upper():
            # La tabla ya existe y no se usó IF NOT EXISTS
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            all_tables = [row[0] for row in cursor.fetchall()]
            
            return {
                "success": False,
                "error": f"La tabla '{table_name}' ya existe en la base de datos",
                "create_tracking": True,
                "table_name": table_name,
                "table_structure": [],
                "all_tables": all_tables,
                "table_already_existed": True
            }
        
        # Ejecutar el CREATE
        cursor.execute(query)
        connection.commit()
        
        # Obtener información de la tabla creada
        cursor.execute("PRAGMA table_info(?)", (table_name,))
        table_info = cursor.fetchall()
        table_structure = [dict(row) for row in table_info] if table_info else []
        
        # Obtener TODAS las tablas en la base de datos
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        all_tables = [row[0] for row in cursor.fetchall()]
        
        return {
            "success": True,
            "create_tracking": True,
            "table_name": table_name,
            "table_structure": table_structure,
            "all_tables": all_tables,
            "table_already_existed": False
        }
            
    except sqlite3.Error as e:
        return {"error": f"Error en la consulta: {str(e)}"}
    finally:
        connection.close()

def execute_drop_with_tracking(query):
    """Ejecuta DROP TABLE y muestra información de la tabla eliminada"""
    # Crear tablas si es la primera vez
    create_tables_if_not_exist()
    
    connection = get_db_connection()
    if not connection:
        return {"error": "No se pudo conectar a la base de datos"}
    
    try:
        cursor = connection.cursor()
        
        # Extraer nombre de tabla del DROP
        import re
        table_match = re.search(r"DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z_]+)", query, re.IGNORECASE)
        table_name = table_match.group(1) if table_match else "desconocida"
        
        # VERIFICAR SI LA TABLA EXISTE ANTES DE INTENTAR ELIMINAR
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", (table_name,))
        table_exists = cursor.fetchone()
        
        if not table_exists:
            # La tabla no existe - no se puede eliminar
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            remaining_tables = [row[0] for row in cursor.fetchall()]
            
            return {
                "success": False,
                "error": f"La tabla '{table_name}' no existe en la base de datos",
                "drop_tracking": True,
                "table_name": table_name,
                "table_structure": [],
                "records_deleted": 0,
                "remaining_tables": remaining_tables,
                "table_existed": False
            }
        
        # Obtener información ANTES del DROP (solo si la tabla existe)
        table_structure = []
        record_count = 0
        try:
            cursor.execute("PRAGMA table_info(?)", (table_name,))
            table_info = cursor.fetchall()
            table_structure = [dict(row) for row in table_info] if table_info else []
            
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            record_count = cursor.fetchone()[0]
        except Exception as e:
            table_structure = []
            record_count = 0
        
        # Ejecutar el DROP
        cursor.execute(query)
        connection.commit()
        
        # Obtener TODAS las tablas restantes en la base de datos
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        remaining_tables = [row[0] for row in cursor.fetchall()]
        
        return {
            "success": True,
            "drop_tracking": True,
            "table_name": table_name,
            "table_structure": table_structure,
            "records_deleted": record_count,
            "remaining_tables": remaining_tables,
            "table_existed": True
        }
            
    except sqlite3.Error as e:
        return {"error": f"Error en la consulta: {str(e)}"}
    finally:
        connection.close()

@app.route('/')
def index():
    """Redirige directamente a SQL básico"""
    return sql_basico()

@app.route('/sql-basico')
@app.route('/sql_basico')
def sql_basico():
    """Sirve la página de SQL básico"""
    try:
        with open('sql_basico.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Página SQL Básico no encontrada", 404

@app.route('/sql-relacionado')
def sql_relacionado():
    """Sirve la página de SQL relacionado"""
    try:
        with open('sql_relacionado.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Página SQL Relacionado no encontrada", 404

# === ENDPOINTS PARA CONSULTAS SQL BÁSICAS ===

@app.route('/api/execute-sql', methods=['POST'])
def execute_sql():
    """Ejecuta una consulta SQL proporcionada"""
    data = request.get_json()
    query = data.get('query', '').strip()
    
    if not query:
        return jsonify({"error": "No se proporcionó una consulta SQL"})
    
    # Validaciones básicas de seguridad
    dangerous_keywords = ['DROP DATABASE', 'DROP SCHEMA', 'TRUNCATE', 'DELETE FROM residentes', 'DELETE FROM funcionarios']
    query_upper = query.upper()
    
    for keyword in dangerous_keywords:
        if keyword in query_upper:
            return jsonify({"error": f"Consulta bloqueada por seguridad: contiene '{keyword}'"})
    
    # Manejo especial para diferentes tipos de consultas con seguimiento
    if query_upper.startswith('UPDATE'):
        result = execute_update_with_tracking(query)
    elif query_upper.startswith('INSERT'):
        result = execute_insert_with_tracking(query)
    elif query_upper.startswith('DELETE'):
        result = execute_delete_with_tracking(query)
    elif query_upper.startswith('CREATE'):
        result = execute_create_with_tracking(query)
    elif query_upper.startswith('DROP'):
        result = execute_drop_with_tracking(query)
    else:
        result = execute_query(query, fetch=query_upper.startswith('SELECT'))
    
    return jsonify(result)

@app.route('/api/populate-db', methods=['POST'])
def populate_database():
    """Pobla la base de datos con datos de ejemplo"""
    try:
        # Crear tablas primero
        create_tables_if_not_exist()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({"success": False, "error": "No se pudo conectar a la base de datos"})
        
        cursor = connection.cursor()
        executed_queries = 0
        
        try:
            # Insertar residentes de ejemplo
            residentes_data = [
                ('12345678-9', 'María González', '1945-03-15', '2023-01-10', 'Dr. Pérez', 'Hipertensión arterial', '2024-01-15'),
                ('98765432-1', 'Juan Rodríguez', '1950-07-22', '2023-02-05', 'Dr. López', 'Diabetes tipo 2', '2024-02-10'),
                ('11223344-5', 'Ana Martínez', '1940-12-03', '2023-03-01', 'Dr. García', 'Artritis reumatoide', '2024-03-05'),
                ('55667788-0', 'Pedro Sánchez', '1948-09-18', '2023-04-12', 'Dr. Pérez', 'Enfermedad de Alzheimer inicial', '2024-04-20'),
                ('22334455-6', 'Carmen López', '1952-06-30', '2023-05-03', 'Dr. López', 'Osteoporosis', '2024-05-15')
            ]
            
            cursor.executemany("""
                INSERT OR REPLACE INTO residentes 
                (rut, nombre, fecha_nacimiento, fecha_ingreso, medico_tratante, diagnostico, proximo_control)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, residentes_data)
            executed_queries += len(residentes_data)
            
            # Insertar medicamentos de ejemplo
            medicamentos_data = [
                ('12345678-9', 'Losartán', '50mg', 'NO', 'Dr. Pérez', '2023-01-10', None),
                ('12345678-9', 'Paracetamol', '500mg', 'SI', 'Dr. Pérez', '2023-01-10', None),
                ('98765432-1', 'Metformina', '850mg', 'NO', 'Dr. López', '2023-02-05', None),
                ('98765432-1', 'Insulina', '10UI', 'NO', 'Dr. López', '2023-02-05', None),
                ('11223344-5', 'Ibuprofeno', '400mg', 'SI', 'Dr. García', '2023-03-01', None)
            ]
            
            cursor.executemany("""
                INSERT OR REPLACE INTO medicamentos 
                (rut_residente, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, medicamentos_data)
            executed_queries += len(medicamentos_data)
            
            # Insertar registros vitales de ejemplo
            registros_data = [
                ('12345678-9', '2023-12-01', '08:00', 'Presión Arterial', 140.80, 'mmHg', 'Enfermera Ana', 'Mañana', 'Presión elevada'),
                ('12345678-9', '2023-12-01', '08:05', 'Temperatura', 36.5, '°C', 'Enfermera Ana', 'Mañana', 'Normal'),
                ('98765432-1', '2023-12-01', '09:00', 'Glucosa', 180, 'mg/dL', 'Enfermera María', 'Mañana', 'Glucosa elevada'),
                ('98765432-1', '2023-12-01', '09:05', 'Peso', 75.5, 'kg', 'Enfermera María', 'Mañana', 'Peso estable'),
                ('11223344-5', '2023-12-01', '10:00', 'Dolor', 7, 'escala 1-10', 'Enfermera Carmen', 'Mañana', 'Dolor articular moderado')
            ]
            
            cursor.executemany("""
                INSERT OR REPLACE INTO registros_vitales 
                (rut_residente, fecha, hora, tipo_signo_vital, valor, unidad, registrado_por, turno, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, registros_data)
            executed_queries += len(registros_data)
            
            connection.commit()
            
            return jsonify({
                "success": True, 
                "message": f"Datos cargados correctamente. {executed_queries} registros insertados para practicar."
            })
            
        except sqlite3.Error as e:
            return jsonify({"success": False, "error": f"Error al poblar base de datos: {str(e)}"})
        finally:
            connection.close()
        
    except Exception as e:
        return jsonify({"success": False, "error": f"Error general: {str(e)}"})

@app.route('/api/patients', methods=['GET'])
def get_patients():
    """Obtiene lista de todos los pacientes"""
    query = """
    SELECT rut, nombre, fecha_nacimiento, 
           YEAR(CURDATE()) - YEAR(fecha_nacimiento) AS edad,
           fecha_ingreso, medico_tratante, diagnostico
    FROM residentes 
    ORDER BY nombre
    """
    result = execute_query(query)
    return jsonify(result)

@app.route('/api/patients/<rut>')
def get_patient_detail(rut):
    """Obtiene información detallada de un paciente específico"""
    query = """
    SELECT 
        r.rut, r.nombre, r.fecha_nacimiento,
        YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) AS edad,
        r.fecha_ingreso, r.medico_tratante, r.diagnostico, r.proximo_control,
        COUNT(DISTINCT m.id) AS total_medicamentos,
        COUNT(DISTINCT rv.id) AS total_registros_vitales,
        MAX(rv.fecha) AS ultimo_registro
    FROM residentes r
    LEFT JOIN medicamentos m ON r.rut = m.rut_residente
    LEFT JOIN registros_vitales rv ON r.rut = rv.rut_residente
    WHERE r.rut = %s
    GROUP BY r.rut, r.nombre, r.fecha_nacimiento, r.fecha_ingreso, r.medico_tratante, r.diagnostico, r.proximo_control
    """
    result = execute_query(query, (rut,))
    return jsonify(result)

@app.route('/api/medications', methods=['GET'])
def get_medications():
    """Obtiene lista de medicamentos con información del paciente"""
    query = """
    SELECT 
        m.id, m.nombre AS medicamento, m.dosis, m.caso_sos,
        m.medico_indicador, m.fecha_inicio, m.fecha_termino,
        r.nombre AS paciente, r.rut
    FROM medicamentos m
    INNER JOIN residentes r ON m.rut_residente = r.rut
    ORDER BY r.nombre, m.nombre
    """
    result = execute_query(query)
    return jsonify(result)

@app.route('/api/vital-signs', methods=['GET'])
def get_vital_signs():
    """Obtiene registros vitales recientes"""
    query = """
    SELECT 
        rv.id, rv.fecha, rv.hora, rv.tipo_signo_vital, rv.valor, rv.unidad,
        rv.registrado_por, rv.turno, rv.observaciones,
        r.nombre AS paciente, r.rut
    FROM registros_vitales rv
    INNER JOIN residentes r ON rv.rut_residente = r.rut
    WHERE rv.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ORDER BY rv.fecha DESC, rv.hora DESC
    LIMIT 50
    """
    result = execute_query(query)
    return jsonify(result)

# === ENDPOINTS PARA CONSULTAS RELACIONADAS ===

@app.route('/api/patients-with-medications')
def patients_with_medications():
    """Pacientes con sus medicamentos (INNER JOIN)"""
    query = """
    SELECT 
        r.rut, r.nombre AS paciente, r.medico_tratante,
        m.nombre AS medicamento, m.dosis, m.caso_sos, m.fecha_inicio
    FROM residentes r
    INNER JOIN medicamentos m ON r.rut = m.rut_residente
    WHERE m.fecha_termino IS NULL OR m.fecha_termino > CURDATE()
    ORDER BY r.nombre, m.nombre
    """
    result = execute_query(query)
    return jsonify(result)

@app.route('/api/all-patients-medications')
def all_patients_medications():
    """Todos los pacientes con o sin medicamentos (LEFT JOIN)"""
    query = """
    SELECT 
        r.rut, r.nombre AS paciente, r.diagnostico,
        COUNT(m.id) AS total_medicamentos,
        COALESCE(GROUP_CONCAT(m.nombre SEPARATOR ', '), 'Sin medicamentos') AS medicamentos
    FROM residentes r
    LEFT JOIN medicamentos m ON r.rut = m.rut_residente
    GROUP BY r.rut, r.nombre, r.diagnostico
    ORDER BY total_medicamentos DESC, r.nombre
    """
    result = execute_query(query)
    return jsonify(result)

@app.route('/api/doctor-statistics')
def doctor_statistics():
    """Estadísticas por médico tratante"""
    query = """
    SELECT 
        medico_tratante,
        COUNT(*) as total_pacientes,
        ROUND(AVG(YEAR(CURDATE()) - YEAR(fecha_nacimiento)), 1) as edad_promedio,
        MIN(fecha_ingreso) as primer_ingreso,
        MAX(fecha_ingreso) as ultimo_ingreso,
        COUNT(CASE WHEN proximo_control <= CURDATE() THEN 1 END) as controles_vencidos
    FROM residentes 
    GROUP BY medico_tratante
    ORDER BY total_pacientes DESC
    """
    result = execute_query(query)
    return jsonify(result)

@app.route('/api/risk-assessment')
def risk_assessment():
    """Evaluación de riesgo de pacientes"""
    query = """
    SELECT 
        r.rut, r.nombre,
        YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) AS edad,
        COUNT(m.id) as total_medicamentos,
        COALESCE(DATEDIFF(CURDATE(), 
            (SELECT MAX(rv.fecha) FROM registros_vitales rv WHERE rv.rut_residente = r.rut)
        ), 999) AS dias_sin_registro,
        CASE 
            WHEN YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) > 80 
                 AND COUNT(m.id) > 5 THEN 'ALTO RIESGO'
            WHEN YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) > 80 
                 OR COUNT(m.id) > 5 THEN 'RIESGO MODERADO'
            ELSE 'RIESGO BAJO'
        END AS clasificacion_riesgo
    FROM residentes r
    LEFT JOIN medicamentos m ON r.rut = m.rut_residente
    GROUP BY r.rut, r.nombre, r.fecha_nacimiento
    ORDER BY 
        CASE 
            WHEN YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) > 80 
                 AND COUNT(m.id) > 5 THEN 1
            WHEN YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) > 80 
                 OR COUNT(m.id) > 5 THEN 2
            ELSE 3
        END, r.nombre
    """
    result = execute_query(query)
    return jsonify(result)

if __name__ == '__main__':
    print(" Iniciando Sistema de Práctica de Base de Datos...")
    print(" Servidor ejecutándose en: http://localhost:5003")
    print(" Interfaz SQL: http://localhost:5003")
    app.run(debug=True, host='0.0.0.0', port=5003)