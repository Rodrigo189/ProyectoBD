// src/components/Layout.jsx (NUEVO)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AccessibilityButton from './AccessibilityButton';

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        {/* Aquí se renderizarán tus páginas (BuscarFicha, FichaClinica, etc.) */}
        <Outlet /> 
      </main>
      <AccessibilityButton />
    </div>
  );
}