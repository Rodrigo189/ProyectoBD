import "../assets/styles/HistoriaClinicaTable.css";

export default function HistoriaClinicaTable({ historia }) {
  if (!historia || (Array.isArray(historia) && historia.length === 0)) {
    return <p>No hay historial clínico registrado.</p>;
  }

  // Si es un objeto (no array), mostrarlo con sus claves
  if (!Array.isArray(historia)) {
    return (
      <div className="historia-container">
        <h3>Historia Clínica</h3>
        <ul>
          <li><b>Categoría del residente:</b> {historia.categoria_residente || "—"}</li>
          <li><b>Alergias / Contraindicaciones:</b> {historia.alergias || "—"}</li>
          <li><b>Exámenes realizados:</b> {historia.examenes || "—"}</li>
          <li><b>Medicamentos asociados al ingreso:</b> {historia.medicamentos_asociados || "—"}</li>
        </ul>
      </div>
    );
  }

  // Si es un array, mostrar tabla de registros
  return (
    <div className="historia-container">
      <h3>Historia Clínica</h3>
      <table className="historia-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {historia.map((item, index) => (
            <tr key={index}>
              <td>{item.fecha || "—"}</td>
              <td>{item.motivo || "—"}</td>
              <td>{item.observaciones || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
