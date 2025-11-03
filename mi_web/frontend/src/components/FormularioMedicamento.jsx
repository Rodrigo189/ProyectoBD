import { useState } from "react";
import "../DashboardFuncionario.css";

export default function FormularioMedicamento({ medicamento, setEditing, refresh, residentes }) {
  const [rut_residente, setRutResidente] = useState(medicamento.rut_residente || "");
  const [nombre, setNombre] = useState(medicamento.nombre || "");
  const [dosis, setDosis] = useState(medicamento.dosis || "");
  const [caso_sos, setCasoSos] = useState(medicamento.caso_sos || false);
  const [medico_indicador, setMedicoIndicador] = useState(medicamento.medico_indicador || "");
  const [fecha_inicio, setFechaInicio] = useState(medicamento.fecha_inicio || "");
  const [fecha_termino, setFechaTermino] = useState(medicamento.fecha_termino || "");

  const handleSubmit = async () => {
    if (!rut_residente) {
      alert("Debe ingresar un RUT para asignar el medicamento");
      return;
    }

    const url = medicamento.id
      ? `http://localhost:5000/api/medicamentos/${medicamento.id}`
      : "http://localhost:5000/api/medicamentos";

    const body = {
      rut_residente,
      nombre,
      dosis,
      caso_sos,
      medico_indicador,
      fecha_inicio: fecha_inicio || null,
      fecha_termino: fecha_termino || null
    };

    try {
      const res = await fetch(url, {
        method: medicamento.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      refresh();
      setEditing(null);
    } catch (error) {
      alert("Error al guardar el medicamento: " + error.message);
    }
  };

  return (
    <div className="form-medicamento">
      <h3>{medicamento.id ? "Editar Medicamento" : "Nuevo Medicamento"}</h3>

      <input
        placeholder="RUT del Residente"
        value={rut_residente}
        onChange={e => setRutResidente(e.target.value)}
      />
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input placeholder="Dosis" value={dosis} onChange={e => setDosis(e.target.value)} />
      <label>
        CASO SOS:
        <input type="checkbox" checked={caso_sos} onChange={e => setCasoSos(e.target.checked)} />
      </label>
      <input placeholder="Médico indicador" value={medico_indicador} onChange={e => setMedicoIndicador(e.target.value)} />
      <input type="date" value={fecha_inicio} onChange={e => setFechaInicio(e.target.value)} />
      <input type="date" value={fecha_termino} onChange={e => setFechaTermino(e.target.value)} />
      <button onClick={handleSubmit}>{medicamento.id ? "Actualizar" : "Crear"}</button>
      <button onClick={() => setEditing(null)}>Cancelar</button>
    </div>
  );
}
