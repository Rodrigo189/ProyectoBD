// src/components/Navbar.jsx (COMPLETO)
import React from 'react';
import "../assets/styles/Navbar.css";
import logo from "../assets/images/logo-eleam.png"; 
import Breadcrumbs from './Breadcrumbs';

export default function Navbar({ titulo = "Ficha Clínica ELEAM" }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo ELEAM" className="navbar-logo" />
        <h1 className="navbar-title">{titulo}</h1>
        
        <div className="navbar-breadcrumb-inline">
          <Breadcrumbs />
        </div>
      </div>

      <div className="navbar-links">
        <a href="/menu" className="nav-link">Menú Principal</a>
        <a href="/fichas" className="nav-link">Buscar Ficha</a>
        <a href="/fichas/crear" className="btn-nav">Nueva Ficha</a>
      </div>
    </nav>
  );
}