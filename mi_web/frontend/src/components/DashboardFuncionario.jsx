import { useState, useEffect } from "react";
import FormularioFuncionario from "./FormularioFuncionario";
import FormularioMedicamento from "./FormularioMedicamento";
import "../DashboardFuncionario.css";

export default function DashboardFuncionario({ usuario }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [editingMed, setEditingMed] = useState(null);
  const [residentes, setResidentes] = useState([]);

  const fetchFuncionarios = async () => {
    const res = await fetch("http://localhost:5000/api/funcionarios");
    const data = await res.json();
    setFuncionarios(data);
  };

  const fetchMedicamentos = async () => {
    const res = await fetch("http://localhost:5000/api/medicamentos");
    const data = await res.json();
    setMedicamentos(data);
  };

  const fetchResidentes = async () => {
    const res = await fetch("http://localhost:5000/api/residentes");
    const data = await res.json();
    setResidentes(data);
  };

  useEffect(() => {
    fetchFuncionarios();
    fetchMedicamentos();
    fetchResidentes();
  }, []);

  const handleEliminarFuncionario = async rut => {
    await fetch(`http://localhost:5000/api/funcionarios/${rut}`, { method: "DELETE" });
    fetchFuncionarios();
  };

  const handleEliminarMedicamento = async id => {
    await fetch(`http://localhost:5000/api/medicamentos/${id}`, { method: "DELETE" });
    fetchMedicamentos();
  };

  return (
    <div className="dashboard-funcionario">
      <h2>Bienvenido {usuario}</h2>

      <section>
        <h3>Gestión de Funcionarios</h3>
        <button onClick={() => setEditing({})}>Añadir Nuevo</button>
        {editing && (
          <FormularioFuncionario
            funcionario={editing}
            setEditing={setEditing}
            refresh={fetchFuncionarios}
          />
        )}
        <table border="1">
         <thead>
          <tr>
            <th>RUT</th><th>Nombres</th><th>Apellidos</th><th>Cargo</th><th>Fecha de ingreso</th><th>Asistencia</th><th>Acciones</th>
          </tr>
        </thead>
          <tbody>
            {funcionarios.map(f => (
              <tr key={f.rut}>
                <td>{f.rut}</td>
                <td>{f.nombres}</td>
                <td>{f.apellidos}</td>
                <td>{f.cargo}</td>
                <td>{f.fecha_ingreso}</td>
                <td>{f.asistencia ? "Sí" : "No"}</td>
                <td>
                  <button onClick={() => setEditing(f)}>Editar</button>
                  <button onClick={() => handleEliminarFuncionario(f.rut)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </section>

      <section>
        <h3>Gestión de Medicamentos</h3>
        <button onClick={() => setEditingMed({})}>Añadir Medicamento</button>
        {editingMed && (
          <FormularioMedicamento
            medicamento={editingMed}
            setEditing={setEditingMed}
            refresh={fetchMedicamentos}
            residentes={residentes}
          />
        )}
        <table border="1">
          <thead>
            <tr>
              <th>ID</th><th>Residente</th><th>Nombre</th><th>Dosis</th><th>CASO SOS</th><th>Médico</th><th>Inicio</th><th>Termino</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.map(m => {
              const residente = residentes.find(r => r.rut === m.rut_residente);
              const nombreResidente = residente ? `${residente.nombres} ${residente.apellidos}` : m.rut_residente;
              return (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{nombreResidente}</td>
                  <td>{m.nombre}</td>
                  <td>{m.dosis}</td>
                  <td>{m.caso_sos ? "S" : "N"}</td>
                  <td>{m.medico_indicador}</td>
                  <td>{m.fecha_inicio}</td>
                  <td>{m.fecha_termino || "-"}</td>
                  <td>
                    <button onClick={() => setEditingMed(m)}>Editar</button>
                    <button onClick={() => handleEliminarMedicamento(m.id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
