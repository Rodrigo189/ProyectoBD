from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True) # Permite que React haga fetch desde otro puerto

# --- Configuración MySQL ---
app.config['MYSQL_HOST'] = os.environ.get("MYSQL_HOST")
app.config['MYSQL_USER'] = os.environ.get("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.environ.get("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.environ.get("MYSQL_BD")

mysql = MySQL(app)

# Entrega 1
@app.route('/', methods=['GET', 'POST'])
def prueba():
    mensajes = []
    resultados_funcionarios = []
    resultados_residentes = []
    resultados_medicamentos = []
    resultados_contrato = []

    cur = mysql.connection.cursor()

    # --- Acciones Funcionario ---
    if request.method == 'POST':
        accion = request.form.get('accion')

        # Crear funcionario
        if accion == 'crear_funcionario':
            try:
                cur.execute(
                    "INSERT INTO funcionarios (rut, nombre, cargo, clave VALUES (%s,%s,%s,%s)",
                    (request.form['rut'], request.form['nombre'], 
                     request.form['cargo'], request.form['clave'])
                )
                mysql.connection.commit()
                mensajes.append("Funcionario creado correctamente")
            except Exception as e:
                mensajes.append(f"Error al crear funcionario: {e}")

        # Editar funcionario
        elif accion == 'editar_funcionario':
            try:
                cur.execute(
                    "UPDATE funcionarios SET nombre=%s, cargo=%s, clave=%s WHERE rut=%s",
                    (request.form['nombre'],  request.form['cargo'],
                     request.form['rut'], request.form['clave'])
                )
                mysql.connection.commit()
                mensajes.append("Funcionario actualizado correctamente")
            except Exception as e:
                mensajes.append(f"Error al actualizar funcionario: {e}")

        # Eliminar funcionario
        elif accion == 'eliminar_funcionario':
            try:
                cur.execute("DELETE FROM funcionarios WHERE rut=%s", (request.form['rut'],))
                mysql.connection.commit()
                mensajes.append("Funcionario eliminado correctamente")
            except Exception as e:
                mensajes.append(f"Error al eliminar funcionario: {e}")

        # Consultar funcionarios
        elif accion == 'consultar_funcionarios':
            cur.execute("SELECT rut, nombre, cargo, clave FROM funcionarios")
            resultados_funcionarios = cur.fetchall()

        # --- Acciones Residente ---
        elif accion == 'crear_residente':
            try:
                cur.execute(
                    "INSERT INTO residentes (rut, fecha_ingreso) VALUES (%s,%s)",
                    (request.form['rut_residente'], request.form['fecha_ingreso'])
                )
                mysql.connection.commit()
                mensajes.append("Residente creado correctamente")
            except Exception as e:
                mensajes.append(f"Error al crear residente: {e}")

        elif accion == 'eliminar_residente':
            try:
                cur.execute("DELETE FROM residentes WHERE rut=%s", (request.form['rut_residente'],))
                mysql.connection.commit()
                mensajes.append("Residente eliminado correctamente")
            except Exception as e:
                mensajes.append(f"Error al eliminar residente: {e}")

        elif accion == 'consultar_residentes':
            cur.execute("SELECT rut, fecha_ingreso FROM residentes")
            resultados_residentes = cur.fetchall()
            
        # --- Acciones Contrato ---
        # Consultar contratos
        elif accion == 'consultar_contrato':
            cur.execute("SELECT id_contrato, rut, sueldo_bruto, sueldo_liquido, inicio_contrato, telefono_1, telefono_2, correo, direccion FROM contratos")
            resultados_contrato = cur.fetchall()
        # Crear contrato
        elif accion == 'crear_contrato':
            try:
                cur.execute(
                    "INSERT INTO contrato (id_contrato, rut, sueldo_bruto, sueldo_liquido, inicio_contrato, telefono_1, telefono_2, correo, direccion) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                    (request.form['id_contrato'], request.form['rut'], request.form['sueldo_bruto'],
                     request.form['sueldo_liquido'], request.form['inicio_contrato'],request.form['telefono_1'],
                     request.form['telefono_2'], request.form['correo'],request.form['direccion'])
                )
                mysql.connection.commit()
                mensajes.append("Contrato creado correctamente")
            except Exception as e:
                mensajes.append(f"Error al crear contrato: {e}")
        # Eliminar contrato
        elif accion == "eliminar_contrato":
            try:
                cur.execute("DELETE FROM contrato WHERE id_contrato=%s", (request.form['id_contrato'],))
                mysql.connection.commit()
                mensajes.append("Contrato eliminado correctamente")
            except Exception as e:
                mensajes.append(f"Error al eliminar contrato: {e}")
        # Editar contrato
        elif accion == "editar_contrato":
            try:
                cur.execute(
                    "UPDATE contrato SET sueldo_bruto=%s, sueldo_liquido=%s, inicio_contrato=%s, telefono_1=%s, telefono_2=%s, correo=%s, direccion=%s WHERE id_contrato=%s",
                    (request.form['sueldo_bruto'], request.form['sueldo_liquido'], request.form['inicio_contrato'],
                     request.form['telefono_1'], request.form['telefono_2'], request.form['correo'], request.form['direccion'])
                )
                mysql.connection.commit()
                mensajes.append("Contrato actualizado")
            except Exception as E:
                mensajes.append(f"Error al actualizar contrato: {e}")
        
        # --- Acciones Paciente ---
        # Crear Paciente
        elif accion == 'crear_paciente':
            try:
                cur.execute(
                    "INSERT INTO paciente (rut, fecha_nacimiento, familiar, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido) VALUES(%s,%s,%s,%s,%s,%s,%s)",
                    (request.form['rut'], request.form['fecha_nacimiento'], request.form['familiar'], request.form['primer_nombre'],
                     request.form['segundo_nombre'], request.form['primer_apellido'], request.form['segundo_apellido'])
                )
                mysql.connection.commit()
                mensajes.append("Paciente creado correctamente")
            except Exception as e:
                mensajes.append(f"Error al crear Paciente: {e}")
        # Consultar Paciente
        elif accion == 'consultar_paciente':
            cur.execute("SELECT rut, fecha_nacimiento, familiar, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido FROM paciente")
            resultados_pacientes = cur.fetchall()
        # Eliminar Paciente
        elif accion == 'eliminar_paciente':
            try:
                cur.execute("DELETE FROM paciente WHERE rut=%s", (request.form['rut']))
                mysql.connection.commit()
                mensajes.append("Paciente eliminado correctamente")
            except Exception as e:
                mensajes.append(f"Error al eliminar paciente: {e}")
        # Editar paciente
        elif accion == 'editar_paciente':
            try:
                cur.execute(
                    "UPDATE paciente SET fecha_nacimiento=%s, familiar=%s, primer_nombre=%s, segundo_nombre=%s, primer_apellido=%s, segundo_apellido=%s WHERE rut=%s",
                    (request.form['fecha_nacimiento'], request.form['familiar'], request.form['primer_nombre'],
                     request.form['segundo_nombre'], request.form['primer_apellido'], request.form['segundo_apellido'])
                )
                mysql.connection.commit()
                mensajes.append("Paciente actualizado")
            except Exception as e:
                mensajes.append(f"Error al actualizar paciente: {e}")
        
        # --- Acciones reemplazos ---
        # Crear reemplazos
        elif accion == 'crear_reemplazos':
            try:
                cur.execute(
                    "INSERT INTO reemplazos (id_reemplazo, rut_reemplazado, fecha, paciente, observacion, rut_reemplazante VALUES (%s,%s,%s,%s,%s,%s)",
                    (request.form['id_reemplazo'], request.form['rut_reemplazado'], request.form['fecha'],
                     request.form['paciente'], request.form['observacion'], request.form['rut_reemplazante'])
                )
                mysql.connection.commit()
                mensajes.append("Reemplazo creado correctamente")
            except Exception as e:
                mensajes.append(f"Error al crear reemplazo: {e}")
        # Consultar reemplazos
        elif accion == 'consultar_reemplazos':
            cur.execute("SELECT id_reemplazo, rut_reemplazado, fecha, paciente, observacion, rut_reemplazante FROM reemplazos")
            resultados_reemplazos = cur.fetchall()
        # Eliminar Reemplazos
        elif accion == 'eliminar_reemplazos':
            try:
                cur.execute("DELETE FROM reemplazos WHERE id_reemplazo=%s", (request.form['id_reemplazos']))
                mysql.connection.commit()
                mensajes.append("Reemplazo eliminado correctamente")
            except Exception as e:
                mensajes.append(f"Error al eliminar reemplazo: {e}")    
        # Editar reemplazos
        elif accion == 'editar_reemplazos':
            try:
                cur.execute(
                    "UPDATE reemplazos SET fecha=%s, pacientes=%s, observacion=%s WHERE id_reemplazo=%s",
                    (request.form['fecha'],request.form['pacientes'],request.form['observacion'],)
                )
                mysql.connection.commit()
                mensajes.append("Reemplazos actualizados correctamente")
            except Exception as e:
                mensajes.append(f"Error al actualizar reemplazo: {e}")    
                
        # --- Acciones Medicamento ---
        # Crear medicamento
        elif accion == 'crear_medicamento':
            try:
                fecha_termino = request.form['fecha_termino'] or None
                cur.execute(
                    """INSERT INTO medicamentos
                    (rut_residente, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino)
                    VALUES (%s,%s,%s,%s,%s,%s,%s)""",
                    (request.form['rut_residente_med'], request.form['nombre_med'],
                     request.form['dosis'], request.form.get('caso_sos', False),
                     request.form['medico_indicador'], request.form['fecha_inicio'], fecha_termino)
                )
                mysql.connection.commit()
                mensajes.append("Medicamento creado correctamente")
            except Exception as e:
                mensajes.append(f"Error al crear medicamento: {e}")
        # Eliminar medicamento
        elif accion == 'eliminar_medicamento':
            try:
                cur.execute("DELETE FROM medicamentos WHERE id=%s", (request.form['id_med'],))
                mysql.connection.commit()
                mensajes.append("Medicamento eliminado correctamente")
            except Exception as e:
                mensajes.append(f"Error al eliminar medicamento: {e}")
        # Consultar medicamento
        elif accion == 'consultar_medicamentos':
            cur.execute("SELECT id, rut_residente, nombre, dosis FROM medicamentos")
            resultados_medicamentos = cur.fetchall()

    cur.close()

    return render_template(
        "prueba.html",
        mensajes=mensajes,
        resultados_funcionarios=resultados_funcionarios,
        resultados_residentes=resultados_residentes,
        resultados_medicamentos=resultados_medicamentos,
        resultados_contrato=resultados_contrato
    )

    
