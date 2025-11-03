import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles.css"
import "@fontsource/inria-sans";

export default function LoginForm() {
  const [rut, setRut] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const rutFormateado = rut.replace(/[^0-9kK-]/g, '');
      console.log('Enviando datos:', { rutFormateado, fecha }); // Debug
      
      const response = await fetch(`http://localhost:5000/api/residentes/${rutFormateado}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      console.log('Status:', response.status); // Debug
      console.log('Headers:', [...response.headers.entries()]); // Debug
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Debug
      
      if (!response.ok) {
        throw new Error(data.mensaje || `Error del servidor: ${response.status}`);
      }

      if (!response.ok) {
        setError("Residente no encontrado");
        return;
      }

      // Convertir la fecha ingresada al formato YYYY-MM-DD
      const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
      console.log('Fecha ingresada:', fecha);
      console.log('Fecha formateada:', fechaFormateada);
      console.log('Fecha en BD:', data.fecha_nacimiento);
      
      // Verificar que la fecha coincida
      if (data.fecha_nacimiento === fechaFormateada) {
        navigate(`/dashboard?rut=${rut}`);
      } else {
        setError("La fecha de nacimiento no coincide");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al verificar los datos");
    }
  };

  const formatRut = (value) => {
    // Elimina cualquier carácter que no sea número o K
    let cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Asegura que tenga el formato correcto (11111111-1)
    if (cleaned.length > 1) {
      cleaned = cleaned.slice(0, -1) + '-' + cleaned.slice(-1);
    }
    
    console.log('RUT formateado:', cleaned); // Debug
    return cleaned;
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
          placeholder="Ingrese RUN del residente (ej: 11111111-1)"
          value={rut}
          onChange={(e) => setRut(formatRut(e.target.value))}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</p>}
      </form>
    </div>
  </div>
);
}
