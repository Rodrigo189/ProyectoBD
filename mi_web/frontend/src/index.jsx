import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./components/Principal";
import LoginFuncionario from "./components/LoginFuncionario";
import LoginForm from "./components/LoginForm";
import DashboardFuncionario from "./components/DashboardFuncionario";
import FormularioTurno from "./components/FormularioTurno";
import Dashboard from "./components/Dashboard";
import FormularioSignosVitales from "./components/FormularioSignosVitales";
import BuscarPaciente from "./components/BuscarPaciente";
import HistorialClinico from "./components/HistorialClinico";
import MenuPrincipal from "./components/MenuPrincipal";
import SeleccionUsuario from "./components/SeleccionUsuario";
import InfoMedicamentos from "./components/InfoMedicamentos";
import FichaClinica from "./pages/FichaClinica";
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

import "@fontsource/inria-sans";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/login" element={<LoginFuncionario />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-funcionario" element={<DashboardFuncionario />} />
        <Route path="/formulario" element={<FormularioTurno />} />
        <Route path="/buscar-paciente" element={<BuscarPaciente />} />
        <Route path="/historial-clinico/:rut" element={<HistorialClinico />} />
        <Route path="/formulario-signos-vitales/:rut" element={<FormularioSignosVitales />} />
        <Route path="/seleccion-usuario" element={<SeleccionUsuario />} />
        <Route path="/medicamentos/:rut" element={<InfoMedicamentos />} />
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
