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
        // Obtener la ficha clínica
        const fichaResponse = await axios.get(`http://localhost:5000/api/historial-clinico/${rut}`);
        // Obtener los signos vitales
        const signosResponse = await axios.get(`http://localhost:5000/api/registros-vitales?rut=${rut}`);
        
        setFicha({
          ...fichaResponse.data,
          signos_vitales: signosResponse.data
        });
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
    <div className="dashboard-container">
      {/* Banner */}
      <div className="banner">
        <div className="logo" style={{ backgroundImage: "url('/image.png')" }}></div>
        <div className="portal-title">Portal ELEAM Residente</div>
      </div>

      {/* Datos residente */}
      <div className="datos-residente">
        <div className="foto-residente"></div>
        <div className="info-residente">
          <p>Nombre residente: {ficha.nombre}</p>
          <p>RUN: {ficha.rut}</p>
          <p>Médico tratante: {ficha.medico_tratante}</p>
          <p>Próximo control: {ficha.proximo_control}</p>
        </div>
      </div>

      {/* Historial Clínico */}
      <div className="historial-clinico">
        <h3>Historial de Signos Vitales</h3>
        <div className="tabla-container">
          {signos.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Presión Sistólica</th>
                  <th>Presión Diastólica</th>
                  <th>Temperatura</th>
                  <th>Pulso</th>
                  <th>Sat. O2</th>
                  <th>Frec. Respiratoria</th>
                  <th>Hemoglucotest</th>
                </tr>
              </thead>
              <tbody>
                {signos.map((s, i) => (
                  <tr key={i}>
                    <td>{s.fecha}</td>
                    <td>{s.hora}</td>
                    <td>{s.presionSistolica} mmHg</td>
                    <td>{s.presionDiastolica} mmHg</td>
                    <td>{s.temperatura} °C</td>
                    <td>{s.pulso} lpm</td>
                    <td>{s.saturacionO2} %</td>
                    <td>{s.frecuenciaRespiratoria} rpm</td>
                    <td>{s.hemoglucotest} mg/dL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay signos vitales registrados para este residente.</p>
          )}
        </div>

        <div className="diagnostico-seccion">
          <h4>Diagnóstico Actual</h4>
          <p>{ficha.diagnostico}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="botones-accion">
        <button className="boton" onClick={() => window.location.href = `/dashboard?rut=${ficha.rut}`}>Volver</button>
        <button className="boton" onClick={() => navigate('/buscar-paciente')}>Búsqueda Paciente</button>
        <button className="boton" onClick={() => window.location.href = `/formulario-signos-vitales/${rut}`}>Generar Nuevo Reporte</button>
        <button className="boton" onClick={() => window.location.href = '/'}>Salir</button>
      </div>
    </div>
  );
}