// src/pages/CrearFicha.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import styles from "../assets/styles/fichaClinica.module.css";

export default function CrearFicha() {
  const navigate = useNavigate();

  // Tu estado inicial (sin cambios)
  const [ficha, setFicha] = useState({
    datos_personales: {
      rut: "", nombre: "", fecha_nacimiento: "", edad: "", sexo: "",
      peso: "", prevision_salud: "", prevision_social: "", direccion_actual: "",
    },
    ubicacion: {
      habitacion: "", ingresa_desde: "", motivo_institucionalizacion: "",
    },
    datos_sociales: {
      religion: "", actividad_laboral_previa: "", estado_civil: "",
      vive_solo: false, calidad_apoyo: "",
      escolaridad: {
        lectoescritura: "", analfabeto: "", educacion_basica: "",
        educacion_media: "", educacion_superior: "",
      },
    },
    apoderado: {
      nombre: "", parentesco: "", telefono: "", correo: "",
    },
    antecedentes_medicos: {
      diabetes_tipo_I: false, diabetes_tipo_II: false, glaucoma: false,
      patologia_renal: false, detalle_patologia_renal: "", epoc: false,
      artrosis: false, cancer: "", otras_patologias: "",
    },
    historia_clinica: {
      categoria_residente: "", alergias: "", examenes: "", medicamentos_asociados: "",
    },
  });

  // === Handlers (funcionales, sin cambios de lógica) ===
  const handleChange = (section, field, value) => {
    setFicha((prevFicha) => ({
      ...prevFicha,
      [section]: { ...prevFicha[section], [field]: value },
    }));
  };
  const handleNestedChange = (section, subgroup, field, value) => {
    setFicha((prevFicha) => ({
      ...prevFicha,
      [section]: {
        ...prevFicha[section],
        [subgroup]: { ...prevFicha[section][subgroup], [field]: value },
      },
    }));
  };
  const handleCheckbox = (section, field) => {
    setFicha((prevFicha) => ({
      ...prevFicha,
      [section]: { ...prevFicha[section], [field]: !prevFicha[section][field] },
    }));
  };

  // === Cálculo de Edad (Sin cambios) ===
  const calcularEdad = (fecha) => {
    if (!fecha) return "";
    const hoy = new Date();
    const nacimiento = new Date(fecha + "T00:00:00");
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad.toString();
  };

  // === Submit (Sin cambios) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearFicha(ficha);
      alert("✅ Ficha creada correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al crear ficha:", error);
      alert("❌ No se pudo crear la ficha");
    }
  };

  return (
    <div>
      <Navbar titulo="Nueva Ficha Clínica" />
      
      {/* Usamos el contenedor de página unificado */}
      <form className={styles.pageContainer} onSubmit={handleSubmit}>
        <h2>Crear Nueva Ficha Clínica</h2>

        {/* === DATOS PERSONALES === */}
        <div className={styles.formSection}>
          <h3>Datos Personales</h3>
          <div className={styles.formGrid}>
            <div>
              <label htmlFor="rut" className={styles.label}>RUT residente</label>
              <input
                id="rut"
                name="rut"
                className={styles.input}
                value={ficha.datos_personales.rut}
                onChange={(e) => handleChange("datos_personales", "rut", e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="nombre" className={styles.label}>Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                className={styles.input}
                value={ficha.datos_personales.nombre}
                onChange={(e) => handleChange("datos_personales", "nombre", e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="fecha_nacimiento" className={styles.label}>Fecha de nacimiento</label>
              <input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                className={styles.input}
                value={ficha.datos_personales.fecha_nacimiento.split("T")[0]}
                onChange={(e) => {
                  const fecha = e.target.value;
                  const edad = calcularEdad(fecha);
                  setFicha(prevFicha => ({
                    ...prevFicha,
                    datos_personales: {
                      ...prevFicha.datos_personales,
                      fecha_nacimiento: fecha,
                      edad: edad
                    }
                  }));
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="edad" className={styles.label}>Edad (automática)</label>
              <input
                id="edad"
                name="edad"
                type="number"
                className={styles.input}
                value={ficha.datos_personales.edad || ""}
                readOnly
                placeholder="Se calcula solo"
              />
            </div>
            <div>
              <label htmlFor="sexo" className={styles.label}>Sexo</label>
              <select
                id="sexo"
                name="sexo"
                className={styles.select}
                value={ficha.datos_personales.sexo}
                onChange={(e) => handleChange("datos_personales", "sexo", e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="peso" className={styles.label}>Peso (kg)</label>
              <input
                id="peso"
                name="peso"
                type="number"
                className={styles.input}
                value={ficha.datos_personales.peso}
                onChange={(e) => handleChange("datos_personales", "peso", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="prevision_salud" className={styles.label}>Previsión de salud</label>
              <input
                id="prevision_salud"
                name="prevision_salud"
                className={styles.input}
                value={ficha.datos_personales.prevision_salud}
                onChange={(e) => handleChange("datos_personales", "prevision_salud", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="prevision_social" className={styles.label}>Previsión social</label>
              <input
                id="prevision_social"
                name="prevision_social"
                className={styles.input}
                value={ficha.datos_personales.prevision_social}
                onChange={(e) => handleChange("datos_personales", "prevision_social", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="direccion_actual" className={styles.label}>Dirección actual</label>
              <input
                id="direccion_actual"
                name="direccion_actual"
                className={styles.input}
                value={ficha.datos_personales.direccion_actual}
                onChange={(e) => handleChange("datos_personales", "direccion_actual", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === UBICACIÓN === */}
        <div className={styles.formSection}>
          <h3>Ubicación e Ingreso</h3>
          <div className={styles.formGrid}>
            <div>
              <label htmlFor="habitacion" className={styles.label}>Habitación</label>
              <input
                id="habitacion"
                name="habitacion"
                className={styles.input}
                value={ficha.ubicacion.habitacion}
                onChange={(e) => handleChange("ubicacion", "habitacion", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="ingresa_desde" className={styles.label}>Ingresa desde</label>
              <select
                id="ingresa_desde"
                name="ingresa_desde"
                className={styles.select}
                value={ficha.ubicacion.ingresa_desde}
                onChange={(e) => handleChange("ubicacion", "ingresa_desde", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="Hospital">Hospital</option>
                <option value="Casa">Casa</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="motivo_institucionalizacion" className={styles.label}>
                Motivo de institucionalización
              </label>
              <textarea
                id="motivo_institucionalizacion"
                name="motivo_institucionalizacion"
                className={styles.textarea}
                value={ficha.ubicacion.motivo_institucionalizacion}
                onChange={(e) => handleChange("ubicacion", "motivo_institucionalizacion", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === DATOS SOCIALES === */}
        <div className={styles.formSection}>
          <h3>Datos Sociales</h3>
          <div className={styles.formGrid}>
            <div>
              <label htmlFor="religion" className={styles.label}>Religión</label>
              <input
                id="religion"
                name="religion"
                className={styles.input}
                value={ficha.datos_sociales.religion}
                onChange={(e) => handleChange("datos_sociales", "religion", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="actividad_laboral_previa" className={styles.label}>
                Actividad laboral previa
              </label>
              <input
                id="actividad_laboral_previa"
                name="actividad_laboral_previa"
                className={styles.input}
                value={ficha.datos_sociales.actividad_laboral_previa}
                onChange={(e) => handleChange("datos_sociales", "actividad_laboral_previa", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="estado_civil" className={styles.label}>Estado civil</label>
              <input
                id="estado_civil"
                name="estado_civil"
                className={styles.input}
                value={ficha.datos_sociales.estado_civil}
                onChange={(e) => handleChange("datos_sociales", "estado_civil", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="vive_solo" className={styles.label}>Vive solo</label>
              <select
                id="vive_solo"
                name="vive_solo"
                className={styles.select}
                value={ficha.datos_sociales.vive_solo ? "Sí" : "No"}
                onChange={(e) => handleChange("datos_sociales", "vive_solo", e.target.value === "Sí")}
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
            <div>
              <label htmlFor="calidad_apoyo" className={styles.label}>Calidad de apoyo</label>
              <select
                id="calidad_apoyo"
                name="calidad_apoyo"
                className={styles.select}
                value={ficha.datos_sociales.calidad_apoyo}
                onChange={(e) => handleChange("datos_sociales", "calidad_apoyo", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="Nula">Nula</option>
                <option value="Mala">Mala</option>
                <option value="Regular">Regular</option>
                <option value="Buena">Buena</option>
              </select>
            </div>
          </div>

          <div className={styles.subsection}>
            <h4>Escolaridad</h4>
            <div className={styles.formGrid}>
              <div>
                <label htmlFor="lectoescritura" className={styles.label}>Lectoescritura</label>
                <select
                  id="lectoescritura"
                  name="lectoescritura"
                  className={styles.select}
                  value={ficha.datos_sociales.escolaridad.lectoescritura}
                  onChange={(e) => handleNestedChange("datos_sociales", "escolaridad", "lectoescritura", e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label htmlFor="analfabeto" className={styles.label}>Analfabeto</label>
                <select
                  id="analfabeto"
                  name="analfabeto"
                  className={styles.select}
                  value={ficha.datos_sociales.escolaridad.analfabeto}
                  onChange={(e) => handleNestedChange("datos_sociales", "escolaridad", "analfabeto", e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label htmlFor="educacion_basica" className={styles.label}>Educación básica</label>
                <select
                  id="educacion_basica"
                  name="educacion_basica"
                  className={styles.select}
                  value={ficha.datos_sociales.escolaridad.educacion_basica}
                  onChange={(e) => handleNestedChange("datos_sociales", "escolaridad", "educacion_basica", e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Completa">Completa</option>
                  <option value="Incompleta">Incompleta</option>
                </select>
              </div>
              <div>
                <label htmlFor="educacion_media" className={styles.label}>Educación media</label>
                <select
                  id="educacion_media"
                  name="educacion_media"
                  className={styles.select}
                  value={ficha.datos_sociales.escolaridad.educacion_media}
                  onChange={(e) => handleNestedChange("datos_sociales", "escolaridad", "educacion_media", e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Completa">Completa</option>
                  <option value="Incompleta">Incompleta</option>
                </select>
              </div>
              <div>
                <label htmlFor="educacion_superior" className={styles.label}>Educación superior</label>
                <select
                  id="educacion_superior"
                  name="educacion_superior"
                  className={styles.select}
                  value={ficha.datos_sociales.escolaridad.educacion_superior}
                  onChange={(e) => handleNestedChange("datos_sociales", "escolaridad", "educacion_superior", e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* === APODERADO === */}
        <div className={styles.formSection}>
          <h3>Apoderado</h3>
          <div className={styles.formGrid}>
            <div>
              <label htmlFor="apoderado_nombre" className={styles.label}>Nombre</label>
              <input
                id="apoderado_nombre"
                name="apoderado_nombre"
                className={styles.input}
                value={ficha.apoderado.nombre}
                onChange={(e) => handleChange("apoderado", "nombre", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="apoderado_parentesco" className={styles.label}>Parentesco</label>
              <input
                id="apoderado_parentesco"
                name="apoderado_parentesco"
                className={styles.input}
                value={ficha.apoderado.parentesco}
                onChange={(e) => handleChange("apoderado", "parentesco", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="apoderado_telefono" className={styles.label}>Teléfono (9 dígitos)</label>
              <input
                id="apoderado_telefono"
                name="apoderado_telefono"
                type="tel"
                className={styles.input}
                value={ficha.apoderado.telefono}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("apoderado", "telefono", val);
                }}
                pattern="[0-9]{9}"
                maxLength="9"
                title="El teléfono debe contener exactamente 9 dígitos (ej: 912345678)"
                placeholder="Ej: 912345678"
              />
            </div>
            <div>
              <label htmlFor="apoderado_correo" className={styles.label}>Correo electrónico</label>
              <input
                id="apoderado_correo"
                name="apoderado_correo"
                type="email"
                className={styles.input}
                value={ficha.apoderado.correo}
                onChange={(e) => handleChange("apoderado", "correo", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === ANTECEDENTES MÉDICOS === */}
        <div className={styles.formSection}>
          <h3>Antecedentes Médicos</h3>
          <div className={styles.checkboxGroup}>
            {[
              "diabetes_tipo_I", "diabetes_tipo_II", "glaucoma",
              "epoc", "artrosis", "patologia_renal",
            ].map((campo) => (
              <div key={campo} className={styles.checkboxItem}>
                <input
                  id={campo}
                  name={campo}
                  type="checkbox"
                  checked={ficha.antecedentes_medicos[campo]}
                  onChange={() => handleCheckbox("antecedentes_medicos", campo)}
                />
                <label htmlFor={campo}>{campo.replace(/_/g, " ")}</label>
              </div>
            ))}
          </div>

          {ficha.antecedentes_medicos.patologia_renal && (
            <div style={{marginTop: '15px'}}>
              <label htmlFor="detalle_patologia_renal" className={styles.label}>
                Detalle patología renal
              </label>
              <input
                id="detalle_patologia_renal"
                name="detalle_patologia_renal"
                className={styles.input}
                value={ficha.antecedentes_medicos.detalle_patologia_renal || ""}
                onChange={(e) => handleChange("antecedentes_medicos", "detalle_patologia_renal", e.target.value)}
              />
            </div>
          )}

          <div className={styles.formGrid} style={{marginTop: '15px'}}>
            <div>
              <label htmlFor="cancer" className={styles.label}>Cáncer (tipo/etapa)</label>
              <input
                id="cancer"
                name="cancer"
                className={styles.input}
                value={ficha.antecedentes_medicos.cancer}
                onChange={(e) => handleChange("antecedentes_medicos", "cancer", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="otras_patologias" className={styles.label}>Otras patologías</label>
              <textarea
                id="otras_patologias"
                name="otras_patologias"
                className={styles.textarea}
                value={ficha.antecedentes_medicos.otras_patologias}
                onChange={(e) => handleChange("antecedentes_medicos", "otras_patologias", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === HISTORIA CLÍNICA === */}
        <div className={styles.formSection}>
          <h3>Historia Clínica</h3>
          <div className={styles.formGrid}>
            <div>
              <label htmlFor="categoria_residente" className={styles.label}>
                Categoría del residente (dependencia)
              </label>
              <input
                id="categoria_residente"
                name="categoria_residente"
                className={styles.input}
                value={ficha.historia_clinica.categoria_residente}
                onChange={(e) => handleChange("historia_clinica", "categoria_residente", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="alergias" className={styles.label}>Alergias / Contraindicaciones</label>
              <textarea
                id="alergias"
                name="alergias"
                className={styles.textarea}
                value={ficha.historia_clinica.alergias}
                onChange={(e) => handleChange("historia_clinica", "alergias", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="examenes" className={styles.label}>Exámenes realizados</label>
              <textarea
                id="examenes"
                name="examenes"
                className={styles.textarea}
                value={ficha.historia_clinica.examenes}
                onChange={(e) => handleChange("historia_clinica", "examenes", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="medicamentos_asociados" className={styles.label}>
                Medicamentos asociados al ingreso
              </label>
              <textarea
                id="medicamentos_asociados"
                name="medicamentos_asociados"
                className={styles.textarea}
                value={ficha.historia_clinica.medicamentos_asociados}
                onChange={(e) => handleChange("historia_clinica", "medicamentos_asociados", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === BOTONES === */}
        <div className={styles.actionsContainer} style={{marginTop: '20px'}}>
          <button type="submit" className={styles.btnPrimary}>
            💾 Guardar Ficha
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/")}
          >
            ↩️ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}