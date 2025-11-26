import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../HistorialClinico.css";

export default function HistorialClinico() {
  const { rut } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const response = await axios.get(`https://eleam.onrender.com/api/historial-clinico/${rut}`);
        setFicha(response.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setError("Error al cargar la ficha clínica");
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, [rut]);

  if (loading) return <div className="cargando">Cargando historial clínico...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ficha) return <div className="error">No se encontró información para el RUT indicado.</div>;

  const signos = ficha.signos_vitales || [];

  return (
    <div className="historial-clinico-container">
      {/* Encabezado */}
      <header className="header">
        <img
          src={`${process.env.PUBLIC_URL}/image.png`}
          alt="Logo ELEAM"
          className="logo"
        />
        <h1>Ficha Clínica</h1>
      </header>

      {/* Datos del residente */}
      <section className="info-paciente">
        <p><strong>RUT:</strong> {ficha.rut}</p>
        <p><strong>Nombre:</strong> {ficha.nombre}</p>
        <p><strong>Médico tratante:</strong> {ficha.medico_tratante}</p>
        <p><strong>Diagnóstico:</strong> {ficha.diagnostico}</p>
        <p><strong>Próximo control:</strong> {ficha.proximo_control}</p>
      </section>

      {/* Botones */}
      <div className="botones-container">
        <button className="btn-accion" onClick={() => navigate("/dashboard")}>
          ← Salir
        </button>
        <button className="btn-accion" onClick={() => navigate("/buscar-paciente")}>
          Buscar Paciente
        </button>
        <button className="btn-accion" onClick={() => navigate(`/formulario-signos-vitales/${rut}`)}>
          Generar Nuevo Reporte
        </button>
      </div>

      {/* Últimos registros */}
      <section className="ultimos-registros">
        <h3>Signos Vitales</h3>
        <div className="tabla-container">
        {signos.length > 0 ? (
        <table>
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Presión Sistólica</th>
                <th>Presión Diastólica</th>
            </tr>
            </thead>
            <tbody>
            {signos.map((s, i) => (
                <tr key={i}>
                <td>{s.fecha}</td>
                <td>{s.hora}</td>
                <td>{s.presionSistolica}</td>
                <td>{s.presionDiastolica}</td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p>No hay signos vitales registrados para este residente.</p>
        )}
        </div>
      </section>
    </div>
  );
}