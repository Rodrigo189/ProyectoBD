import React from "react";
import "../styles/FormularioTurno.css"; // Asegúrate que esté en la misma carpeta

export default function FormularioTurno() {
  return (
    <div className="formulario-container">
      {/* Banner */}
      <div className="banner">
        <div className="logo-container">
          <div className="logo-image"
          style={{ backgroundImage: "url('/image.png')" }}></div>
          <div className="red-eleam">Red ELEAM</div>
        </div>
        <div className="portal-title">Portal ELEAM</div>
        <div className="bell-icon"
        style={{ backgroundImage: "url('/campana.png')" }}>
        </div>
      </div>

      {/* Título */}
      <h1 className="titulo-formulario">Nuevo Formulario de Turno</h1>

      {/* Formulario */}
      <div className="form-box">
        <label>Nombre Funcionario*</label>
        <input type="text" placeholder="Ingrese Nombre Funcionario" />

        <label>Email*</label>
        <input type="email" placeholder="Ingrese Email" />

        <label>Hora de Ingreso*</label>
        <input type="time" />

        <label>Fecha de Ingreso*</label>
        <input type="date" />

        <label>Descripción del Turno*</label>
        <textarea placeholder="Ingrese lo realizado en el turno"></textarea>

        <label>Caso S.O.S*</label>
        <input type="checkbox" />

        <label>Descripción Caso S.O.S</label>
        <textarea placeholder="Solo si seleccionó S.O.S"></textarea>

        <button className="enviar-btn">Enviar</button>
      </div>
    </div>
  );
}
