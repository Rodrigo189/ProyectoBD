import { useState, useEffect } from "react";
import "../assets/styles/fichaForm.css";

export default function FichaForm({ modo = "crear", onSubmit, fichaInicial }) {
  const [formData, setFormData] = useState({
    // -------- Datos del Paciente ----------
    rut_residente: "",
    nombre: "",
    fecha_nacimiento: "",
    edad: "",
    sexo: "",
    peso: "",
    prevision_salud: "",
    prevision_social: "",
    direccion_actual: "",
    alergias: "",

    // -------- Datos Sociales ----------
    religion: "",
    actividad_laboral_previa: "",
    estado_civil: "",
    vive_solo: false,
    calidad_apoyo: "",

    // -------- Escolaridad (objeto anidado) ----------
    escolaridad: {
      lectoescritura: "",
      analfabeto: "",
      educacion_basica: "",
      educacion_media: "",
      educacion_superior: "",
    },

    // -------- Apoderado ----------
    apoderado_nombre: "",
    apoderado_rut: "",
    apoderado_parentesco: "",
    apoderado_telefono: "",
    apoderado_correo: "",

    // -------- Otros ----------
    categoria: "",
    observaciones: "",
  });

  useEffect(() => {
    if (fichaInicial) setFormData((prev) => ({ ...prev, ...fichaInicial }));
  }, [fichaInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // campos anidados: escolaridad.*
    if (name.startsWith("escolaridad.")) {
      const campo = name.split(".")[1];
      setFormData((fd) => ({
        ...fd,
        escolaridad: { ...fd.escolaridad, [campo]: value },
      }));
      return;
    }

    setFormData((fd) => ({
      ...fd,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h3>{modo === "editar" ? "Editar Ficha Clínica" : "Crear Ficha Clínica"}</h3>

      {/* ===================== DATOS DEL PACIENTE ===================== */}
      <h2>Datos del Paciente</h2>
      <div className="grid-2">
        <div className="field">
          <label>RUT del residente*</label>
          <input
            name="rut_residente"
            value={formData.rut_residente}
            onChange={handleChange}
            placeholder="Ej: 11111111-1"
            required
          />
        </div>

        <div className="field">
          <label>Nombre*</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />
        </div>

        <div className="field">
          <label>Fecha de nacimiento*</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Edad</label>
          <input name="edad" value={formData.edad} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Sexo</label>
          <input name="sexo" value={formData.sexo} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Peso (kg)</label>
          <input name="peso" value={formData.peso} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Previsión de salud</label>
          <input
            name="prevision_salud"
            value={formData.prevision_salud}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Previsión social</label>
          <input
            name="prevision_social"
            value={formData.prevision_social}
            onChange={handleChange}
          />
        </div>

        <div className="field full">
          <label>Dirección actual</label>
          <input
            name="direccion_actual"
            value={formData.direccion_actual}
            onChange={handleChange}
            placeholder="Calle / Número / Comuna"
          />
        </div>

        <div className="field full">
          <label>Alergias y/o contraindicaciones</label>
          <input
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            placeholder="Especificar alergias importantes"
          />
        </div>
      </div>

      {/* ===================== DATOS DEL APODERADO ===================== */}
      <h2>Datos del Apoderado</h2>
      <div className="grid-2">
        <div className="field full">
          <label>Nombre completo</label>
          <input
            name="apoderado_nombre"
            value={formData.apoderado_nombre}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>RUT apoderado</label>
          <input
            name="apoderado_rut"
            value={formData.apoderado_rut}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Parentesco</label>
          <input
            name="apoderado_parentesco"
            value={formData.apoderado_parentesco}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Teléfono</label>
          <input
            name="apoderado_telefono"
            value={formData.apoderado_telefono}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Correo electrónico</label>
          <input
            name="apoderado_correo"
            value={formData.apoderado_correo}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ===================== DATOS SOCIALES ===================== */}
      <h2>Datos Sociales</h2>
      <div className="grid-2">
        <div className="field">
          <label>Religión</label>
          <input
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            placeholder="Ej: Católica"
          />
        </div>

        <div className="field">
          <label>Actividad laboral previa</label>
          <input
            name="actividad_laboral_previa"
            value={formData.actividad_laboral_previa}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Estado civil</label>
          <select
            name="estado_civil"
            value={formData.estado_civil}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Viudo">Viudo</option>
            <option value="Divorciado">Divorciado</option>
          </select>
        </div>

        <div className="field">
          <label>Vive solo</label>
          <input
            type="checkbox"
            name="vive_solo"
            checked={formData.vive_solo}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Calidad de apoyo</label>
          <select
            name="calidad_apoyo"
            value={formData.calidad_apoyo}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Nula">Nula</option>
            <option value="Mala">Mala</option>
            <option value="Regular">Regular</option>
            <option value="Buena">Buena</option>
          </select>
        </div>
      </div>

      {/* ===================== ESCOLARIDAD ===================== */}
      <h2>Escolaridad</h2>
      <div className="grid-2">
        <div className="field">
          <label>Lectoescritura</label>
          <input
            name="escolaridad.lectoescritura"
            value={formData.escolaridad.lectoescritura}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Analfabeto</label>
          <input
            name="escolaridad.analfabeto"
            value={formData.escolaridad.analfabeto}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Educación básica</label>
          <input
            name="escolaridad.educacion_basica"
            value={formData.escolaridad.educacion_basica}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Educación media</label>
          <input
            name="escolaridad.educacion_media"
            value={formData.escolaridad.educacion_media}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Educación superior</label>
          <input
            name="escolaridad.educacion_superior"
            value={formData.escolaridad.educacion_superior}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ===================== OTROS ===================== */}
      <h2>Clasificación y Observaciones</h2>
      <div className="grid-2">
        <div className="field">
          <label>Categoría residente</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Dependencia leve">Dependencia leve</option>
            <option value="Dependencia moderada">Dependencia moderada</option>
            <option value="Dependencia severa">Dependencia severa</option>
            <option value="Dependencia total">Dependencia total</option>
          </select>
        </div>

        <div className="field full">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </div>

      <button type="submit" style={{ marginTop: 14 }}>
        {modo === "editar" ? "Guardar Cambios" : "Crear Ficha"}
      </button>
    </form>
  );
}
