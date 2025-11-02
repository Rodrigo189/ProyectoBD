import React from "react";
import LoginSelectionCore from "../components/log-select-core";

export default function LoginSelectionRyE() {
    const options = [
        { key: "funcionario", label: "FUNCIONARIO", to: "/LoginRyEFuncionario" },
        { key: "administrador", label: "ADMINISTRADOR", to: "/LoginRyEAdministrador" },
    ];

    return (
        <LoginSelectionCore
            title="Reportes y Estadísticas"
            description="Seleccione el usuario al que desea ingresar"
            options={options}
        />
    );
}