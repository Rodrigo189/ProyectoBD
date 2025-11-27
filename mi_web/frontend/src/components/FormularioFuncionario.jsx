import { useState } from "react";
import "@fontsource/inria-sans";
import "../styles/FormularioFuncionario.css";

export default function FormularioFuncionario({ funcionario, setEditing, refresh }) {
  const [rut, setRut] = useState(funcionario.rut || ""); // Estado para cada campo del formulario
  const [nombres, setNombres] = useState(funcionario.nombres || ""); // Estado para cada campo del formulario
  const [apellidos, setApellidos] = useState(funcionario.apellidos || ""); // Estado para cada campo del formulario
  const [cargo, setCargo] = useState(funcionario.cargo || ""); // Estado para cada campo del formulario
  const [fechaIngreso, setFechaIngreso] = useState(funcionario.fecha_ingreso || ""); // Estado para cada campo del formulario
  const [asistencia, setAsistencia] = useState(!!funcionario.asistencia); // booleano para asistencia

  const handleSubmit = async () => { // Funcion para manejar el envio del formulario
    const url = funcionario.rut
      ? `https://eleam.onrender.com/api/funcionarios/${rut}`
      : "https://eleam.onrender.com/api/funcionarios";

    const method = funcionario.rut ? "PUT" : "POST"; // Metodo HTTP segun si es edicion o creacion

    await fetch(url, { // Llamada a la API para crear o actualizar el funcionario
      method,
      headers: { "Content-Type": "application/json" }, // Indicar que se envia JSON
      credentials: "include", // Incluir cookies en la solicitud
      body: JSON.stringify({ rut, nombres, apellidos, cargo, fecha_ingreso: fechaIngreso, asistencia }) // Cuerpo de la solicitud con los datos del formulario
    });

    setTimeout(() => { // Esperar un momento antes de refrescar la lista
      refresh();
      setEditing(null);
    }, 300);
  };

  return (
    <div className="formulario-funcionario">
      <h3>{funcionario.rut ? "Editar Funcionario" : "Nuevo Funcionario"}</h3> {/* Titulo segun si es edicion o creacion */}
      <input placeholder="RUT" value={rut} onChange={e => setRut(e.target.value)} disabled={!!funcionario.rut} />
      <input placeholder="Nombres" value={nombres} onChange={e => setNombres(e.target.value)} />
      <input placeholder="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} />
      <input placeholder="Cargo" value={cargo} onChange={e => setCargo(e.target.value)} />
      <input type="date" value={fechaIngreso} onChange={e => setFechaIngreso(e.target.value)} />
      <label>
        Asistencia:
        <input type="checkbox" checked={asistencia} onChange={e => setAsistencia(e.target.checked)} />
      </label>
      <button onClick={handleSubmit}>{funcionario.rut ? "Actualizar" : "Crear"}</button>
      <button onClick={() => setEditing(null)}>Cancelar</button>
    </div>
  );
}
