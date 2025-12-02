import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginFyA.css";
import Header from "./Header";
import LoginCard from "./LoginCard";

export default function LoginReportesFuncionario() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const goBack = () => { if (window.history.length > 1) window.history.back(); };
    localStorage.clear();
    const handleLogin = async ({ run, password }) => {
        setError("");
        try {
            const r = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rut: run, password, roleArea: "funcionario" })
            });
            const res = await r.json().catch(() => ({}));
            if (r.status === 404){
                setError("Not found");
                return;
            }
            if (r.status === 401){
                setError("No autorizado: contraseña incorrecta");
                return;
            }
            if (r.status === 400){
                setError("No autorizado: faltan datos");
                return;
            }
            if (r.status === 403 && res?.error === "wrong_role") {
                setError("No autorizado: tu cuenta no es Funcionario.");
                return;
            }
            
            localStorage.setItem("token", res.token);
            localStorage.setItem("currentUserId", res.user.rut || res.user.id);
            localStorage.setItem("currentUserRole", res.user.role);
            navigate("/FuncionarioDashboard");
        } catch (e) {
            setError("Credenciales inválidas");
        }
    };

    return (
        <div className="login-funcionario-bg">
            <Header onBack={goBack} />
            <main className="funcionario-main">
                <h1 className="funcionario-welcome-text">¡Te damos la bienvenida!</h1>
                <section className="funcionario-form-wrap">
                    <LoginCard
                        title="Ingreso al portal Funcionarios ELEAM"
                        badgeText="Red ELEAM"
                        submitLabel="INGRESAR"
                        onSubmit={handleLogin}
                    />
                </section>
                {error && <div style={{ color: "#b00020", marginTop: 12 }}>{error}</div>}
            </main>
        </div>
    );
}