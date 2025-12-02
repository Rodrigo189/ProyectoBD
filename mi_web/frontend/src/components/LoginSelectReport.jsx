import React from "react";
import { useNavigate } from "react-router-dom";
import LoginSelectCore from "./LoginSelectCore";

export default function LoginSelectionReportes() {
    localStorage.clear();
    const navigate = useNavigate();
    const options = [
        { key: "funcionario", label: "FUNCIONARIO", to: "/LoginRyEFuncionario" },
        { key: "administrador", label: "ADMINISTRADOR", to: "/LoginRyEAdministrador" },
    ];

    return (
        <LoginSelectCore
            title="Reportes y Estadísticas"
            description="Seleccione el usuario al que desea ingresar"
            options={options}
            onCancel={() => navigate("/")}
        />
    );
}