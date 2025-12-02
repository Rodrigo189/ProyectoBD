import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- COMPONENTES ORIGINALES ---
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Principal from "./components/Principal";
import LoginFuncionario from "./components/LoginFuncionario";
import DashboardFuncionario from "./components/DashboardFuncionario";
import FormularioTurno from "./components/FormularioTurno";
import MenuPrincipal from "./components/MenuPrincipal";          // tu menú original
import InfoMedicamentos from "./components/InfoMedicamentos";
import HistorialClinico from "./components/HistorialClinico";
import HistorialDetallado from "./components/HistorialDetallado";
import FichaClinica from "./components/FichaClinica";            // ficha clínica antigua
import ConsultaSignosVitales from "./components/ConsultaSignosVitales";
import BusquedaPaciente from "./components/BusquedaPaciente";
import LoginGeneral from "./components/LoginPage";
import LoginSelectionLyP from "./components/LoginSelectPagos";
import LoginSelectionRyE from "./components/LoginSelectReport";
import LoginPyLFuncionario from "./components/LoginPagosFuncionario";
import LoginPyLAdministrador from "./components/LoginPagosAdmin";
import PerfilFuncionario from "./components/FuncionarioProfile";
import PerfilAdministrador from "./components/AdminProfile";
import ListaFuncionario from "./components/FuncionariosList";
import SubPerfilFuncionario from "./components/SubFuncionario";
import LoginRyEFuncionario from "./components/LoginReportFuncionario";
import LoginRyEAdministrador from "./components/LoginReportAdmin";
import FuncionarioDashboard from "./components/FuncionarioDashboard";
import Estadisticas from "./components/EstadisticasPage";
import Probabilidades from "./components/ProbabilidadesPage";
import AnalisisRiesgo from "./components/RiesgosPage";
import EstadisticasSistema from "./components/SistemaPage";
import AdministradorDashboard from "./components/AdminDashboard";
import ListaFuncionarioRyE from "./components/AdminFuncionariosList";
import Layout from "./components/Layout.jsx";

// --- PÁGINAS DEL GRUPO FICHA CLÍNICA ---
import MenuFichas from "./pages/MenuPrincipal.jsx";       // menú del módulo de fichas
import BuscarFicha from "./pages/BuscarFicha.jsx";
import FichaClinicaPage from "./pages/FichaClinica.jsx";  // ficha del grupo (ruta /fichas/:rut)
import CrearFicha from "./pages/CrearFicha.jsx";
import EditarFicha from "./pages/EditarFicha.jsx";
import NotFound from "./pages/NotFound.jsx";

import "@fontsource/inria-sans";

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------------- RUTAS ORIGINALES ---------------- */}

        {/* Si quieres mantener tu menú principal clásico en "/" */}
        <Route path="/" element={<MenuPrincipal />} />

        <Route path="/principal" element={<Principal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginFuncionario />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/formulario" element={<FormularioTurno />} />
        <Route path="/dashboard-funcionario" element={<DashboardFuncionario />} />
        <Route path="/medicamentos/:rut" element={<InfoMedicamentos />} />
        {/* Ficha clínica de tu módulo antiguo */}
        <Route path="/ficha-clinica/:rut" element={<FichaClinica />} />
        <Route path="/historial-clinico/:rut" element={<HistorialClinico />} />
        <Route path="/historial-detallado/:rut" element={<HistorialDetallado />} />
        <Route path="/signos-vitales/:rut" element={<ConsultaSignosVitales />} />
        <Route path="/signos-vitales" element={<ConsultaSignosVitales />} />
        <Route path="/buscar-paciente" element={<BusquedaPaciente />} />

        {/* Módulo de Pagos y Reportes */}
        <Route path="/LoginSelectionLyP" element={<LoginSelectionLyP />} />
        <Route path="/LoginSelectionRyE" element={<LoginSelectionRyE />} />
        <Route path="/FuncionarioDashboard" element={<FuncionarioDashboard />} />
        <Route path="/LoginPyLFuncionario" element={<LoginPyLFuncionario />} />
        <Route path="/LoginPyLAdministrador" element={<LoginPyLAdministrador />} />
        <Route path="/LoginRyEFuncionario" element={<LoginRyEFuncionario />} />
        <Route path="/LoginRyEAdministrador" element={<LoginRyEAdministrador />} />
        <Route path="/PerfilFuncionario" element={<PerfilFuncionario />} />
        <Route path="/PerfilAdministrador" element={<PerfilAdministrador />} />
        <Route path="/ListaFuncionario" element={<ListaFuncionario />} />
        <Route path="/funcionarios/:id" element={<SubPerfilFuncionario />} />
        <Route path="/Estadisticas/:id?" element={<Estadisticas />} />
        <Route path="/Probabilidades/:id?" element={<Probabilidades />} />
        <Route path="/AnalisisRiesgo/:id?" element={<AnalisisRiesgo />} />
        <Route path="/EstadisticasSistema/:id?" element={<EstadisticasSistema />} />
        <Route path="/AdministradorDashboard/:id?" element={<AdministradorDashboard />} />
        <Route path="/ListaFuncionarioRyE" element={<ListaFuncionarioRyE />} />

        {/* ---------------- RUTAS DEL MÓDULO FICHAS CLÍNICAS (GRUPO) ---------------- */}

        {/* Rutas con Layout del grupo */}
        <Route element={<Layout />}>
          <Route path="/fichas" element={<BuscarFicha />} />
          <Route path="/fichas/crear" element={<CrearFicha />} />
          <Route path="/fichas/:rut" element={<FichaClinicaPage />} />
          <Route path="/fichas/:rut/editar" element={<EditarFicha />} />
        </Route>

        {/* ---------------- 404 (para cualquier ruta que no exista) ---------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
