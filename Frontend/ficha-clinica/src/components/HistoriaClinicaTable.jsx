import '../assets/styles/HistoriaClinicaTable.css';

export default function HistoriaClinicaTable({ historia }) {
  if (!historia || historia.length === 0)
    return <p>No hay atenciones registradas.</p>;

  return (
    <table className="tabla-historia">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Motivo</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {historia.map((h, i) => (
          <tr key={i}>
            <td>{h.fecha}</td>
            <td>{h.motivo}</td>
            <td>{h.observaciones}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
