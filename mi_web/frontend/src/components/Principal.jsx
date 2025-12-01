import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Principal.css";

export default function Principal() { // Componente principal del portal ELEAM
  const navigate = useNavigate(); // Hook para navegar programaticamente
  const [personal, setPersonal] = useState([]); // Estado para almacenar los funcionarios

  // Logica para cargar funcionarios desde el backend
  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const response = await fetch("https://eleam.onrender.com/api/funcionarios");
        const data = await response.json();
        setPersonal(data);
      } catch (error) {
        console.error("Error al cargar funcionarios:", error);
      }
    };

    fetchPersonal();
  }, []);

  return (
    <div className="principal-container">
      {/* Encabezado principal */}
      <header className="principal-header">
        <div className="header-logo">
          <img src={`${process.env.PUBLIC_URL}/image.png`} alt="Logo ELEAM" /> 
        </div>
        <div className="breadcrumbs">
          <span onClick={() => navigate("/")}>Inicio</span> /
          <strong>Personal</strong>
        </div>
        <h1 className="titulo-header">Portal ELEAM</h1>
      </header>

      {/* Sub-header */}
      <div className="sub-header">
        <h2 className="subtitulo">Personal De Turno:</h2>
        <div className="botones-externos">
          <button className="btn-salir" onClick={() => navigate("/")}>
            <span className="flecha">←</span> SALIR
          </button>
          <button className="btn-iniciar" onClick={() => navigate("/login")}>
            INICIAR SESIÓN
          </button>
        </div>
      </div>

      {/* Cuerpo principal */}
      <main className="principal-main">
        <div className="personal-grid">
          {personal.map((p, index) => {
            const imagen = p.cargo.toLowerCase().includes("enfermera") || p.cargo.toLowerCase().includes("auxiliar")
              ? "Mujer.png"
              : "Hombre.png";

            return (
              <div key={index} className="personal-card">
                <img
                  src={`${process.env.PUBLIC_URL}/${imagen}`}
                  alt={`${p.nombres} ${p.apellidos}`}
                  className="foto-personal"
                />
                <div className="info-personal">
                  <p className="info"><u><strong>Nombre:</strong></u></p>
                  <p>{p.nombres.split(" ")[0]} {p.apellidos.split(" ")[0]}</p>
                  <p className="info"><u><strong>Cargo:</strong></u></p>
                  <p>{p.cargo}</p>
                  <p className="info"><u><strong>Email:</strong></u></p>
                  <p>{p.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
