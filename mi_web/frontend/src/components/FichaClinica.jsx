// src/pages/FichaClinica.jsx  (o donde lo tengas)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FichaClinica.css"; // si tienes un CSS propio

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
    return <div className="ficha-clinica-page">Cargando ficha clínica...</div>;
  }

  if (error || !residente) {
    return (
      <div className="ficha-clinica-page">
        <p>{error || "No se encontró la ficha clínica"}</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  // Soportar estructuras viejas y nuevas
  const datosPersonales = residente.datos_personales || {};
  const antecedentesMedicos = residente.antecedentes_medicos || {};
  const datosSociales = residente.datos_sociales || {};
  const apoderado = residente.apoderado || {};
  const historiaClinica = residente.historia_clinica || {};
  const medicamentos = residente.medicamentos || [];
  const signosVitales = residente.signos_vitales || [];

  const fechaNac =
    datosPersonales.fecha_nacimiento || residente.fecha_nacimiento || "-";
  const fechaIngreso =
    datosPersonales.fecha_ingreso || residente.fecha_ingreso || "-";

  return (
    <div className="ficha-clinica-page">
      <header className="ficha-header">
        <h1>Ficha Clínica</h1>
        <div className="breadcrumbs">
          <span onClick={() => navigate("/")}>Inicio</span> /
          <span onClick={() => navigate("/principal")}> Información Residente </span> /
          <strong> Ficha Clínica </strong>
        </div>
      </header>

      {/* DATOS DEL PACIENTE */}
      <section className="card">
        <h2>Datos del Paciente</h2>
        <hr />
        <p><strong>RUT:</strong> {residente.rut}</p>
        <p><strong>Nombre:</strong> {residente.nombre}</p>
        <p><strong>Fecha de Nacimiento:</strong> {fechaNac}</p>
        <p><strong>Fecha de Ingreso:</strong> {fechaIngreso}</p>
        <p><strong>Sexo:</strong> {datosPersonales.sexo || "-"}</p>
        <p><strong>Dirección:</strong> {datosPersonales.direccion || residente.direccion || "-"}</p>
        <p><strong>Previsión de Salud:</strong> {datosPersonales.prevision_salud || "-"}</p>
      </section>

      {/* INFORMACIÓN MÉDICA / ANTECEDENTES */}
      <section className="card">
        <h2>Información Médica</h2>
        <hr />
        <p><strong>Médico Tratante:</strong> {antecedentesMedicos.medico_tratante || residente.medico_tratante || "-"}</p>
        <p><strong>Próximo control:</strong> {antecedentesMedicos.proximo_control || residente.proximo_control || "-"}</p>
        <p><strong>Diagnóstico:</strong> {antecedentesMedicos.diagnostico || residente.diagnostico || "-"}</p>

        {/* Si guardaste más antecedentes, los mostramos genéricamente */}
        {Object.entries(antecedentesMedicos).map(([k, v]) => {
          if (["medico_tratante", "proximo_control", "diagnostico"].includes(k)) return null;
          return (
            <p key={k}>
              <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
            </p>
          );
        })}
      </section>

      {/* DATOS SOCIALES */}
      {Object.keys(datosSociales).length > 0 && (
        <section className="card">
          <h2>Datos Sociales</h2>
          <hr />
          {Object.entries(datosSociales).map(([k, v]) => (
            <p key={k}>
              <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
            </p>
          ))}
        </section>
      )}

      {/* APODERADO */}
      {Object.keys(apoderado).length > 0 && (
        <section className="card">
          <h2>Apoderado</h2>
          <hr />
          {Object.entries(apoderado).map(([k, v]) => (
            <p key={k}>
              <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
            </p>
          ))}
        </section>
      )}

      {/* HISTORIA CLÍNICA (texto largo) */}
      {Object.keys(historiaClinica).length > 0 && (
        <section className="card">
          <h2>Historia Clínica</h2>
          <hr />
          {Object.entries(historiaClinica).map(([k, v]) => (
            <p key={k}>
              <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
            </p>
          ))}
        </section>
      )}

      {/* MEDICAMENTOS */}
      <section className="card">
        <h2>Medicamentos</h2>
        <hr />
        {medicamentos.length === 0 ? (
          <p>No hay medicamentos registrados.</p>
        ) : (
          <table className="tabla-simple">
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
      </section>

      {/* SIGNOS VITALES */}
      <section className="card">
        <h2>Signos Vitales</h2>
        <hr />
        {signosVitales.length === 0 ? (
          <p>No hay registros de signos vitales.</p>
        ) : (
          <table className="tabla-simple">
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
                  <td>{s.presionSistolica} / {s.presionDiastolica}</td>
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

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => navigate(`/dashboard?rut=${rut}`)}>
          Volver al Portal del Residente
        </button>
      </div>
    </div>
  );
}
