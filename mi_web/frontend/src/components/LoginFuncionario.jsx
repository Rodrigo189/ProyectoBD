import { useState } from "react";
import "@fontsource/inria-sans";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function LoginFuncionario() { // Componente del formulario de login
  const [rut, setRut] = useState(""); // Estado para el RUT ingresado
  const [clave, setClave] = useState(""); // Estado para la clave ingresada
  const [mostrarClave, setMostrarClave] = useState(false); // Estado para mostrar/ocultar la clave
  const [mensaje, setMensaje] = useState(""); // Estado para mensajes de error o exito
  const navigate = useNavigate(); // Hook para navegar programaticamente

  const handleSubmit = async (e) => { // Funcion para manejar el envio del formulario
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    try { // Manejar errores con try-catch
      const response = await fetch("http://127.0.0.1:5000/api/login", { // Llamada a la API de login
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ rut, clave }), // Enviar RUT y clave en el cuerpo de la solicitud
      });

      if (!response.ok) { // Si la respuesta no es OK, mostrar mensaje de error
        setMensaje("Contraseña o RUT incorrecto");
        return;
      }

      setMensaje("Datos enviados correctamente!"); 
      navigate("/dashboard-funcionario"); 
    } catch (error) { // Manejar errores de conexion
      setMensaje("Ocurrió un error al enviar los datos");
    }
  };

  return (
      <div className="vista2-container">

      <header className="banner">
        <div className="header-left">
          <div className="logo" style={{ backgroundImage: "url('/image.png')" }}></div>

          <div className="breadcrumbs">
            <span onClick={() => navigate("/")}>Inicio</span> /
            <span onClick={() => navigate("/principal")}> Personal </span> /
            <strong> Login Administrador</strong>
          </div>
        </div>
      </header>

      <div className="bienvenida">Te damos la bienvenida!</div>  

      <div className="login-box"> 
        <div className="login-titulo">Ingresa Portal ELEAM</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ingresa tu RUN"
            value={rut} // Estado del RUT ingresado
            onChange={(e) => setRut(e.target.value) // Actualizar estado al cambiar el input
              }/>

          <div className="password-container">
          <input 
            type={mostrarClave ? "text" : "password"} // Cambiar tipo segun si se muestra o no la clave
            placeholder="Ingresa tu Clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)} // Actualizar estado al cambiar el input
          />
          <span // Icono para mostrar/ocultar la clave
            className="password-toggle"
            onClick={() => setMostrarClave(!mostrarClave)} // Alternar estado de mostrarClave
            title={mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarClave ? "🙈" : "👁️"} 
          </span>
        </div>


          <button type="submit" className="btn-ingresar">Ingresar</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>} {/* Mostrar mensaje si existe*/}
      </div>
    </div>
  );
}
