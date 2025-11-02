import { useState } from "react";
import { crearFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import "../assets/styles/fichaForm.css";

export default function CrearFicha() {
  const [form, setForm] = useState({
    rut_residente: "",
    datos_personales: {
      nombre: "",
      fecha_nacimiento: "",
      edad: "",
      sexo: "",
      peso: "",
      prevision_salud: "",
      prevision_social: "",
      direccion_actual: "",
    },
    ubicacion: {
      habitacion: "",
      ingresa_desde: "",
      motivo_institucionalizacion: "",
    },
    datos_sociales: {
      religion: "",
      actividad_laboral_previa: "",
      estado_civil: "",
      vive_solo: false,
      calidad_apoyo: "",
      escolaridad: {
        lectoescritura: "",
        analfabeto: "",
        educacion_basica: "",
        educacion_media: "",
        educacion_superior: "",
      },
    },
    apoderado: {
      nombre: "",
      parentesco: "",
      telefono: "",
      correo: "",
    },
    antecedentes_medicos: {
      diabetes_tipo_I: false,
      diabetes_tipo_II: false,
      glaucoma: false,
      patologia_renal: false,
      epoc: false,
      cancer: "",
      artrosis: false,
      otras_patologias: "",
    },
    historia_clinica: {
      alergias: "",
      categoria_residente: "",
      examenes: "",
      medicamentos_asociados: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");
    const updated = { ...form };
    let temp = updated;
    for (let i = 0; i < keys.length - 1; i++) temp = temp[keys[i]];
    temp[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearFicha(form);
      alert("✅ Ficha creada correctamente");
      console.log("Ficha enviada:", form);
    } catch (error) {
      console.error("Error al crear ficha:", error);
      alert("❌ No se pudo crear la ficha");
    }
  };

  return (
    <div>
      <Navbar titulo="Nueva Ficha Clínica" />
      <div className="form-container">
        <h2>Crear Nueva Ficha Clínica</h2>
        <form onSubmit={handleSubmit}>
          {/* === DATOS PERSONALES === */}
          <div className="form-section">
            <h3>Datos Personales</h3>
            <input name="rut_residente" placeholder="RUT residente" onChange={handleChange} />
            <input name="datos_personales.nombre" placeholder="Nombre" onChange={handleChange} />
            <input name="datos_personales.fecha_nacimiento" type="date" placeholder="Fecha de nacimiento" onChange={handleChange} />
            <input name="datos_personales.edad" type="number" placeholder="Edad" onChange={handleChange} />
            <input name="datos_personales.sexo" placeholder="Sexo" onChange={handleChange} />
            <input name="datos_personales.peso" type="number" placeholder="Peso (kg)" onChange={handleChange} />
            <input name="datos_personales.prevision_salud" placeholder="Previsión de salud" onChange={handleChange} />
            <input name="datos_personales.prevision_social" placeholder="Previsión social" onChange={handleChange} />
            <input name="datos_personales.direccion_actual" placeholder="Dirección actual" onChange={handleChange} />
          </div>

          {/* === UBICACIÓN E INGRESO === */}
          <div className="form-section">
            <h3>Ubicación e Ingreso</h3>
            <input name="ubicacion.habitacion" placeholder="Habitación" onChange={handleChange} />
            <select name="ubicacion.ingresa_desde" onChange={handleChange}>
              <option value="">Ingresa desde...</option>
              <option value="Hospital">Hospital</option>
              <option value="Casa">Casa</option>
              <option value="Otro">Otro</option>
            </select>
            <textarea
              name="ubicacion.motivo_institucionalizacion"
              placeholder="Motivo de la institucionalización"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* === DATOS SOCIALES === */}
          {/* Vive solo + calidad de apoyo */}
            <div className="flex-row">
            <div className="vive-solo">
                <label className="checkbox-item">
                <input
                    type="checkbox"
                    name="datos_sociales.vive_solo"
                    onChange={handleChange}
                />
                Vive solo
                </label>
            </div>
            <div className="calidad-apoyo">
                <select name="datos_sociales.calidad_apoyo" onChange={handleChange}>
                <option value="">Calidad de apoyo</option>
                <option value="Nula">Nula</option>
                <option value="Mala">Mala</option>
                <option value="Regular">Regular</option>
                <option value="Buena">Buena</option>
                </select>
            </div>
            </div>

            {/* Escolaridad */}
            <div className="escolaridad-block">
            <h4>Escolaridad</h4>
            <div className="escolaridad-grid">
                <div>
                <label>Lectoescritura:</label>
                <select name="datos_sociales.escolaridad.lectoescritura" onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
                </div>

                <div>
                <label>Analfabeto:</label>
                <select name="datos_sociales.escolaridad.analfabeto" onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
                </div>

                <div>
                <label>Educación Básica:</label>
                <select name="datos_sociales.escolaridad.educacion_basica" onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="Completa">Completa</option>
                    <option value="Incompleta">Incompleta</option>
                </select>
                </div>

                <div>
                <label>Educación Media:</label>
                <select name="datos_sociales.escolaridad.educacion_media" onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="Completa">Completa</option>
                    <option value="Incompleta">Incompleta</option>
                </select>
                </div>

                <div>
                <label>Educación Superior/Técnica:</label>
                <select name="datos_sociales.escolaridad.educacion_superior" onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
                </div>
            </div>
            </div>



          {/* === APODERADO === */}
          <div className="form-section">
            <h3>Apoderado</h3>
            <input name="apoderado.nombre" placeholder="Nombre" onChange={handleChange} />
            <input name="apoderado.parentesco" placeholder="Parentesco" onChange={handleChange} />
            <input name="apoderado.telefono" placeholder="Teléfono" onChange={handleChange} />
            <input name="apoderado.correo" type="email" placeholder="Correo electrónico" onChange={handleChange} />
          </div>

          {/* === ANTECEDENTES MÉDICOS === */}
          <div className="form-section">
            <h3>Antecedentes Médicos</h3>
            <div className="checkbox-group">
                {[
            { key: "diabetes_tipo_I", label: "Diabetes Tipo I" },
            { key: "diabetes_tipo_II", label: "Diabetes Tipo II" },
            { key: "glaucoma", label: "Glaucoma" },
            { key: "patologia_renal", label: "Patología renal" },
            { key: "epoc", label: "EPOC" },
            { key: "artrosis", label: "Artrosis" },
            ].map(({ key, label }) => (
            <label key={key} className="checkbox-item">
            <input
                type="checkbox"
                name={`antecedentes_medicos.${key}`}
                onChange={handleChange}
            />
            {label}
                </label>
                ))}
            </div>

        <div className="input-group">
        <input
            name="antecedentes_medicos.cancer"
            placeholder="Cáncer (tipo/etapa)"
            onChange={handleChange}
             />
        </div>

        <textarea
            name="antecedentes_medicos.otras_patologias"
            placeholder="Otras patologías"
            onChange={handleChange}
        ></textarea>
        </div>


          {/* === HISTORIA CLÍNICA INICIAL === */}
          <div className="form-section">
            <h3>Historia Clínica</h3>
            <input name="historia_clinica.categoria_residente" placeholder="Categoría del residente (dependencia)" onChange={handleChange} />
            <textarea name="historia_clinica.alergias" placeholder="Alergias / Contraindicaciones" onChange={handleChange}></textarea>
            <textarea name="historia_clinica.examenes" placeholder="Exámenes realizados" onChange={handleChange}></textarea>
            <textarea name="historia_clinica.medicamentos_asociados" placeholder="Medicamentos asociados al ingreso" onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn-crear">Guardar Ficha</button>
        </form>
      </div>
    </div>
  );
}
