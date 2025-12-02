import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FichaClinica.css";

export default function FichaClinica() {
  const { rut } = useParams();
  const navigate = useNavigate();

  const [residente, setResidente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarFicha = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://eleam.onrender.com/api/residentes/${rut}`);
        if (!res.ok) {
          throw new Error("No se pudo cargar la ficha clínica");
        }
        const data = await res.json();
        setResidente(data);
      } catch (e) {
        console.error(e);
        setError(e.message || "Error al cargar la ficha");
      } finally {
        setLoading(false);
      }
    };

    cargarFicha();
  }, [rut]);

  if (loading) {
    return <div className="ficha-clinica">Cargando ficha clínica...</div>;
  }

  if (error || !residente) {
    return (
      <div className="ficha-clinica">
        <p>{error || "No se encontró la ficha clínica"}</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  // --- Mapeo según tu JSON ---
  const ficha = residente.ficha_clinica || {};
  const datosSociales = ficha.datos_sociales || {};
  const escolaridad = datosSociales.escolaridad || {};
  const antecedentesMedicos = ficha.antecedentes_medicos || {};
  const ubicacion = ficha.ubicacion || {};
  const historiaClinica = ficha.historia_clinica || {};
  const apoderado = residente.apoderado || {};
  const medicamentos = residente.medicamentos || [];
  const signosVitales = residente.signos_vitales || [];

  const fechaNac = residente.fecha_nacimiento || "-";
  const fechaIngreso = residente.fecha_ingreso || "-";

return (
  <div className="ficha-clinica-page">
    <div className="ficha-card">
      <header className="ficha-header">
        <h2>Ficha Clínica</h2>
        <div className="breadcrumbs">
          <span onClick={() => navigate("/")}>Inicio</span> /
          <span onClick={() => navigate("/principal")}> Información Residente</span> /
          <strong> Ficha Clínica</strong>
        </div>
      </header>
      {/* DATOS DEL PACIENTE */}
      <section className="seccion-datos">
        <h3>Datos del Paciente</h3>
        <p><strong>RUT:</strong> {residente.rut}</p>
        <p><strong>Nombre:</strong> {residente.nombre}</p>
        <p><strong>Fecha de Nacimiento:</strong> {fechaNac}</p>
        <p><strong>Fecha de Ingreso:</strong> {fechaIngreso}</p>
        <p><strong>Sexo:</strong> {residente.sexo || "-"}</p>
        <p><strong>Dirección:</strong> {residente.direccion || "-"}</p>
        <p><strong>Previsión de Salud:</strong> {residente.prevision_salud || "-"}</p>
      </section>

      {/* INFORMACIÓN MÉDICA */}
      <section className="seccion-medica">
        <h3>Información Médica</h3>
        <p><strong>Médico Tratante:</strong> {residente.medico_tratante || "-"}</p>
        <p><strong>Próximo control:</strong> {residente.proximo_control || "-"}</p>
        <p><strong>Diagnóstico:</strong> {residente.diagnostico || "-"}</p>

        {/* Antecedentes médicos detallados */}
        {Object.keys(antecedentesMedicos).length > 0 && (
          <>
            <h3>Antecedentes médicos</h3>
            {Object.entries(antecedentesMedicos).map(([k, v]) => (
              <p key={k}>
                <strong>{k.replace(/_/g, " ")}:</strong>{" "}
                {typeof v === "boolean" ? (v ? "Sí" : "No") : String(v)}
              </p>
            ))}
          </>
        )}

        {/* Datos sociales */}
        {Object.keys(datosSociales).length > 0 && (
          <>
            <h3>Datos sociales</h3>
            {Object.entries(datosSociales)
              .filter(([k]) => k !== "escolaridad")
              .map(([k, v]) => (
                <p key={k}>
                  <strong>{k.replace(/_/g, " ")}:</strong>{" "}
                  {typeof v === "boolean" ? (v ? "Sí" : "No") : String(v)}
                </p>
              ))}

            {Object.keys(escolaridad).length > 0 && (
              <>
                <h3>Escolaridad</h3>
                {Object.entries(escolaridad).map(([k, v]) => (
                  <p key={k}>
                    <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
                  </p>
                ))}
              </>
            )}
          </>
        )}

        {/* Ubicación */}
        {Object.keys(ubicacion).length > 0 && (
          <>
            <h3>Ubicación / Institucionalización</h3>
            {Object.entries(ubicacion).map(([k, v]) => (
              <p key={k}>
                <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
              </p>
            ))}
          </>
        )}

        {/* Apoderado */}
        {Object.keys(apoderado).length > 0 && (
          <>
            <h3>Apoderado</h3>
            {Object.entries(apoderado).map(([k, v]) => (
              <p key={k}>
                <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
              </p>
            ))}
          </>
        )}

        {/* Historia clínica */}
        {Object.keys(historiaClinica).length > 0 && (
          <>
            <h3>Historia clínica</h3>
            {Object.entries(historiaClinica).map(([k, v]) => {
              if (k === "historial_atenciones") {
                return (
                  <p key={k}>
                    <strong>Historial de atenciones:</strong>{" "}
                    {Array.isArray(v) && v.length === 0
                      ? "Sin registros"
                      : JSON.stringify(v)}
                  </p>
                );
              }
              return (
                <p key={k}>
                  <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
                </p>
              );
            })}
          </>
        )}
      </section>

      {/* MEDICAMENTOS + SIGNOS VITALES */}
      <section className="seccion-medicamentos">
        <h3>Medicamentos</h3>
        {medicamentos.length === 0 ? (
          <p>No hay medicamentos registrados.</p>
        ) : (
          <table style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dosis</th>
                <th>CASO SOS</th>
                <th>Médico</th>
                <th>Inicio</th>
                <th>Término</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((m, i) => (
                <tr key={`${m.nombre}-${i}`}>
                  <td>{m.nombre}</td>
                  <td>{m.dosis}</td>
                  <td>{m.caso_sos ? "Sí" : "No"}</td>
                  <td>{m.medico_indicador}</td>
                  <td>{m.fecha_inicio || "-"}</td>
                  <td>{m.fecha_termino || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ marginTop: "25px" }}>Signos vitales</h3>
        {signosVitales.length === 0 ? (
          <p>No hay registros de signos vitales.</p>
        ) : (
          <table style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>PA (Sis/Dia)</th>
                <th>Temp</th>
                <th>Pulso</th>
                <th>Sat O₂</th>
                <th>FR</th>
                <th>HGT</th>
              </tr>
            </thead>
            <tbody>
              {signosVitales.map((s, i) => (
                <tr key={i}>
                  <td>{s.fecha}</td>
                  <td>{s.hora}</td>
                  <td>
                    {s.presionSistolica} / {s.presionDiastolica}
                  </td>
                  <td>{s.temperatura}</td>
                  <td>{s.pulso}</td>
                  <td>{s.saturacionO2}</td>
                  <td>{s.frecuenciaRespiratoria}</td>
                  <td>{s.hemoglucotest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
    </div>
  );
}
