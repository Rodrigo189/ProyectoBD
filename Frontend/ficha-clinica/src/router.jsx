// src/router.jsx (VERSIÓN FINAL: Solo Fichas Clínicas)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

// Importación de Páginas
import MenuPrincipal from "./pages/MenuPrincipal.jsx";
import BuscarFicha from "./pages/BuscarFicha.jsx";
import FichaClinica from "./pages/FichaClinica.jsx";
import CrearFicha from "./pages/CrearFicha.jsx";
import EditarFicha from "./pages/EditarFicha.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* REDIRECCIÓN INICIAL: */}
        {/* Al entrar a la web, vamos directo al Menú Principal (sin login) */}
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/login" element={<Navigate to="/menu" replace />} />
        
        {/* MENÚ PRINCIPAL (Pantalla completa) */}
        <Route path="/menu" element={<MenuPrincipal />} />

        {/* RUTAS DEL SISTEMA (Con Barra de Navegación) */}
        <Route element={<Layout />}>
            <Route path="/fichas" element={<BuscarFicha />} />
            <Route path="/fichas/crear" element={<CrearFicha />} />
            <Route path="/fichas/:rut" element={<FichaClinica />} />
            <Route path="/fichas/:rut/editar" element={<EditarFicha />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}