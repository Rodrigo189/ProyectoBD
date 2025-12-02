import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SeleccionUsuario.css";

export default function SeleccionUsuario() {
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
        {/* Logo */}
        <div className="menu-banner">
          <div className="menu-logo">
            <img src={`${process.env.PUBLIC_URL}/image.png`} alt="Logo" />
          </div>
        </div>

        {/* Texto bienvenida */}
        <div className="menu-bienvenida">
          <h1>Te damos la bienvenida!</h1>
          <p>Seleccione el usuario al que desea ingresar</p>
        </div>

        {/* Botones */}
        <div className="menu-botones">
          <button onClick={() => navigate("/principal")}>ADMINISTRADOR</button>
          <button onClick={() => navigate("/principal")}>FUNCIONARIO</button>
        </div>

        {/* Botón atrás */}
        <div className="menu-atras">
          <button className="btn-atras" onClick={() => navigate("/")}>
            ATRÁS
          </button>
        </div>
      </div>
    </div>
  );
}
