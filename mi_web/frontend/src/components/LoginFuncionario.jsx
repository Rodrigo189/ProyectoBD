import { useState } from "react";
import "@fontsource/inria-sans";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function LoginFuncionario() {
  const [rut, setRut] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    
    try {
      console.log("Enviando datos:", { rut, clave }); // Debug
      
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut, clave }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data); // Debug

      if (!response.ok) {
        setMensaje(data.mensaje || "Contraseña o RUT incorrecto");
        return;
      }

      setMensaje("¡Inicio de sesión exitoso!");
      setTimeout(() => {
        navigate("/dashboard-funcionario");
      }, 1000);
    } catch (error) {
      console.error("Error en login:", error); // Debug
      setMensaje("Error de conexión. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="vista2-container">
      <div className="banner">
        <div className="logo" style={{ backgroundImage: "url('/image.png')" }}></div>
        <div className="red-eleam"></div>
      </div>

      <div className="bienvenida">Te damos la bienvenida!</div>

      <div className="login-box">
        <div className="login-titulo">Ingresa Portal ELEAM</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ingresa tu RUN"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />

          <div className="password-container">
          <input
            type={mostrarClave ? "text" : "password"}
            placeholder="Ingresa tu Clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          <span
            className="password-toggle"
            onClick={() => setMostrarClave(!mostrarClave)}
            title={mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarClave ? "🙈" : "👁️"}
          </span>
        </div>


          <button type="submit" className="btn-ingresar">Ingresar</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}
