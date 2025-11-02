import { BrowserRouter, Routes, Route } from "react-router-dom";
import FichaClinica from "./pages/FichaClinica";
import CrearFicha from "./pages/CrearFicha";
import EditarFicha from "./pages/EditarFicha";
import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal del módulo */}
        <Route path="/" element={<FichaClinica />} />

        {/* Crear nueva ficha */}
        <Route path="/ficha/crear" element={<CrearFicha />} />

        {/* Editar ficha existente */}
        <Route path="/ficha/editar" element={<EditarFicha />} />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
