import { useState, useEffect } from "react";
import "../styles/DashboardFuncionario.css";

export default function FormularioMedicamento({ medicamento, setEditing, refresh, residentes, funcionarios,  mostrarTitulo = true,   rutResidenteFijo,}) { // Recibe el medicamento a editar, funcion para cerrar el formulario, funcion para refrescar la lista y lista de residentes
  const [rut_residente, setRutResidente] = useState(medicamento.rut_residente || rutResidenteFijo || ""); // Estado para cada campo del formulario
  const [nombre, setNombre] = useState(medicamento.nombre || ""); // Estado para cada campo del formulario
  const [dosis, setDosis] = useState(medicamento.dosis || ""); // Estado para cada campo del formulario
  const [caso_sos, setCasoSos] = useState(medicamento.caso_sos || false); // Estado para cada campo del formulario
  const [medico_indicador, setMedicoIndicador] = useState(medicamento.medico_indicador || ""); // Estado para cada campo del formulario
  const [fecha_inicio, setFechaInicio] = useState(medicamento.fecha_inicio || ""); // Estado para cada campo del formulario
  const [fecha_termino, setFechaTermino] = useState(medicamento.fecha_termino || ""); // Estado para cada campo del formulario

  useEffect(() => {
    if (rutResidenteFijo) setRutResidente(rutResidenteFijo);
  }, [rutResidenteFijo]);

  const handleSubmit = async () => { // Funcion para manejar el envio del formulario
    if (!rut_residente) {
      alert("Debe ingresar un RUT para asignar el medicamento");
      return;
    }

    const url = medicamento.id // Determinar la URL segun si es edicion o creacion
      ? `https://eleam.onrender.com/api/medicamentos/${medicamento.id}`
      : "https://eleam.onrender.com/api/medicamentos";

    const body = { // Cuerpo de la solicitud con los datos del formulario
      rut_residente,
      nombre,
      dosis,
      caso_sos,
      medico_indicador,
      fecha_inicio: fecha_inicio || null,
      fecha_termino: fecha_termino || null
    };

    try {  // Manejar errores con try-catch
      const res = await fetch(url, {
        method: medicamento.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) { // Manejar errores de la API
        const text = await res.text();
        throw new Error(text);
      }

      refresh();
      setEditing(null);
    } catch (error) { // Mostrar error si ocurre
      alert("Error al guardar el medicamento: " + error.message);
    }
  };

  return (
    <div className="form-medicamento">
      {mostrarTitulo && (
        <h3>{medicamento.id ? "Editar Medicamento" : "Nuevo Medicamento"}</h3>
      )}

      <input
        placeholder="RUT del Residente"
        value={rut_residente} // Estado del RUT del residente
        onChange={e => setRutResidente(e.target.value)}
        disabled={!!rutResidenteFijo} 
      />
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input placeholder="Dosis" value={dosis} onChange={e => setDosis(e.target.value)} />
      <label>
        CASO SOS:
        <input type="checkbox" checked={caso_sos} onChange={e => setCasoSos(e.target.checked)} />
      </label>
      <label>
        Médico indicador:
        <select
          value={medico_indicador}
          onChange={e => setMedicoIndicador(e.target.value)}
          required
        >
          <option value="">Seleccione un funcionario</option>
          {funcionarios.map((f, index) => (
            <option key={index} value={`${f.nombres.split(" ")[0]} ${f.apellidos.split(" ")[0]}`}>
              {f.nombres.split(" ")[0]} {f.apellidos.split(" ")[0]}
            </option>
          ))}
        </select>
      </label>
      <input type="date" value={fecha_inicio} onChange={e => setFechaInicio(e.target.value)} />
      <input type="date" value={fecha_termino} onChange={e => setFechaTermino(e.target.value)} />
      <button onClick={handleSubmit}>{medicamento.id ? "Actualizar" : "Crear"}</button>
      <button onClick={() => setEditing(null)}>Cancelar</button>
    </div>
  );
}
