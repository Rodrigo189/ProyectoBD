import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/log-fya.css";
import Header from "../components/header";
import LoginCard from "../components/log-card";

export default function LoginReportesAdministrador() {
    const navigate = useNavigate();
    const goBack = () => { if (window.history.length > 1) window.history.back(); };

    const handleLogin = async ({ run, password }) => {
        // validar credenciales si corresponde (API)
        console.log("login reportes - administrador", { run, password });
        // después de login ir a la vista de estadísticas para administradores
        navigate("/AdministradorDashboard");
    };

    return (
        <div className="login-funcionario-bg">
            <Header onBack={goBack} />
            <main className="funcionario-main">
                <h1 className="funcionario-welcome-text">!Te damos la bienvenida!</h1>
                <section className="funcionario-form-wrap">
                    <LoginCard
                        title="Ingreso al portal Administradores ELEAM"
                        badgeText="Red ELEAM"
                        submitLabel="INGRESAR"
                        onSubmit={handleLogin}
                    />
                </section>
            </main>
        </div>
    );
}