import { useState } from "react";
import { getFichaCompleta } from "../services/fichaService";
import Navbar from "../components/Navbar";
import HistoriaClinicaTable from "../components/HistoriaClinicaTable";
import "../assets/styles/globals.css";
import "../assets/styles/fichaClinica.css";

export default function FichaClinica() {
  const [rut, setRut] = useState("");
  const [ficha, setFicha] = useState(null);

  const buscarFicha = async () => {
    try {
      const data = await getFichaCompleta(rut);
      if (!data || Object.keys(data).length === 0) {
        alert("No se encontró la ficha para este RUT");
        setFicha(null);
      } else {
        setFicha(data);
      }
    } catch (error) {
      console.error("Error al obtener la ficha:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <Navbar titulo="Ficha Clínica ELEAM" />
      <div className="container">
        <div className="buscar">
          <h2>Buscar Ficha Clínica</h2>
          <input
            type="text"
            placeholder="Ingrese RUT del residente"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <button onClick={buscarFicha}>Buscar</button>
        </div>

        {ficha && (
          <div className="ficha-info">
            <div className="section-block">
              <h3>Datos Personales</h3>
              <p><b>Nombre:</b> {ficha.datos_personales?.nombre}</p>
              <p><b>Edad:</b> {ficha.datos_personales?.edad}</p>
              <p><b>Sexo:</b> {ficha.datos_personales?.sexo}</p>
              <p><b>Peso:</b> {ficha.datos_personales?.peso} kg</p>
              <p><b>Previsión Salud:</b> {ficha.datos_personales?.prevision_salud}</p>
              <p><b>Dirección:</b> {ficha.datos_personales?.direccion_actual}</p>
            </div>

            <div className="section-block">
              <h3>Datos Sociales</h3>
              <p><b>Religión:</b> {ficha.datos_sociales?.religion}</p>
              <p><b>Actividad laboral previa:</b> {ficha.datos_sociales?.actividad_laboral_previa}</p>
              <p><b>Estado civil:</b> {ficha.datos_sociales?.estado_civil}</p>
              <p><b>Vive solo:</b> {ficha.datos_sociales?.vive_solo ? "Sí" : "No"}</p>
              <p><b>Calidad de apoyo:</b> {ficha.datos_sociales?.calidad_apoyo}</p>
            </div>

            <div className="section-block">
              <h3>Escolaridad</h3>
              <ul>
                <li>Lectoescritura: {ficha.datos_sociales?.escolaridad?.lectoescritura}</li>
                <li>Analfabeto: {ficha.datos_sociales?.escolaridad?.analfabeto}</li>
                <li>Educación básica: {ficha.datos_sociales?.escolaridad?.educacion_basica}</li>
                <li>Educación media: {ficha.datos_sociales?.escolaridad?.educacion_media}</li>
                <li>Educación superior: {ficha.datos_sociales?.escolaridad?.educacion_superior}</li>
              </ul>
            </div>

            <div className="section-block">
              <h3>Ubicación</h3>
              <p><b>Habitación:</b> {ficha.ubicacion}</p>
              <p><b>Ingresa desde:</b> {ficha.ingresa_desde}</p>
              <p><b>Motivo institucionalización:</b> {ficha.motivo_institucionalizacion}</p>
            </div>

            <div className="section-block">
              <h3>Apoderado</h3>
              <p><b>Nombre:</b> {ficha.apoderado?.nombre}</p>
              <p><b>Parentesco:</b> {ficha.apoderado?.parentesco}</p>
              <p><b>Teléfono:</b> {ficha.apoderado?.telefono}</p>
              <p><b>Correo:</b> {ficha.apoderado?.correo}</p>
            </div>

            <div className="section-block">
                <h3>Antecedentes Médicos</h3>
                {ficha.antecedentes_medicos ? (
                <ul className="antecedentes-lista">
                <li><b>Artrosis:</b> {ficha.antecedentes_medicos.artrosis ? "Sí" : "No"}</li>
                <li><b>Cáncer:</b> {ficha.antecedentes_medicos.cancer?.length > 0 ? ficha.antecedentes_medicos.cancer.join(", ") : "—"}</li>
                <li><b>Diabetes tipo I:</b> {ficha.antecedentes_medicos.diabetes_tipo_I ? "Sí" : "No"}</li>
                <li><b>Diabetes tipo II:</b> {ficha.antecedentes_medicos.diabetes_tipo_II ? "Sí" : "No"}</li>
                <li><b>Glaucoma:</b> {ficha.antecedentes_medicos.glaucoma ? "Sí" : "No"}</li>
                <li><b>EPOC:</b> {ficha.antecedentes_medicos.epoc ? "Sí" : "No"}</li>
                <li><b>Patología renal:</b> {ficha.antecedentes_medicos.patologia_renal ? "Sí" : "No"}</li>
                <li><b>Otras patologías:</b> {ficha.antecedentes_medicos.otras_patologias?.length > 0 ? ficha.antecedentes_medicos.otras_patologias.join(", ") : "—"}</li>
                </ul>
                ) : (
                <p>No hay antecedentes médicos registrados.</p>
                )}
            </div>


            <div className="section-block">
              <h3>Historia Clínica</h3>
              <HistoriaClinicaTable historia={ficha.historia_clinica} />
            </div>

            <div className="section-block">
              <h3>Medicamentos Asociados</h3>
              <ul>
                {ficha.medicamentos_asociados?.map((m, i) => (
                  <li key={i}>{m.nombre} - {m.dosis}</li>
                ))}
              </ul>
            </div>
            <div className="exportar-section">
                <button className="btn-exportar" onClick={() => window.print()}>
                🧾 Exportar Ficha Clínica (PDF)
                </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}