import { useState } from "react"; // Hook para manejar el estado
import { useNavigate } from "react-router-dom"; // Hook para navegar programaticamente
import "../styles.css"
import "@fontsource/inria-sans";

export default function LoginForm() { // Componente del formulario de login
  const [rut, setRut] = useState(""); // Estado para el RUT ingresado
  const navigate = useNavigate(); // Hook para navegar programaticamente

const handleSubmit = async (e) => { // Funcion para manejar el envio del formulario
  e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  try { // Manejar errores con try-catch
    const response = await fetch("https://eleam.onrender.com/api/residentes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut }),
    });

    const data = await response.json(); // Parsear la respuesta JSON

    if (response.ok && data.existe) { // Si la respuesta es OK y el residente existe
      navigate(`/dashboard?rut=${rut}`);
    } else { // Si el residente no existe o hay un error
      alert("Residente no encontrado o datos incorrectos");
    }
  } catch (error) { // Manejar errores de conexion
    console.error("Error enviando datos:", error);
    alert("Error de conexión con el servidor");
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
        <div className ="breadcrumbs">
          <span onClick={() => navigate("/")}>Inicio</span> /
          <strong> Informacion Residente</strong>
      </div>
    </div>
    </header>

    <h2 className="bienvenida">¡Te damos la bienvenida!</h2>

    <div className="login-box">
      <h3 className="title">Portal Residentes</h3>

      <form onSubmit={handleSubmit}> {/* Formulario de login */}
        <input
          type="text"
          placeholder="Ingrese RUN del residente"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        />
        <button type="submit" >Ingresar</button>
      </form>
    </div>
  </div>
);
}
