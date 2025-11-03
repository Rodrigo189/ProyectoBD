import React from "react";
import "../style/log-fya.css";
import Header from "../components/header";
import LoginCard from "../components/log-card";
import { useNavigate } from "react-router-dom";

export default function LoginAdministrador() {
    const goBack = () => { if (window.history.length > 1) window.history.back(); };
    const navigate = useNavigate();
    const handleLogin = async ({ run, password }) => {
        console.log("login administrador", { run, password });
        navigate("/PerfilAdministrador");
    };

    return (
        <div className="login-funcionario-bg">
            <Header onBack={goBack} />

            <main className="funcionario-main">
                <h1 className="funcionario-welcome-text">¡Te damos la bienvenida!</h1>

                <section className="funcionario-form-wrap">
                    <LoginCard
                        title="Ingresa Portal Administrador ELEAM"
                        badgeText="Red ELEAM"
                        submitLabel="INGRESAR"
                        onSubmit={handleLogin}
                    />
                </section>
            </main>
        </div>
    );
}