# --- Portal de Medicamentos ---
@app.route('/api/residentes', methods=['POST'])
def crear_residente():
    data = request.get_json()
    rut = data.get("rut")
    fecha = data.get("fecha_ingreso")
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO residentes (rut, fecha_ingreso) VALUES (%s, %s)", (rut, fecha))
    mysql.connection.commit()
    cur.close()
    return jsonify({"rut": rut, "fecha": fecha}), 201

# --- Funcionales CRUD para Funcionarios ---
@app.route('/api/funcionarios', methods=['GET', 'POST'])
def listar_o_crear_funcionarios():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT rut, nombres, apellidos, cargo, turno, asistencia FROM funcionarios")
        rows = cur.fetchall()
        cur.close()
        # Convertir a diccionarios
        funcionarios = [
            {"rut": r[0], "nombres": r[1], "apellidos": r[2], "cargo": r[3], "turno": str(r[4]), "asistencia": r[5]}
            for r in rows
        ]
        return jsonify(funcionarios)
    
    if request.method == 'POST':
        data = request.get_json()
        rut = data.get("rut")
        nombres = data.get("nombres")
        apellidos = data.get("apellidos")
        cargo = data.get("cargo")
        turno = data.get("turno")
        asistencia = data.get("asistencia")
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO funcionarios (rut, nombres, apellidos, cargo, turno, asistencia) VALUES (%s,%s,%s,%s,%s,%s)",
                    (rut, nombres, apellidos, cargo, turno, asistencia))
        mysql.connection.commit()
        cur.close()
        return jsonify(data), 201

