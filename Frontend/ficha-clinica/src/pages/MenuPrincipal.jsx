// src/pages/MenuPrincipal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// 1. Importa el CSS desde tu carpeta de assets
import "../assets/styles/MenuPrincipal.css"; 

export default function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div className="menu-principal">
      {/* Fondo izquierda */}
      <div
        className="menu-fondo"
        style={{
          // Asumiendo que tienes una imagen 'ELEAM.png' en 'public/'
          backgroundImage: `url(/ELEAM.png)`, 
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      ></div>

      {/* Panel derecho */}
      <div className="menu-panel">
        {/* Banner superior con logo */}
        <div className="menu-banner">
          <div className="menu-logo">
             {/* Asumiendo que tienes 'image.png' en 'public/' */}
            <img src="/image.png" alt="Logo" />
          </div>
        </div>

        {/* Texto de bienvenida */}
        <div className="menu-bienvenida">
          <h1>Te damos la bienvenida!</h1>
          <p>Seleccione el módulo al que desea ingresar</p>
        </div>

        {/* Lista de botones */}
        <div className="menu-botones">
          {/* 2. Botón "FICHA CLÍNICA" corregido */}
          <button onClick={() => navigate("/fichas")}>FICHA CLÍNICA</button>
          
          {/* 3. Resto de botones deshabilitados */}
          <button onClick={() => navigate("#")} disabled style={{opacity: 0.5}}>SIGNOS VITALES</button>
          <button onClick={() => navigate("#")} disabled style={{opacity: 0.5}}>PARÁMETROS CLÍNICOS</button>
          <button onClick={() => navigate("#")} disabled style={{opacity: 0.5}}>GESTIÓN DE PERSONAL</button>
          <button onClick={() => navigate("#")} disabled style={{opacity: 0.5}}>MEDICAMENTOS</button>
          <button onClick={() => navigate("#")} disabled style={{opacity: 0.5}}>LIQUIDACIÓN Y PAGOS</button>
        </div>
      </div>
    </div>
  );
}