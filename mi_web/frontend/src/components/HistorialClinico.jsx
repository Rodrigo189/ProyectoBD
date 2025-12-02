import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/HistorialClinico.css";

export default function HistorialClinico() {
  const { rut } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    hora: "",
    presionSistolica: "",
    presionDiastolica: "",
    pulso: "",
    saturacionO2: "",
    temperatura: "",
    frecuenciaRespiratoria: "",
    hemoglucotest: "",
    diuresisDia: "",
    diuresisNoche: "",
    deposicion: "No",
    vomito: "No",
    peso: "",
    registradoPor: "",
    cargo: "",
    turno: "",
    observaciones: "",
  });

  useEffect(() => {
    cargarHistorial();
  }, [rut]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://eleam.onrender.com/api/historial-clinico/${rut}`);
      setFicha(response.data);
      setError("");
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError("Error al cargar la ficha clínica");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarResidente = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 1) {
      try {
        const response = await axios.get(`https://eleam.onrender.com/api/buscar-residentes?q=`);
        setSearchResults(response.data);
        setShowSearchDropdown(response.data.length > 0);
      } catch (err) {
        console.error("Error al cargar residentes:", err);
        setSearchResults([]);
      }
      return;
    }

    try {
      const response = await axios.get(`https://eleam.onrender.com/api/buscar-residentes?q=${query}`);
      setSearchResults(response.data);
      setShowSearchDropdown(true);
    } catch (err) {
      console.error("Error al buscar residentes:", err);
      setSearchResults([]);
    }
  };

  const handleSeleccionarResidente = (nuevoRut) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    navigate(`/historial-clinico/${nuevoRut}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const validarFormulario = () => {
    const camposRequeridos = [
      "presionSistolica",
      "presionDiastolica",
      "pulso",
      "saturacionO2",
      "temperatura",
      "frecuenciaRespiratoria",
      "hemoglucotest",
      "diuresisDia",
      "diuresisNoche",
      "peso",
      "registradoPor",
      "cargo",
      "turno",
    ];

    const camposFaltantes = camposRequeridos.filter(
      (campo) => !formData[campo] || formData[campo].toString().trim() === ""
    );

    if (camposFaltantes.length > 0) {
      const nombresFormato = {
        presionSistolica: "Presión Sistólica",
        presionDiastolica: "Presión Diastólica",
        pulso: "Pulso",
        saturacionO2: "Saturación O2",
        temperatura: "Temperatura",
        frecuenciaRespiratoria: "Frecuencia Respiratoria",
        hemoglucotest: "Hemoglucotest",
        diuresisDia: "Diuresis (Día)",
        diuresisNoche: "Diuresis (Noche)",
        peso: "Peso",
        registradoPor: "Registrado por",
        cargo: "Cargo",
        turno: "Turno",
      };

      const camposFormato = camposFaltantes.map((c) => nombresFormato[c]).join(", ");
      setValidationError(
        `⚠️ Campos requeridos incompletos:\n${camposFormato}`
      );
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleGuardarRegistro = async () => {
    if (!validarFormulario()) return;

    try {
      const nuevoRegistro = {
        rut,
        fecha: new Date().toISOString().split("T")[0],
        hora: formData.hora,
        presionSistolica: formData.presionSistolica + " mmHg",
        presionDiastolica: formData.presionDiastolica + " mmHg",
        pulso: formData.pulso + " lpm",
        saturacionO2: formData.saturacionO2 + " %",
        temperatura: formData.temperatura + " °C",
        frecuenciaRespiratoria: formData.frecuenciaRespiratoria + " rpm",
        hemoglucotest: formData.hemoglucotest + " mg/dL",
        diuresisDia: formData.diuresisDia,
        diuresisNoche: formData.diuresisNoche,
        deposicion: formData.deposicion,
        vomito: formData.vomito,
        peso: formData.peso + " kg",
        registradoPor: formData.registradoPor,
        cargo: formData.cargo,
        turno: formData.turno,
        observaciones: formData.observaciones,
      };

      const response = await axios.post(`https://eleam.onrender.com/api/signos-vitales`, nuevoRegistro);
      
      console.log("Registro guardado:", response.data);
      
      setFormData({
        hora: "",
        presionSistolica: "",
        presionDiastolica: "",
        pulso: "",
        saturacionO2: "",
        temperatura: "",
        frecuenciaRespiratoria: "",
        hemoglucotest: "",
        diuresisDia: "",
        diuresisNoche: "",
        deposicion: "No",
        vomito: "No",
        peso: "",
        registradoPor: "",
        cargo: "",
        turno: "",
        observaciones: "",
      });
      setShowModal(false);
      setValidationError("");
      
      // Mostrar modal de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      await cargarHistorial();
    } catch (err) {
      console.error("Error al guardar registro:", err);
      setValidationError("❌ Error al guardar: " + (err.response?.data?.error || err.message));
    }
  };

  const handleEliminar = (fecha, hora) => {
    setRegistroAEliminar({ fecha, hora });
    setShowConfirm(true);
  };

  const confirmarEliminacion = async () => {
    try {
      console.log(`Eliminando: ${rut}/${registroAEliminar.fecha}/${registroAEliminar.hora}`);
      
      await axios.delete(
        `https://eleam.onrender.com/api/signos-vitales/${rut}/${registroAEliminar.fecha}/${registroAEliminar.hora}`
      );
      
      setShowConfirm(false);
      setRegistroAEliminar(null);
      await cargarHistorial();
    } catch (err) {
      console.error("Error al eliminar registro:", err);
      setValidationError("Error al eliminar el registro: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="cargando">Cargando historial clínico...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ficha) return <div className="error">No se encontró información para el RUT indicado.</div>;

  const signos = ficha.signos_vitales || [];

  return (
    <div className="historial-clinico-container">
      <div className="breadcrumbs">
        <span onClick={() => navigate("/")}>Inicio</span> /
        <span onClick={() => navigate("/login-form")}> Informacion Residente</span> /
        <span onClick={() => navigate(`/dashboard?rut=${rut}`)}> Portal de Residentes</span> /
        <strong> Historial Clínico</strong>
      </div>
      {/* Buscador de Paciente */}
      <div className="buscador-section">
        <div className="buscador-container">
          <input
            type="text"
            placeholder="Buscar paciente por nombre o RUT..."
            value={searchQuery}
            onChange={(e) => handleBuscarResidente(e.target.value)}
            className="buscador-input"
          />
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((residente, idx) => (
                <div
                  key={idx}
                  className="search-item"
                  onClick={() => handleSeleccionarResidente(residente.rut)}
                >
                  <strong>{residente.nombre}</strong> - {residente.rut}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Encabezado */}
      <header className="header">
        <img
          src={`${process.env.PUBLIC_URL}/image.png`}
          alt="Logo ELEAM"
          className="logo"
        />
        <h1>Ficha Clínica</h1>
      </header>

      {/* Datos del residente */}
      <section className="info-paciente">
        <p><strong>RUT:</strong> {ficha.rut}</p>
        <p><strong>Nombre:</strong> {ficha.nombre}</p>
        <p><strong>Médico tratante:</strong> {ficha.medico_tratante}</p>
        <p><strong>Diagnóstico:</strong> {ficha.diagnostico}</p>
        <p><strong>Próximo control:</strong> {ficha.proximo_control}</p>
      </section>

      {/* Últimos registros */}
      <section className="ultimos-registros">
        <h3>Historial de Signos Vitales</h3>
        <div className="tabla-container">
          {signos.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Presión Sistólica</th>
                  <th>Presión Diastólica</th>
                  <th>Temperatura</th>
                  <th>Pulso</th>
                  <th>Sat O2</th>
                  <th>Frec Respiratoria</th>
                  <th>Hemoglucotest</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {signos.map((s, i) => (
                  <tr key={i}>
                    <td>{s.fecha}</td>
                    <td>{s.hora}</td>
                    <td>{s.presionSistolica}</td>
                    <td>{s.presionDiastolica}</td>
                    <td>{s.temperatura}</td>
                    <td>{s.pulso}</td>
                    <td>{s.saturacionO2}</td>
                    <td>{s.frecuenciaRespiratoria}</td>
                    <td>{s.hemoglucotest}</td>
                    <td>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleEliminar(s.fecha, s.hora)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay signos vitales registrados para este residente.</p>
          )}
        </div>
      </section>

      {/* Botón Flotante Circular */}
      <button
        className="btn-flotante-circular"
        onClick={() => setShowModal(true)}
        title="Agregar nuevo registro"
      >
        +
      </button>

      {/* Modal Nuevo Registro */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Registro de Signos Vitales</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {validationError && (
              <div className="validation-error">{validationError}</div>
            )}

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Hora:</label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Presión arterial sistólica:</label>
                  <input
                    type="number"
                    name="presionSistolica"
                    placeholder="120"
                    value={formData.presionSistolica}
                    onChange={handleInputChange}
                  />
                  <span>mmHg</span>
                </div>
                <div className="form-group">
                  <label>Presión arterial diastólica:</label>
                  <input
                    type="number"
                    name="presionDiastolica"
                    placeholder="80"
                    value={formData.presionDiastolica}
                    onChange={handleInputChange}
                  />
                  <span>mmHg</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pulso:</label>
                  <input
                    type="number"
                    name="pulso"
                    placeholder="75"
                    value={formData.pulso}
                    onChange={handleInputChange}
                  />
                  <span>lpm</span>
                </div>
                <div className="form-group">
                  <label>Saturación O2:</label>
                  <input
                    type="number"
                    name="saturacionO2"
                    placeholder="98"
                    value={formData.saturacionO2}
                    onChange={handleInputChange}
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Temperatura:</label>
                  <input
                    type="number"
                    name="temperatura"
                    placeholder="36.5"
                    step="0.1"
                    value={formData.temperatura}
                    onChange={handleInputChange}
                  />
                  <span>°C</span>
                </div>
                <div className="form-group">
                  <label>Frecuencia respiratoria:</label>
                  <input
                    type="number"
                    name="frecuenciaRespiratoria"
                    placeholder="16"
                    value={formData.frecuenciaRespiratoria}
                    onChange={handleInputChange}
                  />
                  <span>rpm</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hemoglucotest:</label>
                  <input
                    type="number"
                    name="hemoglucotest"
                    placeholder="100"
                    value={formData.hemoglucotest}
                    onChange={handleInputChange}
                  />
                  <span>mg/dL</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Diuresis (Día):</label>
                  <input
                    type="text"
                    name="diuresisDia"
                    value={formData.diuresisDia}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Diuresis (Noche):</label>
                  <input
                    type="text"
                    name="diuresisNoche"
                    value={formData.diuresisNoche}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group radio-group">
                  <label>Deposición:</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="deposicion"
                        value="Si"
                        checked={formData.deposicion === "Si"}
                        onChange={(e) => handleRadioChange(e, "deposicion")}
                      />
                      Sí
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="deposicion"
                        value="No"
                        checked={formData.deposicion === "No"}
                        onChange={(e) => handleRadioChange(e, "deposicion")}
                      />
                      No
                    </label>
                  </div>
                </div>
                <div className="form-group radio-group">
                  <label>Vómito:</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="vomito"
                        value="Si"
                        checked={formData.vomito === "Si"}
                        onChange={(e) => handleRadioChange(e, "vomito")}
                      />
                      Sí
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="vomito"
                        value="No"
                        checked={formData.vomito === "No"}
                        onChange={(e) => handleRadioChange(e, "vomito")}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Peso:</label>
                  <input
                    type="number"
                    name="peso"
                    placeholder="70"
                    step="0.1"
                    value={formData.peso}
                    onChange={handleInputChange}
                  />
                  <span>kg</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Registrado por:</label>
                  <input
                    type="text"
                    name="registradoPor"
                    value={formData.registradoPor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Cargo:</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Turno:</label>
                  <input
                    type="text"
                    name="turno"
                    value={formData.turno}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Observaciones:</label>
                  <textarea
                    name="observaciones"
                    placeholder="Ingrese observaciones adicionales..."
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleGuardarRegistro}>
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar el registro del{" "}
              {registroAEliminar?.fecha} a las {registroAEliminar?.hora}?
            </p>
            <p className="confirm-warning">Esta acción no se puede deshacer.</p>
            <div className="confirm-buttons">
              <button
                className="btn-cancelar"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-aceptar"
                onClick={confirmarEliminacion}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Éxito */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h3>Registro guardado exitosamente</h3>
            <p>Los signos vitales se han registrado correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
}
