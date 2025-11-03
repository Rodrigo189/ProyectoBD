import "../Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const rut = queryParams.get("rut");
  
  const [residenteData, setResidenteData] = useState({
    nombre: "...........................",
    medicoTratante: "...........................",
    proximoControl: "dd/mm/aaaa",
    diagnostico: "...........................",
    medicoIndicador: "...........................",
    medicamento: "...........................",
    dosis: "...........................",
    casoSOS: "..........................."
  });

  useEffect(() => {
    const cargarDatosResidente = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/residentes/${rut}`);
        if (response.ok) {
          const data = await response.json();
          setResidenteData({
            nombre: data.nombre || "...........................",
            medicoTratante: data.medico_tratante || "...........................",
            proximoControl: data.proximo_control || "dd/mm/aaaa",
            diagnostico: data.diagnostico || "...........................",
            medicoIndicador: data.medico_indicador || "...........................",
            medicamento: data.medicamento || "...........................",
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

    if (rut) {
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

      {/* Datos residente */}
      <div className="datos-residente">
        <div className="foto-residente"></div>
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
            <p>Diagnóstico: {residenteData.diagnostico}</p>
            <p>Médico que indica: {residenteData.medicoTratante}</p>
          </div>
            <div>
              {residenteData.medicamento ? (
                <>
                  <p>Nombre Medicamento: {residenteData.medicamento.nombre}</p>
                  <p>Dosis: {residenteData.medicamento.dosis}</p>
                  <p>Caso SOS: {residenteData.medicamento.caso_sos ? "Sí" : "No"}</p>
                  <p>Médico que indica: {residenteData.medicamento.medico_indicador}</p>
                  <p>Fecha inicio: {residenteData.medicamento.fecha_inicio}</p>
                  <p>
                    Fecha término:{" "}
                    {residenteData.medicamento.fecha_termino
                      ? residenteData.medicamento.fecha_termino
                      : "No definida"}
                  </p>
                </>
              ):(
                <p>No hay medicamentos registrados</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
