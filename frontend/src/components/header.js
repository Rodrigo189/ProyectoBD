import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

export default function Header({ onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (typeof onBack === "function") return onBack();
        // fallback: navegar atrás en historial
        if (window.history.length > 1) navigate(-1);
        else navigate("/");
    };

    return (
        <header className="funcionario-header">
            <div className="funcionario-header-inner">
                <button className="funcionario-back-button" onClick={handleBack} aria-label="Atrás">
                    <span className="funcionario-back-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="funcionario-back-text">ATRÁS</span>
                </button>

                <div className="funcionario-brand" aria-hidden="true">
                    <img src={logo} alt="Red ELEAM" className="funcionario-logo" />
                    <span className="funcionario-brand-text">Red ELEAM</span>
                </div>

                <div className="funcionario-header-spacer" />
            </div>
        </header>
    );
}