@app.route('/api/funcionarios/<rut>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_funcionario(rut):
    cur = mysql.connection.cursor()
    if request.method == 'PUT':
        data = request.get_json()
        cur.execute("UPDATE funcionarios SET nombres=%s, apellidos=%s, cargo=%s, turno=%s, asistencia=%s WHERE rut=%s",
                    (data['nombres'], data['apellidos'], data['cargo'], data['turno'], data['asistencia'], rut))
        mysql.connection.commit()
        cur.close()
        return jsonify(data)
    
    if request.method == 'DELETE':
        cur.execute("DELETE FROM funcionarios WHERE rut=%s", (rut,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Funcionario eliminado"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    rut = data.get("rut")
    clave = data.get("clave")
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM funcionarios WHERE rut=%s AND clave=%s", (rut, clave))
    user = cur.fetchone()
    cur.close()
    if user:
        return jsonify({"mensaje": "Login exitoso", "rut": rut})
    else:
        return jsonify({"mensaje": "Credenciales incorrectas"}), 401

# Crear medicamento
@app.route('/api/medicamentos', methods=['POST'])
def crear_medicamento():
    data = request.get_json()
    cur = mysql.connection.cursor()
    fecha_termino = data.get("fecha_termino") or None
    cur.execute("""
        INSERT INTO medicamentos 
        (rut_residente, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino) 
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        data['rut_residente'], data['nombre'], data['dosis'], data.get('caso_sos', False),
        data['medico_indicador'], data['fecha_inicio'], data['fecha_termino']
    ))
    mysql.connection.commit()
    cur.close()
    return jsonify(data), 201

# Obtener medicamentos
@app.route("/api/medicamentos", methods=["GET"])
def obtener_medicamentos():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM medicamentos")
    rows = cur.fetchall()
    medicamentos = []
    for row in rows:
        medicamentos.append({
            "id": row[0],
            "rut_residente": row[1],
            "nombre": row[2],
            "dosis": row[3],
            "caso_sos": bool(row[4]),
            "medico_indicador": row[5],
            "fecha_inicio": row[6].strftime("%Y-%m-%d") if row[6] else None,
            "fecha_termino": row[7].strftime("%Y-%m-%d") if row[7] else None
        })
    cur.close()
    return jsonify(medicamentos), 200

# Añadir o eliminar medicamento
@app.route('/api/medicamentos/<int:id>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_medicamento(id):
    cur = mysql.connection.cursor()
    
    if request.method == 'PUT':
        data = request.get_json()
        cur.execute("""
            UPDATE medicamentos 
            SET rut_residente=%s, nombre=%s, dosis=%s, caso_sos=%s, medico_indicador=%s, fecha_inicio=%s, fecha_termino=%s
            WHERE id=%s
        """, (
            data['rut_residente'], data['nombre'], data['dosis'], data['caso_sos'],
            data['medico_indicador'], data['fecha_inicio'], data['fecha_termino'], id
        ))
        mysql.connection.commit()
        cur.close()
        return jsonify(data)
    
    if request.method == 'DELETE':
        cur.execute("DELETE FROM medicamentos WHERE id=%s", (id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Medicamento eliminado"})
    
# Ruta para el formulario de turno
@app.route('/api/formulario', methods=['POST'])
def guardar_formulario():
    data = request.get_json()
    cur = mysql.connection.cursor()
    
    # Insertar en la base de datos
    cur.execute("""
        INSERT INTO formularios_turno 
        (nombre, email, hora_ingreso, fecha_ingreso, descripcion_turno, caso_sos, descripcion_sos)
        VALUES (%s, %s, %s, %s, %s, %s, %s)pa
    """, (
        data['nombre'],
        data['email'],
        data['horaIngreso'],
        data['fechaIngreso'],
        data['descripcionTurno'],
        data['casoSOS'],
        data['descripcionSOS']
    ))
    
    mysql.connection.commit()
    cur.close()
    return jsonify({"mensaje": "Formulario guardado con éxito"}), 201

# Ruta para obtener informacion detallada del residente
@app.route('/api/buscar-residente', methods=['POST'])
def buscar_residente():
    data = request.get_json()
    rut = data.get('rut')
    
    if not rut:
        return jsonify({"error": "RUT es requerido"}), 400
        
    cur = mysql.connection.cursor()
    cur.execute("SELECT rut FROM residentes WHERE rut = %s", (rut,))
    residente = cur.fetchone()
    cur.close()
    
    if residente: 
        return jsonify({"rut": residente[0], "existe": True}), 200
    return jsonify({"mensaje": "Residente no encontrado"}), 404

@app.route('/api/residentes/<rut>', methods=['GET'])
def obtener_residente(rut):
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT r.*, 
               m.nombre as medicamento, 
               m.dosis,
               m.caso_sos,
               m.medico_indicador,
               r.medico_tratante,
               r.proximo_control,
               r.diagnostico
        FROM residentes r
        LEFT JOIN medicamentos m ON r.rut = m.rut_residente
        WHERE r.rut = %s
    """, (rut,))
    
    resultado = cur.fetchone()
    cur.close()
    
    if resultado:
        return jsonify({
            "nombre": "Juan Pérez",  # Por ahora hardcodeado
            "medicoTratante": "Dr. García",
            "proximoControl": "2025-10-22",
            "diagnostico": "Hipertensión",
            "medicoIndicador": "Dra. Rodríguez",
            "medicamento": "Losartán 50mg",
            "dosis": "1 comprimido cada 12 horas",
            "casoSOS": "No"
        }), 200
    return jsonify({"mensaje": "Residente no encontrado"}), 404

# Ruta para obtener el historial clinico de un residente
@app.route('/api/historial-clinico/<rut>', methods=['GET'])
def obtener_historial(rut):
    cur = mysql.connection.cursor()
    
    # Obtener el historial clínico
    cur.execute("""
        SELECT 
            fecha,
            hora,
            tipo_signo_vital as signo_vital,
            valor
        FROM registros_vitales
        WHERE rut_residente = %s
        ORDER BY fecha DESC, hora DESC
    """, (rut,))
    
    registros = cur.fetchall()
    cur.close()
    
    if registros:
        return jsonify([{
            "fecha": reg[0].strftime('%d/%m/%Y'),
            "hora": reg[1].strftime('%H:%M'),
            "signoVital": reg[2],
            "valor": reg[3]
        } for reg in registros]), 200
    
    # Si no hay registros, devolver datos de ejemplo
    return jsonify([
        {"fecha": "01/09/2025", "hora": "10:30", "signoVital": "Presión Sistólica", "valor": "120 mmHg"},
        {"fecha": "01/09/2025", "hora": "10:30", "signoVital": "Presión Diastólica", "valor": "80 mmHg"},
        {"fecha": "01/09/2025", "hora": "10:30", "signoVital": "Pulso", "valor": "76 lpm"},
        {"fecha": "01/09/2025", "hora": "10:30", "signoVital": "Saturación O₂", "valor": "96 %"}
    ]), 200

# Ruta para consultar registros vitales por fecha
@app.route('/api/registros-vitales/<rut>', methods=['GET'])
def consultar_registros(rut):
    fecha = request.args.get('fecha')
    
    if not fecha:
        return jsonify({"error": "La fecha es requerida"}), 400
        
    cur = mysql.connection.cursor()
    try:
        cur.execute("""
            SELECT 
                hora,
                tipo_signo_vital as tipo,
                CONCAT(valor, ' ', unidad) as valor,
                observaciones
            FROM registros_vitales
            WHERE rut_residente = %s AND fecha = %s
            ORDER BY hora DESC
        """, (rut, fecha))
        
        registros = cur.fetchall()
        cur.close()
        
        if registros:
            return jsonify([{
                "hora": registro[0].strftime('%H:%M'),
                "tipo": registro[1],
                "valor": registro[2],
                "observaciones": registro[3] or ""
            } for registro in registros]), 200
            
        return jsonify([{
            "hora": "08:00",
            "tipo": "Presión Arterial",
            "valor": "120/80 mmHg",
            "observaciones": "Normal"
        }, {
            "hora": "08:05",
            "tipo": "Temperatura",
            "valor": "36.5 °C",
            "observaciones": "Normal"
        }]), 200
    except Exception as e:
        cur.close()
        return jsonify({"error": str(e)}), 500

# Ruta para crear un nuevo registro vital
@app.route('/api/registros-vitales', methods=['POST'])
def crear_registro():
    data = request.get_json()
    cur = mysql.connection.cursor()
    
    try:
        # Insertar los signos vitales
        signos_vitales = [
            ('Presión arterial sistólica', data['presionSistolica'], 'mmHg'),
            ('Presión arterial diastólica', data['presionDiastolica'], 'mmHg'),
            ('Pulso', data['pulso'], 'lpm'),
            ('Saturación O₂', data['saturacionO2'], '%'),
            ('Temperatura', data['temperatura'], '°C'),
            ('Frecuencia respiratoria', data['frecuenciaRespiratoria'], 'rpm'),
            ('Hemoglucotest', data['hemoglucotest'], 'mg/dL')
        ]

        for tipo, valor, unidad in signos_vitales:
            if valor:  # Solo insertar si hay un valor
                cur.execute("""
                    INSERT INTO registros_vitales 
                    (rut_residente, fecha, hora, tipo_signo_vital, valor, unidad,
                     diuresis_dia, diuresis_noche, deposicion, vomito, peso,
                     registrado_por, cargo, turno, observaciones)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    data['nombreResidente'],
                    data['fecha'],
                    data['hora'],
                    tipo,
                    valor,
                    unidad,
                    data['diuresisDia'],
                    data['diuresisNoche'],
                    data['deposicion'],
                    data['vomito'],
                    data['peso'],
                    data['registradoPor'],
                    data['cargo'],
                    data['turno'],
                    data['observaciones']
                ))
        
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Registro guardado con éxito"}), 201
    except Exception as e:
        mysql.connection.rollback()
        cur.close()
        return jsonify({"error": str(e)}), 500

# Obtener contratos
@app.route("/api/contratos", methods=['GET'])
def consultar_contratos():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM contratos") 
        rows = cur.fetchall()
        contratos = []
        for con in contratos:
            contratos.append({
                "id_contrato": row[0],
                "rut": row[1],
                "sueldo_bruto": row[2],
                "sueldo_liquido": row[3],
                "inicio_contrato": row[4].strftime("%Y-%m-%d"),
                "telefono_1": row[5],
                "telefono_2": row[6] if row[6] else None,
                "correo": row[7] if row[7] else None,
                "direccion": row[8] if row[8] else None
            })
        cur.close()
        return jsonify(contratos), 200
    except:
        return jsonify({"mensaje": "Contrato no encontrado"}), 404

# Crear contrato
@app.route('/api/contratos', methods=['POST'])
def crear_contrato():
    data = request.get_json()
    if data:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO contratos
            (id_contrato, rut, sueldo_bruto, sueldo_liquido, inicio_contrato, telefono_1, telefono_2, correo, direccion)
            VALUES(%s, %s, %s,%s, %s, %s,%s, %s, %s)
        """, (
            data['id_contrato'],data['rut'],data['sueldo_bruto'],data['sueldo_liquido'],data['inicio_contrato'],
            data['telefono_1'],data['telefono_2'],data['correo'],data['direccion']
        ))
        mysql.connection.commit()
        cur.close()
        return jsonify(data), 201
    return jsonify({"mensaje": "Error en la sintax"}), 400

# Obtener contrato por rut
@app.route("/api/contrato/<rut>", methods=['GET'])
def obtener_empleado(rut):
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT * FROM contratos WHERE rut=%s")
        rows = cur.fetchall()
        if rows:
            contratos = []
            for row in rows:
                contratos.append({
                    "id_contrato": row[0],
                    "rut": row[1],
                    "sueldo_bruto": row[2],
                    "sueldo_liquido": row[3],
                    "inicio_contrato": row[4].strftime("%Y-%m-%d"),
                    "telefono_1": row[5],
                    "telefono_2": row[6] if row[6] else None,
                    "correo": row[7] if row[7] else None,
                    "direccion": row[8] if row[8] else None
                })
            cur.close()
            return jsonify(contratos), 200
    except:
        return jsonify({"mensaje": "Contrato no encontrado"}), 404
    
# Añadir o eliminar contrato
@app.route('/api/contratos/<int:id_contrato>', methods=['PUT', 'DELETE'])
def actualizar_o_eliminar_contrato(id_contrato):
    cur = mysql.connection.cursor()

    if request.method == 'PUT':
        data = request.get_json()
        try:
            cur.execute("""
                UPDATE contrato
                SET rut=%s, sueldo_bruto=%s, sueldo_liquido=%s, inicio_contrato=%s, telefono_1=%s, telefono_2=%s, correo=%s, direccion=%s
                WHERE id_contrato=%s
            """, (
                data['rut'],data['sueldo_bruto'],data['sueldo_liquido'],data['inicio_contrato'],
                data['telefono_1'],data['telefono_2'],data['correo'],data['direccion'],id_contrato
            ))
            mysql.connection.commit()
            cur.close()
            return jsonify(data), 201
        except:
            return jsonify({"mensaje": "Contrato no encontrado"}), 404
    
    if request.method == 'DELETE':
        try:
            cur.execute("DELETE FROM contratos WHERE id_contrato=%s", (id_contrato))
            mysql.connection.commit()
            cur.close()
            return jsonify({"mensaje": "Contrato eliminado"}), 201
        except:
            return jsonify({"mensaje": "Contrato no encontrado"}), 404

# Ruta para consultar contrato por id
@app.route('/api/contratos/<id_contrato>', methods=['GET'])
def consultar_contrato(id_contrato):
    id_contrato = request.args.get('id_contrato')

    if not id_contrato:
        return jsonify({"error": "El id del contrato es requerido"}), 400
    
    cur = mysql.connection.cursor()
    try:
        cur.execute("""
            SELECT
                rut, sueldo_bruto, sueldo_liquido,
                inicio_contrato, telefono_1, telefono_2,
                correo, direccion
            FROM contratos
            WHERE id_contrato = %s
        """, (id_contrato))
    
        contrato = cur.fetchall()
        cur.close()
        return jsonify([{
            "rut": contrato[0],
            "sueldo_bruto": contrato[1],
            "sueldo_liquido": contrato[2],
            "inicio_contrato": contrato[3],
            "telefono 1": contrato[4],
            "telefono 2": contrato[5] or "",
            "correo": contrato[6] or "",
            "direccion": contrato[7] or ""
        }for contr in contratos]), 200
    except:
        return jsonify({"mensaje": "Contrato no encontrado"}), 404
    
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)
