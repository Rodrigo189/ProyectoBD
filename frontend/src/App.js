import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginGeneral from "./pages/login";
import LoginSelectionLyP from "./pages/sel-pyl";
import LoginSelectionRyE from "./pages/sel-rye";
import LoginPyLFuncionario from "./pages/pyl-func";
import LoginPyLAdministrador from "./pages/pyl-admin";
import PerfilFuncionario from "./pages/pfunc";
import PerfilAdministrador from "./pages/padmin";
import ListaFuncionario from "./pages/funlist";
import SubPerfilFuncionario from "./pages/sub-func";
import LoginRyEFuncionario from "./pages/rye-func";
import LoginRyEAdministrador from "./pages/rye-admin";
import FuncionarioDashboard from "./pages/fundash";
import Estadisticas from "./pages/stats";
import Probabilidades from "./pages/prob";
import AnalisisRiesgo from "./pages/risk";
import EstadisticasSistema from "./pages/sis";
import AdministradorDashboard from "./pages/admindash";
import ListaFuncionarioRyE from "./pages/adminlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginGeneral />} />
        <Route path="/LoginSelectionLyP" element={<LoginSelectionLyP />} />
        <Route path="/FuncionarioDashboard" element={<FuncionarioDashboard />} />
        <Route path="/LoginSelectionRyE" element={<LoginSelectionRyE />} />
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