from flask import Flask, jsonify, request
from config import get_connection
from utils import load_queries

app = Flask(__name__)
queries = load_queries("bd/consultas.sql")

# Select con Join
@app.route("/api/pacientes-empleados")
def pacientes_empleados():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(queries["select_pacientes_empleados"])
    result = cursor.fetchall()
    conn.close()
    return jsonify(result)

# Select normal
@app.route("/api/pacientes")
def obt_pacientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(queries["select_pacientes"])
    result = cursor.fetchall()
    conn.close()
    return jsonify(result)

# Crear nuevos pacientes
@app.route("/api/crear-pacientes", methods=["POST"])
def insert_paciente():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(queries["insert_paciente"], (data["rut"], data["nombre"], data["apellido1"], data["apellido2"], data["fec_nac"]))
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Paciente insertado"}), 201

# Actualizar informacion de los pacientes
@app.route("/api/actualizar-paciente/<rut>", methods=["PUT"])
def update_paciente(rut):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(queries["update_paciente"], (data["nombre"], rut))
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Paciente actualizado"})

# Eliminar pacientes
@app.route("/api/eliminar-paciente/<rut>", methods=["DELETE"])
def delete_paciente(rut):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(queries["delete_paciente"], (rut,))
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Paciente eliminado"})

if __name__ == "__main__":
    app.run(debug=True)
