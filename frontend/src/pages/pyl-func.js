import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/log-fya.css";
import Header from "../components/header";
import LoginCard from "../components/log-card";

export default function LoginFuncionario() {
    const navigate = useNavigate();
    const goBack = () => { if (window.history.length > 1) window.history.back(); };

    const handleLogin = async ({ run, password }) => {
        // ejemplo: llamar API para validar credenciales
        // const res = await api.loginFuncionario({ run, password });
        // if (res.ok) navigate('/funcionario/home');
        console.log("login funcionario", { run, password });
        navigate("/PerfilFuncionario"); // <--- ruta destino para FUNCIONARIO
    };

    return (
        <div className="login-funcionario-bg">
            <Header onBack={goBack} />
            <main className="funcionario-main">
                <h1 className="funcionario-welcome-text">¡Te damos la bienvenida!</h1>
                <section className="funcionario-form-wrap">
                    <LoginCard
                        title="Ingresa Portal Funcionarios ELEAM"
                        badgeText="Red ELEAM"
                        submitLabel="INGRESAR"
                        onSubmit={handleLogin}
                    />
                </section>
            </main>
        </div>
    );
}