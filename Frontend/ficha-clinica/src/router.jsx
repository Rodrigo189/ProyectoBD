import { BrowserRouter, Routes, Route } from "react-router-dom";
import BuscarFicha from "./pages/BuscarFicha";
import FichaClinica from "./pages/FichaClinica";
import CrearFicha from "./pages/CrearFicha";
import EditarFicha from "./pages/EditarFicha";
import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal del módulo */}
        <Route path="/" element={<BuscarFicha />} />   {/* ✅ Aquí el cambio */}

        {/* Ver ficha clínica por rut */}
        <Route path="/ficha/:rut" element={<FichaClinica />} />   {/* ✅ Ruta dinámica */}

        {/* Crear nueva ficha */}
        <Route path="/ficha/crear" element={<CrearFicha />} />

        {/* Editar ficha existente */}
        <Route path="/ficha/editar/:rut" element={<EditarFicha />} />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
