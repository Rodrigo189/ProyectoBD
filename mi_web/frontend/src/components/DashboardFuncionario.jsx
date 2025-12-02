import { useState, useEffect } from "react";
import FormularioFuncionario from "./FormularioFuncionario";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardFuncionario.css";

export default function DashboardFuncionario({ usuario }) { // Recibe el nombre del usuario como prop
  const [funcionarios, setFuncionarios] = useState([]); // Estado para almacenar la lista de funcionarios
  const [editing, setEditing] = useState(null);  // Estado para almacenar el funcionario que se esta editando
  const navigate = useNavigate(); // Hook para navegar programaticamente

  const fetchFuncionarios = async () => {  // Funcion para cargar la lista de funcionarios desde la API
    const res = await fetch("https://eleam.onrender.com/api/funcionarios");
    const data = await res.json();
    setFuncionarios(data);
  };

  useEffect(() => { // Cargar datos al montar el componente
    fetchFuncionarios();
  }, []);
  
  const handleEliminarFuncionario = async rut => { // Funcion para eliminar un funcionario
    await fetch(`https://eleam.onrender.com/api/funcionarios/${rut}`, { method: "DELETE" });
    fetchFuncionarios();
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
            <th>RUT</th><th>Nombres</th><th>Apellidos</th><th>Cargo</th><th>Fecha de ingreso</th><th>Teléfono</th><th>Dirección</th><th>Nacimiento</th><th>Asistencia</th><th>Acciones</th>
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
                <td>{f.telefono || "-"}</td>
                <td>{f.direccion || "-"}</td>
                <td>{f.nacimiento || "-"}</td>
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
    </div>
  );
}
