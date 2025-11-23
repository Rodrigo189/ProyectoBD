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

// --- COMPONENTES ---
import Layout from "./components/Layout.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/login" element={<Login />} />
        
        {/* --- RUTAS PROTEGIDAS --- */}
        <Route element={<RutaProtegida />}>
          
          <Route element={<Layout />}>
            <Route path="/fichas" element={<BuscarFicha />} />
            <Route path="/fichas/:rut" element={<FichaClinica />} />
            <Route path="/fichas/crear" element={<CrearFicha />} />
            
            {/* 🚩 CORRECCIÓN CRÍTICA: La nueva ruta para Editar 🚩 */}
            <Route path="/fichas/:rut/editar" element={<EditarFicha />} />
            
            <Route path="/admin/tratantes" element={<AdminTratantes />} />
          </Route>
          
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}