// src/pages/MenuPrincipal.jsx (SIN TRATANTES)
import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/MenuPrincipal.css"; 

export default function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div className="menu-principal">
      <div className="menu-fondo" style={{
          backgroundImage: `url(/ELEAM.png)`, 
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      ></div>

      <div className="menu-panel">
        <div className="menu-banner">
          <div className="menu-logo">
            <img src="/image.png" alt="Logo" />
          </div>
        </div>

        <div className="menu-bienvenida">
          <h1>Te damos la bienvenida!</h1>
          <p>Sistema de Gestión de Fichas Clínicas</p>
        </div>

        <div className="menu-botones">
          {/* Único botón funcional por ahora */}
          <button onClick={() => navigate("/fichas")}>FICHA CLÍNICA</button>
          
          {/* Botones futuros (deshabilitados) */}
          <button onClick={() => {}} disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>SIGNOS VITALES</button>
          <button onClick={() => {}} disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>PARÁMETROS CLÍNICOS</button>
          <button onClick={() => {}} disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>GESTIÓN DE PERSONAL</button>
          <button onClick={() => {}} disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>LIQUIDACIÓN Y PAGOS</button>
        </div>
      </div>
    </div>
  );
}