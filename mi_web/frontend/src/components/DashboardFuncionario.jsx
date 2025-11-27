import { useState, useEffect } from "react";
import FormularioFuncionario from "./FormularioFuncionario";
import FormularioMedicamento from "./FormularioMedicamento";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardFuncionario.css";

export default function DashboardFuncionario({ usuario }) { // Recibe el nombre del usuario como prop
  const [funcionarios, setFuncionarios] = useState([]); // Estado para almacenar la lista de funcionarios
  const [editing, setEditing] = useState(null);  // Estado para almacenar el funcionario que se esta editando
  const [medicamentos, setMedicamentos] = useState([]);  // Estado para almacenar la lista de medicamentos
  const [editingMed, setEditingMed] = useState(null); // Estado para almacenar el medicamento que se esta editando
  const [residentes, setResidentes] = useState([]);  // Estado para almacenar la lista de residentes
  const navigate = useNavigate(); // Hook para navegar programaticamente

  const fetchFuncionarios = async () => {  // Funcion para cargar la lista de funcionarios desde la API
    const res = await fetch("https://eleam.onrender.com/api/funcionarios");
    const data = await res.json();
    setFuncionarios(data);
  };

  const fetchMedicamentos = async () => { // Funcion para cargar la lista de medicamentos desde la API
    const res = await fetch("https://eleam.onrender.com/api/medicamentos");
    const data = await res.json();
    setMedicamentos(data);
  };

  const fetchResidentes = async () => { // Funcion para cargar la lista de residentes desde la API
    const res = await fetch("https://eleam.onrender.com/api/residentes");
    const data = await res.json();
    setResidentes(data);
  };

  useEffect(() => { // Cargar datos al montar el componente
    fetchFuncionarios();
    fetchMedicamentos();
    fetchResidentes();
  }, []);
  
  const handleEliminarFuncionario = async rut => { // Funcion para eliminar un funcionario
    await fetch(`https://eleam.onrender.com/api/funcionarios/${rut}`, { method: "DELETE" });
    fetchFuncionarios();
  };

  const handleEliminarMedicamento = async (id, nombre) => { // Funcion para eliminar un medicamento
    await fetch(`https://eleam.onrender.com/api/medicamentos/${id}?nombre=${encodeURIComponent(nombre)}`, { method: "DELETE" });
    fetchMedicamentos();
  };

  return (
    <div className="dashboard-funcionario">
      <button id="boton-especial" onClick={() => navigate(`/`)}>  Salir </button>
      <h2>Bienvenido {usuario}</h2>
        <div className= "breadcrumbs">
        <span onClick={() => navigate("/")}>Inicio</span> /
        <span onClick={() => navigate("/principal")}> Personal </span> /
        <span onClick={() => navigate("/login")}> Login Administrador </span> /
        <strong> Administracion</strong>
      </div>

      <section>
        <h3>Gestión de Funcionarios</h3>
        <button onClick={() => setEditing({})}>Añadir Funcionario</button>
        {editing && ( // Mostrar formulario si se esta editando o añadiendo
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
            {funcionarios.map(f => ( // Mapear cada funcionario a una fila de la tabla
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
        {editingMed && ( // Mostrar formulario si se esta editando o añadiendo
          <FormularioMedicamento
            medicamento={editingMed}
            setEditing={setEditingMed}
            refresh={fetchMedicamentos}
            residentes={residentes}
            funcionarios={funcionarios}
          />
        )}
        <table border="1">
          <thead>
            <tr>
              <th>ID</th><th>Residente</th><th>Nombre</th><th>Dosis</th><th>CASO SOS</th><th>Médico</th><th>Inicio</th><th>Termino</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.map(m => { // Mapear cada medicamento a una fila de la tabla
              return (
                <tr key={`${m.id}-${m.nombre}`}> {/* Usar id y nombre como key unica */}
                  <td>{nombreResidente}</td>
                  <td>{m.nombre}</td>
                  <td>{m.dosis}</td>
                  <td>{m.caso_sos ? "S" : "N"}</td>
                  <td>{m.medico_indicador}</td>
                  <td>{m.fecha_inicio}</td>
                  <td>{m.fecha_termino || "-"}</td>
                  <td>
                    <button onClick={() => setEditingMed(m.nombre)}>Editar</button>
                    <button onClick={() => handleEliminarMedicamento(m.id, m.nombre)}>Eliminar</button>
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
