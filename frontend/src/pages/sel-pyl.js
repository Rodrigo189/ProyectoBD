import React from "react";
import LoginSelectionCore from "../components/log-select-core";

export default function LoginSelectionLyP() {
    const options = [
        { key: "funcionario", label: "FUNCIONARIO", to: "/LoginPyLFuncionario" },
        { key: "administrador", label: "ADMINISTRADOR", to: "/LoginPyLAdministrador" },
    ];

    return (
        <LoginSelectionCore
            title="Pagos y Liquidaciones"
            description="Seleccione el usuario al que desea ingresar"
            options={options}
        />
    );
}