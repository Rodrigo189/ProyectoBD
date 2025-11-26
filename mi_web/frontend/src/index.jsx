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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
