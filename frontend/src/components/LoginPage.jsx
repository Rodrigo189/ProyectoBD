import React from "react";
import "../styles/LoginGeneral.css";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";

function LoginGeneral() {
    const navigate = useNavigate();
    localStorage.clear();
    return (
        <div className="login-bg">
            <div className="login-img"></div>
            <div className="login-panel">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <span className="login-title">Red <b>ELEAM</b></span>
                </div>

                <div className="login-content">
                    <h2 className="login-welcome">¡Te damos la bienvenida!</h2>
                    <p className="login-description">Seleccione el módulo al que desea ingresar</p>

                    <div className="login-buttons">
                        <button className="login-btn">FICHA CLÍNICA</button>
                        <button className="login-btn">SIGNOS VITALES</button>
                        <button className="login-btn">PARÁMETROS CLÍNICOS</button>
                        <button className="login-btn">GESTIÓN DE PERSONAL</button>
                        <button className="login-btn">MEDICAMENTOS</button>
                        <button className="login-btn" onClick={() => navigate("/LoginSelectionLyP")}>PAGOS Y LIQUIDACIONES</button>
                        <button className="login-btn" onClick={() => navigate("/LoginSelectionRyE")}>REPORTES Y ESTADÍSTICAS</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginGeneral;
