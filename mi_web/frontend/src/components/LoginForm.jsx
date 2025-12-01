import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "../styles/styles.css"
import "@fontsource/inria-sans";

export default function LoginForm() { 
  const [rut, setRut] = useState(""); 
  const [error, setError] = useState(""); // 1. Nuevo estado para el error visual
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError(""); // Limpiar error anterior al intentar de nuevo

    try { 
      const response = await fetch("https://eleam.onrender.com/api/residentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut }),
      });

      const data = await response.json(); 

      if (response.ok && data.existe) { 
        navigate(`/dashboard?rut=${rut}`);
      } else { 
        // 2. En lugar de alert, guardamos el mensaje en el estado
        setError("Residente no encontrado o datos incorrectos");
      }
    } catch (error) { 
      console.error("Error enviando datos:", error);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div> 
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

        <form onSubmit={handleSubmit}> 
          <input
            type="text"
            placeholder="Ingrese RUN del residente"
            value={rut}
            onChange={(e) => {
                setRut(e.target.value);
                setError(""); // Limpiar error cuando el usuario escriba
            }}
            className={error ? "input-error" : ""} // Opcional: clase para borde rojo
            required
          />
          
          {/* 3. Aquí mostramos el mensaje de error si existe */}
          {error && <p style={{ color: "red", fontSize: "0.9rem", marginTop: "10px", fontWeight: "bold" }}>⚠ {error}</p>}

          <button type="submit" >Ingresar</button>
        </form>
      </div>
    </div>
  );
}