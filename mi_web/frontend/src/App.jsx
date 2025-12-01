import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Principal from "./components/Principal";
import LoginFuncionario from "./components/LoginFuncionario";
import DashboardFuncionario from "./components/DashboardFuncionario";
import FormularioTurno from "./components/FormularioTurno";
import MenuPrincipal from "./components/MenuPrincipal";
import InfoMedicamentos from "./components/InfoMedicamentos";
import SignosVitalesDirecto from "./components/SignosVitalesDirecto";
import HistorialClinico from "./components/HistorialClinico"

import "@fontsource/inria-sans";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginFuncionario />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/formulario" element={<FormularioTurno />} />
        <Route path="/dashboard-funcionario" element={<DashboardFuncionario />} />
        <Route path="/medicamentos/:rut" element={<InfoMedicamentos />} />
        <Route path="/historial-clinico/:rut" element={<HistorialClinico />} />
        <Route path="/signos-vitales" element={<SignosVitalesDirecto />} />
      </Routes>
    </Router>
  );
}

export default App;
