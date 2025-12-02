// src/components/Layout.jsx (MODIFICADO - Sin breadcrumb separado)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AccessibilityButton from './AccessibilityButton';

export default function Layout() {
  return (
    <div>
      <Navbar /> {/* El breadcrumb ahora está integrado en el Navbar */}
      
      <main>
        <Outlet />
      </main>

      <AccessibilityButton />
    </div>
  );
}