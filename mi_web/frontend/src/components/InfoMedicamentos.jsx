import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioMedicamento from "./FormularioMedicamento";
import "../styles/DashboardFuncionario.css";   // usa este CSS

export default function InfoMedicamentos() {
  const { rut } = useParams();
  const navigate = useNavigate();

  const [residente, setResidente] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [editingMed, setEditingMed] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);

  // Cargar datos del residente + medicamentos
  const cargarResidente = async () => {
    try {
      const res = await fetch(`https://eleam.onrender.com/api/residentes/${rut}`);
      if (!res.ok) return;
      const data = await res.json();
      setResidente(data);
      setMedicamentos(data.medicamentos || []);
    } catch (e) {
      console.error("Error al cargar residente:", e);
    }
  };

  // Cargar funcionarios para el <select> de médico indicador
  const cargarFuncionarios = async () => {
    try {
      const res = await fetch("https://eleam.onrender.com/api/funcionarios");
      const data = await res.json();
      setFuncionarios(data);
    } catch (e) {
      console.error("Error al cargar funcionarios:", e);
    }
  };

  useEffect(() => {
    cargarResidente();
    cargarFuncionarios();
  }, [rut]);

  // Eliminar medicamento
  const handleEliminarMedicamento = async (nombre) => {
    try {
      const res = await fetch(
        `https://eleam.onrender.com/api/medicamentos/${rut}?nombre=${encodeURIComponent(
          nombre
        )}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error al eliminar medicamento:", txt);
        alert("No se pudo eliminar el medicamento.");
        return;
      }

      await cargarResidente();
    } catch (e) {
      console.error("Error al eliminar medicamento:", e);
      alert("Ocurrió un error al eliminar el medicamento.");
    }
  };

  // Editar medicamento
  const handleEditarMedicamento = (m) => {
    setEditingMed({
      ...m,
      rut_residente: rut,
      id: rut, // el backend usa el rut en /api/medicamentos/<rut>
    });
  };

  // Nuevo medicamento
  const handleNuevoMedicamento = () => {
    setEditingMed({
      rut_residente: rut,
      nombre: "",
      dosis: "",
      caso_sos: false,
      medico_indicador: "",
      fecha_inicio: "",
      fecha_termino: "",
    });
  };

  if (!residente) {
    return (
      <div className="dashboard-funcionario">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-funcionario">
      <h2>Gestión de Medicamentos</h2>

      {/* Datos del residente */}
      <section>
        <h3>Datos del residente</h3>
        <p><strong>Nombre:</strong> {residente.nombre}</p>
        <p><strong>RUN:</strong> {residente.rut}</p>
        <p><strong>Médico tratante:</strong> {residente.medico_tratante}</p>
        <p><strong>Próximo control:</strong> {residente.proximo_control}</p>
        <button onClick={() => navigate(`/dashboard?rut=${rut}`)}>
          Volver al Portal
        </button>
      </section>

      {/* Tabla de medicamentos */}
      <section>
        <h3>Medicamentos asignados</h3>
        <button onClick={handleNuevoMedicamento}>Añadir medicamento</button>
        {medicamentos.length === 0 ? (
          <p>No hay medicamentos registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Dosis</th>
                <th>CASO SOS</th>
                <th>Médico</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((m, index) => (
                <tr key={`${m.nombre}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{m.nombre}</td>
                  <td>{m.dosis}</td>
                  <td>{m.caso_sos ? "Sí" : "No"}</td>
                  <td>{m.medico_indicador}</td>
                  <td>{m.fecha_inicio}</td>
                  <td>{m.fecha_termino || "-"}</td>
                  <td>
                    <button onClick={() => handleEditarMedicamento(m)}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminarMedicamento(m.nombre)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Formulario de medicamento (nuevo / editar) */}
      {editingMed && (
        <section>
          <h3>{editingMed.nombre ? "Editar medicamento" : "Nuevo medicamento"}</h3>
          <FormularioMedicamento
            medicamento={editingMed}
            setEditing={setEditingMed}
            refresh={cargarResidente}
            residentes={[{ rut, nombre: residente.nombre }]}
            funcionarios={funcionarios}
            mostrarTitulo={false}
          />
        </section>
      )}
    </div>
  );
}
