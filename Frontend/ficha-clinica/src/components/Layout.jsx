<<<<<<< HEAD
// src/components/Layout.jsx (Actualizado con Breadcrumbs)
=======
// src/components/Layout.jsx (NUEVO)
>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AccessibilityButton from './AccessibilityButton';
<<<<<<< HEAD
import Breadcrumbs from './Breadcrumbs'; // Importamos el componente de breadcrumbs
=======
>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239

export default function Layout() {
  return (
    <div>
      <Navbar />
<<<<<<< HEAD
      
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
=======
      <main>
        {/* Aquí se renderizarán tus páginas (BuscarFicha, FichaClinica, etc.) */}
        <Outlet /> 
      </main>
      <AccessibilityButton />
    </div>
  );
}
>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239
