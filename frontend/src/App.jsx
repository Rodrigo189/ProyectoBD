import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginGeneral />} />
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

        {/*
          Ahora estas rutas aceptan id opcional para abrir vistas por usuario.
          Si no hay id (o navegas desde admin root), siguen funcionando.
        */}
        <Route path="/Estadisticas/:id?" element={<Estadisticas />} />
        <Route path="/Probabilidades/:id?" element={<Probabilidades />} />
        <Route path="/AnalisisRiesgo/:id?" element={<AnalisisRiesgo />} />

        {/* Puedes mantener id? aquí; la vista ignora el id si llega */}
        <Route path="/EstadisticasSistema/:id?" element={<EstadisticasSistema />} />
        <Route path="/AdministradorDashboard/:id?" element={<AdministradorDashboard />} />
        <Route path="/ListaFuncionarioRyE" element={<ListaFuncionarioRyE />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;