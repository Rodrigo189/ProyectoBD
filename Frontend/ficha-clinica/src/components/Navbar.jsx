// src/components/Navbar.jsx (MODIFICADO)
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import "../assets/styles/Navbar.css";
import logo from "../assets/images/logo-eleam.png";

export default function Navbar({ titulo = "Ficha Clínica ELEAM" }) {
  const navigate = useNavigate(); // Hook para navegar

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem('usuario'); // Borramos el login falso
      navigate('/'); // Enviamos al Menú Principal
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo ELEAM" className="navbar-logo" />
        <h1 className="navbar-title">{titulo}</h1>
      </div>

      <div className="navbar-links">
        <a href="/" className="nav-link">Menú Principal</a>
        
        {/* Enlace al buscador de fichas */}
        <a href="/fichas" className="nav-link">Buscar Ficha</a>
        
        {/* Enlace a "Nueva Ficha" */}
        <a href="/fichas/crear" className="btn-nav">Nueva Ficha</a>
        
        {/* Botón de Logout */}
        <button onClick={handleLogout} className="btn-nav-logout">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}