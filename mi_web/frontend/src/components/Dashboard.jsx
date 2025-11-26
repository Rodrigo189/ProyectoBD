import "../Dashboard.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const location = useLocation(); // Hook para acceder a la ubicación actual
  const navigate = useNavigate(); // Hook para navegar programaticamente
  const queryParams = new URLSearchParams(location.search); // Obtener los parametros de consulta (locations.search seria "?rut=12345678-9")
  const { rut } = useParams(); // Obtener el valor del parametro 'rut'

  const [residenteData, setResidenteData] = useState({ // Estado para almacenar los datos del residente
    nombre: "...........................",
    medicoTratante: "...........................",
    proximoControl: "dd/mm/aaaa",
    diagnostico: "...........................",
    medicoIndicador: "...........................",
    medicamentos: [],
    dosis: "...........................",
    casoSOS: "..........................."
  });

  useEffect(() => { // Cargar datos del residente al montar el componente o cuando cambie el 'rut'
    const cargarDatosResidente = async () => { // Funcion para cargar los datos del residente desde la API
      try {  // Manejo de errores
        const response = await fetch(`https://eleam.onrender.com/api/residentes/${rut}`); // Llamada a la API para obtener los datos del residente
        if (response.ok) { // Si la respuesta es exitosa
          const data = await response.json(); // Parsear la respuesta JSON
          setResidenteData({
            nombre: data.nombre || "...........................",
            medicoTratante: data.medico_tratante || "...........................",
            proximoControl: data.proximo_control || "dd/mm/aaaa",
            diagnostico: data.diagnostico || "...........................",
            medicoIndicador: data.medico_indicador || "...........................",
            medicamentos: data.medicamentos || [],
            dosis: data.dosis || "...........................",
            casoSOS: data.caso_sos !== undefined ? (data.caso_sos ? "Sí" : "No") : "..........................."
          });
        } else {
          console.error("Residente no encontrado");
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    if (rut) { // Solo cargar si 'rut' esta definido
      cargarDatosResidente();
    }
  }, [rut]);

  return (
    <div className="dashboard-container">
      {/* Banner */}
      <div className="banner">
        <div className="logo" style={{ backgroundImage: "url('/image.png')" }}></div>
        <div className="portal-title">Portal ELEAM Residente</div>
      </div>
      <div className= "breadcrumbs">
        <span onClick={() => navigate("/")}>Inicio</span> /
        <span onClick={() => navigate("/login-form")}> Informacion Residente</span> /
        <strong> Portal de Residentes</strong>
      </div>
      {/* Datos residente */}
      <div className="datos-residente">
        <div className="foto-residente" style={{ backgroundImage: "url('/Residente.png')" }}></div>
        <div className="info-residente">
          <p>Nombre residente: {residenteData.nombre}</p>
          <p>RUN: {rut}</p>
          <p>Médico tratante: {residenteData.medicoTratante}</p>
          <p>Próximo control: {residenteData.proximoControl}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="botones-accion">
        <button className="boton" onClick={() => navigate(`/ficha-clinica/${rut}`)}>Ver Ficha Clínica</button>
        <button className="boton" onClick={() => navigate(`/control-anterior/${rut}`)}>Información Control Anterior</button>
        <button className="boton" onClick={() => navigate(`/medicamentos/${rut}`)}>Información Medicamentos</button>
        <button className="boton" onClick={() => navigate(`/historial-clinico/${rut}`)}>Ver Historial Clínico</button>
        <button className="boton" onClick={() => navigate('/')}>Salir</button>
      </div>

      {/* Diagnóstico */}
      <div className="diagnostico">
        <h3>Diagnóstico Residente</h3>
        <div className="diagnostico-detalle">
          <div>
            <p><strong>Diagnóstico:</strong> {residenteData.diagnostico}</p>
            <p><strong>Médico que indica:</strong> {residenteData.medicoTratante}</p>
          </div>
            <div>
              {residenteData.medicamentos && residenteData.medicamentos.length > 0 ? (
                residenteData.medicamentos.map((med, index) => (
                  <div key={index}>
                    <p><strong><u>Registro Medicamento N° {index + 1}</u></strong></p>
                    <p><strong>Nombre:</strong> {med.nombre}</p>
                    <p><strong>Dosis:</strong> {med.dosis}</p>
                    <p><strong>Caso SOS:</strong> {med.caso_sos ? "Sí" : "No"}</p>
                    <p><strong>Médico que indica:</strong> {med.medico_indicador}</p>
                    <p><strong>Fecha inicio:</strong> {med.fecha_inicio}</p>
                    <p><strong>Fecha término:</strong> {med.fecha_termino || "No definida"}</p>
                    <hr />
                  </div>
                ))
              ) : (
                <p>No hay medicamentos registrados</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
