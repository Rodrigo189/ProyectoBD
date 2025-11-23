// src/pages/MenuPrincipal.jsx (Completo y Corregido)
import React from "react";
import { useNavigate } from "react-router-dom";
// Asumiendo que tienes este archivo en assets/styles/
import "../assets/styles/MenuPrincipal.css"; 

export default function MenuPrincipal() {
  const navigate = useNavigate();

  // Función de Cierre de Sesión
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="menu-principal">
      {/* Fondo izquierda */}
      <div
        className="menu-fondo"
        style={{
          // Asegúrate de que /ELEAM.png esté en la carpeta public/
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
             {/* Asegúrate de que /image.png esté en la carpeta public/ */}
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
          {/* Ficha Clínica (navega al buscador) */}
          <button onClick={() => navigate("/fichas")}>FICHA CLÍNICA</button>
          
          {/* Administración de Tratantes */}
          <button onClick={() => navigate("/admin/tratantes")}>ADMINISTRAR TRATANTES</button>
          
          {/* Botones deshabilitados */}
          <button onClick={() => alert("Módulo no implementado")} disabled style={{opacity: 0.5}}>SIGNOS VITALES</button>
          <button onClick={() => alert("Módulo no implementado")} disabled style={{opacity: 0.5}}>PARÁMETROS CLÍNICOS</button>
          <button onClick={() => alert("Módulo no implementado")} disabled style={{opacity: 0.5}}>GESTIÓN DE PERSONAL</button>
          <button onClick={() => alert("Módulo no implementado")} disabled style={{opacity: 0.5}}>LIQUIDACIÓN Y PAGOS</button>
        </div>
        
        <div className="menu-logout">
             <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}