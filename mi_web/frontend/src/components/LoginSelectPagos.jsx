import React from "react";
import { useNavigate } from "react-router-dom";
import LoginSelectCore from "./LoginSelectCore";

export default function LoginSelectionPagos() {
    localStorage.clear();
    const navigate = useNavigate();
    const options = [
        { key: "funcionario", label: "FUNCIONARIO", to: "/LoginPyLFuncionario" },
        { key: "administrador", label: "ADMINISTRADOR", to: "/LoginPyLAdministrador" },
    ];

    return (
        <LoginSelectCore
            title="Pagos y Liquidaciones"
            description="Seleccione el usuario al que desea ingresar"
            options={options}
            onCancel={() => navigate("/")}
        />
    );
}