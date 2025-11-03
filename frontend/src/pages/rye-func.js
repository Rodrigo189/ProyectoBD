import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/log-fya.css";
import Header from "../components/header";
import LoginCard from "../components/log-card";

export default function LoginReportesFuncionario() {
    const navigate = useNavigate();
    const goBack = () => { if (window.history.length > 1) window.history.back(); };

    const handleLogin = async ({ run, password }) => {
        // ...validación mock...
        // Guarda el usuario actual (FUNCIONARIO)
        localStorage.setItem("currentUserId", "2");       // usa el id real si lo tienes
        localStorage.setItem("currentUserRole", "funcionario");
        navigate("/FuncionarioDashboard");                // el dashboard usará currentUserId
    };

    return (
        <div className="login-funcionario-bg">
            <Header onBack={goBack} />
            <main className="funcionario-main">
                <h1 className="funcionario-welcome-text">!Te damos la bienvenida!</h1>
                <section className="funcionario-form-wrap">
                    <LoginCard
                        title="Ingreso al portal Funcionarios ELEAM"
                        badgeText="Red ELEAM"
                        submitLabel="INGRESAR"
                        onSubmit={handleLogin}
                    />
                </section>
            </main>
        </div>
    );
}