import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignosVitalesDirecto.css";

export default function SignosVitalesDirecto() {
  const navigate = useNavigate();
  const [signos, setSignos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroRut, setFiltroRut] = useState("");
  const [signosFiltrados, setSignosFiltrados] = useState([]);

  useEffect(() => {
    cargarTodosLosSignos();
  }, []);

  const cargarTodosLosSignos = async () => {
    try {
      setLoading(true);
      // Intenta conectar al backend local primero
      const response = await axios.get("http://localhost:5000/api/signos-vitales");
      setSignos(response.data || []);
      setSignosFiltrados(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error al cargar signos vitales:", err);
      setError("Error al cargar los datos. Verifica que el backend esté corriendo.");
      setSignos([]);
      setSignosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = (e) => {
    const rut = e.target.value.toLowerCase().trim();
    setFiltroRut(rut);

    if (rut === "") {
      setSignosFiltrados(signos);
    } else {
      const filtered = signos.filter((s) =>
        s.rut && s.rut.toLowerCase().includes(rut)
      );
      setSignosFiltrados(filtered);
    }
  };

  const handleLimpiar = () => {
    setFiltroRut("");
    setSignosFiltrados(signos);
  };

  return (
    <div className="signos-vitales-container">
      {/* Encabezado */}
      <header className="header">
        <img
          src={`${process.env.PUBLIC_URL}/image.png`}
          alt="Logo ELEAM"
          className="logo"
        />
        <h1>Signos Vitales</h1>
      </header>

      {/* Panel de filtros */}
      <section className="filtro-section">
        <h2>Consultar Signos Vitales</h2>
        <div className="filtro-container">
          <input
            type="text"
            placeholder="Filtrar por RUT..."
            value={filtroRut}
            onChange={handleFiltrar}
            className="filtro-input"
          />
          <button onClick={handleLimpiar} className="btn-limpiar">
            Limpiar
          </button>
          <button onClick={cargarTodosLosSignos} className="btn-recargar">
            Recargar
          </button>
        </div>
      </section>

      {/* Contenido */}
      <section className="contenido-section">
        {loading && <div className="cargando">Cargando signos vitales...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="tabla-info">
              <p className="registros-encontrados">
                {signosFiltrados.length} registro(s) encontrado(s)
              </p>
            </div>

            {signosFiltrados.length > 0 ? (
              <div className="tabla-container">
                <table className="tabla-signos">
                  <thead>
                    <tr>
                      <th>RUT</th>
                      <th>Nombre</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Presión Sistólica</th>
                      <th>Presión Diastólica</th>
                      <th>Frecuencia Cardíaca</th>
                      <th>Temperatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signosFiltrados.map((registro, index) => (
                      <tr key={index}>
                        <td>{registro.rut || "-"}</td>
                        <td>{registro.nombre || "-"}</td>
                        <td>{registro.fecha || "-"}</td>
                        <td>{registro.hora || "-"}</td>
                        <td>{registro.presionSistolica || "-"}</td>
                        <td>{registro.presionDiastolica || "-"}</td>
                        <td>{registro.frecuenciaCardiaca || "-"}</td>
                        <td>{registro.temperatura || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !loading && <div className="sin-datos">No hay registros disponibles</div>
            )}
          </>
        )}
      </section>

      {/* Botones de acción */}
      <div className="botones-container">
        <button className="btn-accion btn-salir" onClick={() => navigate("/")}>
          ← Volver al Menú
        </button>
        <button
          className="btn-accion btn-nuevo"
          onClick={() => navigate("/formulario-signos-vitales")}
        >
          + Registrar Nuevo
        </button>
      </div>
    </div>
  );
}
