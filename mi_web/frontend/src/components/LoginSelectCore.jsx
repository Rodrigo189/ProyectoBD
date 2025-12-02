import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SelectLogin.css";
import logo from "../img/logo.png";

export default function LoginSelectionCore({ title = "Red ELEAM", description = "", options = [], onCancel }) {
    const navigate = useNavigate();

    return (
        <div className="login-bg">
            <div className="login-img" />
            <div className="login-panel">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <span className="login-title">Red <b>ELEAM</b></span>
                </div>

                <div className="login-content">
                    <h2 className="login-welcome">{title}</h2>
                    {description && <p className="login-description">{description}</p>}

                    <div className="login-buttons">
                        {options.map((opt) => (
                            <button
                                key={opt.key}
                                className="login-btn"
                                onClick={() => {
                                    if (typeof opt.before === "function") opt.before();
                                    navigate(opt.to);
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <button
                        className="login-back"
                        onClick={() => {
                            if (typeof onCancel === "function") onCancel();
                            else navigate(-1);
                        }}
                    >
                        <span style={{ fontSize: "1.2em", marginRight: "8px" }}>&larr;</span> ATRÁS
                    </button>
                </div>
            </div>
        </div>
    );
}