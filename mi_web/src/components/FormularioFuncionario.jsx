import { useState } from "react";
import "@fontsource/inria-sans";
import "../FormularioFuncionario.css";

export default function FormularioFuncionario({ funcionario, setEditing, refresh }) {
  const [rut, setRut] = useState(funcionario.rut || "");
  const [nombres, setNombres] = useState(funcionario.nombres || "");
  const [apellidos, setApellidos] = useState(funcionario.apellidos || "");
  const [cargo, setCargo] = useState(funcionario.cargo || "");
  const [fechaIngreso, setFechaIngreso] = useState(funcionario.fecha_ingreso || "");
  const [asistencia, setAsistencia] = useState(!!funcionario.asistencia); // booleano

  const handleSubmit = async () => {
    const url = funcionario.rut
      ? `http://localhost:5000/api/funcionarios/${rut}`
      : "http://localhost:5000/api/funcionarios";

    const method = funcionario.rut ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rut, nombres, apellidos, cargo, fecha_ingreso: fechaIngreso, asistencia })
    });

    refresh();
    setEditing(null);
  };

  return (
    <div className="formulario-funcionario">
      <h3>{funcionario.rut ? "Editar Funcionario" : "Nuevo Funcionario"}</h3>
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
