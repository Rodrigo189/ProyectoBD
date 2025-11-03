import React from "react";
import { useNavigate } from "react-router-dom";
import "../MenuPrincipal.css";

export default function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div className="menu-principal">
      {/* Fondo izquierda */}
      <div
        className="menu-fondo"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + '/ELEAM.png'})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      ></div>

      {/* Panel derecho */}
      <div className="menu-panel">
        {/* Banner superior con logo */}
        <div className="menu-banner">
          <div className="menu-logo">
            <img src={`${process.env.PUBLIC_URL}/image.png`} alt="Logo" />
          </div>
        </div>

        {/* Texto de bienvenida */}
        <div className="menu-bienvenida">
          <h1>Te damos la bienvenida!</h1>
          <p>Seleccione el módulo al que desea ingresar</p>
        </div>

        {/* Lista de botones */}
        <div className="menu-botones">
          <button onClick={() => navigate("/login-form")}>FICHA CLÍNICA</button>
          <button onClick={() => navigate("/login-form?from=signos")}>SIGNOS VITALES</button>
          <button onClick={() => navigate("/parametros-clinicos")}>PARÁMETROS CLÍNICOS</button>
          <button onClick={() => navigate("/principal")}>GESTIÓN DE PERSONAL</button>
          <button onClick={() => navigate("/login-form")}>MEDICAMENTOS</button>
          <button onClick={() => navigate("/liquidacion-pagos")}>LIQUIDACIÓN Y PAGOS</button>
        </div>
      </div>
    </div>
  );
}
