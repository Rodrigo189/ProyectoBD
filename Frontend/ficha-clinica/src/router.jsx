<<<<<<< HEAD
=======
// src/router.jsx (Corregido)
>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- TUS PÁGINAS (desde ./pages/) ---
import MenuPrincipal from "./pages/MenuPrincipal.jsx";
import BuscarFicha from "./pages/BuscarFicha.jsx";
import FichaClinica from "./pages/FichaClinica.jsx";
import CrearFicha from "./pages/CrearFicha.jsx";
import EditarFicha from "./pages/EditarFicha.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import AdminTratantes from "./pages/AdminTratantes.jsx";

<<<<<<< HEAD
// --- COMPONENTES ---
import Layout from "./components/Layout.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
=======
// --- CORRECCIÓN DE RUTAS DE IMPORTACIÓN ---
// Ahora apuntan a la carpeta "./components/"
import Layout from "./components/Layout.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
// --- FIN CORRECCIÓN ---

>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/login" element={<Login />} />
        
<<<<<<< HEAD
        {/* --- RUTAS PROTEGIDAS --- */}
        <Route element={<RutaProtegida />}>
          
=======
        {/* --- RUTAS PROTEGIDAS (Solo para tratantes logueados) --- */}
        <Route element={<RutaProtegida />}>
          
          {/* Usamos el Layout para que todas estas páginas
              tengan el Navbar y el Botón de Accesibilidad */}
>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239
          <Route element={<Layout />}>
            <Route path="/fichas" element={<BuscarFicha />} />
            <Route path="/fichas/:rut" element={<FichaClinica />} />
            <Route path="/fichas/crear" element={<CrearFicha />} />
<<<<<<< HEAD
            
            {/* 🚩 CORRECCIÓN CRÍTICA: La nueva ruta para Editar 🚩 */}
            <Route path="/fichas/:rut/editar" element={<EditarFicha />} />
            
=======
            <Route path="/fichas/editar/:rut" element={<EditarFicha />} />
>>>>>>> b3a7ed7d526daa75e24f663324c83625105ba239
            <Route path="/admin/tratantes" element={<AdminTratantes />} />
          </Route>
          
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}