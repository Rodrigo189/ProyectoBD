import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css"
import "@fontsource/inria-sans";

export default function LoginForm() {
  const [rut, setRut] = useState("");
  const [fecha, setFecha] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://127.0.0.1:5000/api/residentes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, fecha }),
    });

    if (!response.ok) {
      console.error("Error en la respuesta del servidor");
      return;
    }

    navigate(`/dashboard?rut=${rut}`);
  } catch (error) {
    console.error("Error enviando datos:", error);
  }
};

return (
  <div> {/* contenedor principal */}
    <header className="banner">
      <div className="logo-container">
        <div
          className="logo"
          style={{ backgroundImage: "url('/image.png')" }}
        ></div>
      </div>
    </header>

    <h2 className="bienvenida">¡Te damos la bienvenida!</h2>

    <div className="login-box">
      <h3 className="title">Portal Residentes</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingrese RUN del residente"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <button type="submit" >Ingresar</button>
      </form>
    </div>
  </div>
);
}
