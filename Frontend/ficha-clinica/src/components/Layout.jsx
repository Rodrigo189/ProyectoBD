// src/components/Layout.jsx (Actualizado con Breadcrumbs)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AccessibilityButton from './AccessibilityButton';
import Breadcrumbs from './Breadcrumbs'; // Importamos el componente de breadcrumbs

export default function Layout() {
  return (
    <div>
      <Navbar />
      
      {/* Agregamos los breadcrumbs justo antes del contenido principal */}
      <Breadcrumbs />
      
      <main>
        {/* Aquí se renderizarán tus páginas (BuscarFicha, FichaClinica, etc.) */}
        <Outlet />
      </main>

      <AccessibilityButton />
    </div>
  );
}
