import React from "react";
import { useNavigate } from "react-router-dom";
import "../Principal.css";

export default function Principal() { // Componente principal del portal ELEAM
  const navigate = useNavigate(); // Hook para navegar programaticamente

  const personal = [ // Datos ficticios del personal de turno
    { id: 1, nombre: "..... ... ...", cargo: "Enfermera", email: "...@eleam.chile.cl", imagen: "Mujer.png" },
    { id: 2, nombre: "..... ... ...", cargo: "Médico", email: "...@eleam.chile.cl", imagen: "Hombre.png" },
    { id: 3, nombre: "..... ... ...", cargo: "Auxiliar", email: "...@eleam.chile.cl", imagen: "Hombre.png" },
    { id: 4, nombre: "..... ... ...", cargo: "Enfermero", email: "...@eleam.chile.cl", imagen: "Hombre.png" },
    { id: 5, nombre: "..... ... ...", cargo: "Enfermera", email: "...@eleam.chile.cl", imagen: "Mujer.png" },
    { id: 6, nombre: "..... ... ...", cargo: "Auxiliar", email: "...@eleam.chile.cl", imagen: "Mujer.png" },
    { id: 7, nombre: "..... ... ...", cargo: "Médico", email: "...@eleam.chile.cl", imagen: "Hombre.png" },
    { id: 8, nombre: "..... ... ...", cargo: "Médico", email: "...@eleam.chile.cl", imagen: "Mujer.png" },
  ];

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
          {personal.map((p) => (
            <div key={p.id} className="personal-card"> {/* Tarjeta de personal */}
              <img
                src={`${process.env.PUBLIC_URL}/${p.imagen}`}
                alt={p.nombre}
                className="foto-personal"
              />
              <div className="info-personal">
                <p><strong>Nombre:</strong> {p.nombre}</p>
                <p><strong>Funcionario:</strong> {p.cargo}</p>
                <p><strong>Email:</strong> {p.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
