import React, { useState } from "react";

export default function LoginCard({
    title = "Ingresa Portal",
    badgeText = "Red ELEAM",
    submitLabel = "INGRESAR",
    onSubmit: submitProp,
}) {
    const [run, setRun] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof submitProp === "function") submitProp({ run, password });
        else console.log("submit", { run, password });
    };

    return (
        <article className="funcionario-login-card">
            <div className="funcionario-badge">
                <div className="funcionario-badge-bar" />
                <div className="funcionario-badge-text">{badgeText}</div>
            </div>

            <h2 className="funcionario-form-title">
                <span>{title}</span>
            </h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="INGRESA TU RUN"
                    value={run}
                    onChange={(e) => setRun(e.target.value)}
                    className="funcionario-login-input"
                    aria-label="RUN"
                />

                <div className="funcionario-password-row">
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="INGRESA TU CLAVE"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="funcionario-login-input"
                        aria-label="Clave"
                    />
                    <button
                        type="button"
                        className="funcionario-eye-btn"
                        onClick={() => setShowPass((s) => !s)}
                        aria-label={showPass ? "Ocultar clave" : "Mostrar clave"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12Z" stroke="white" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" fill="white" />
                        </svg>
                    </button>
                </div>

                <button type="submit" className="funcionario-login-btn">
                    {submitLabel}
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: 8 }}>
                        <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </form>
        </article >
    );
}