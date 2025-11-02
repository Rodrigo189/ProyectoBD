import { useState, useEffect } from "react";
import "../assets/styles/fichaForm.css";


export default function FichaForm({ modo = "crear", onSubmit, fichaInicial }) {
  const [formData, setFormData] = useState({
    rut_residente: "",
    religion: "",
    actividad_laboral_previa: "",
    estado_civil: "",
    vive_solo: false,
    calidad_apoyo: "",
    prevision_social: "",
    escolaridad: {
      lectoescritura: "",
      analfabeto: "",
      educacion_basica: "",
      educacion_media: "",
      educacion_superior: ""
    },
    categoria: "",
    observaciones: ""
  });

  useEffect(() => {
    if (fichaInicial) setFormData(fichaInicial);
  }, [fichaInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("escolaridad.")) {
      const campo = name.split(".")[1];
      setFormData({
        ...formData,
        escolaridad: { ...formData.escolaridad, [campo]: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h3>{modo === "editar" ? "Editar Ficha Clínica" : "Crear Ficha Clínica"}</h3>

      <label>RUT del residente:</label>
      <input
        name="rut_residente"
        value={formData.rut_residente}
        onChange={handleChange}
        placeholder="Ej: 11111111-1"
        required
      />

      <label>Religión:</label>
      <input
        name="religion"
        value={formData.religion}
        onChange={handleChange}
        placeholder="Ej: Católica"
      />

      <label>Actividad laboral previa:</label>
      <input
        name="actividad_laboral_previa"
        value={formData.actividad_laboral_previa}
        onChange={handleChange}
      />

      <label>Estado civil:</label>
      <select name="estado_civil" value={formData.estado_civil} onChange={handleChange}>
        <option value="">Seleccione</option>
        <option value="Soltero">Soltero</option>
        <option value="Casado">Casado</option>
        <option value="Viudo">Viudo</option>
        <option value="Divorciado">Divorciado</option>
      </select>

      <label>Vive solo:</label>
      <input
        type="checkbox"
        name="vive_solo"
        checked={formData.vive_solo}
        onChange={handleChange}
      />

      <label>Calidad de apoyo:</label>
      <select name="calidad_apoyo" value={formData.calidad_apoyo} onChange={handleChange}>
        <option value="">Seleccione</option>
        <option value="Nula">Nula</option>
        <option value="Mala">Mala</option>
        <option value="Regular">Regular</option>
        <option value="Buena">Buena</option>
      </select>

      <label>Previsión social:</label>
      <input
        name="prevision_social"
        value={formData.prevision_social}
        onChange={handleChange}
      />

      <h4>Escolaridad</h4>
      <div className="escolaridad-grid">
        <label>Lectoescritura:</label>
        <input
          name="escolaridad.lectoescritura"
          value={formData.escolaridad.lectoescritura}
          onChange={handleChange}
        />
        <label>Analfabeto:</label>
        <input
          name="escolaridad.analfabeto"
          value={formData.escolaridad.analfabeto}
          onChange={handleChange}
        />
        <label>Educación básica:</label>
        <input
          name="escolaridad.educacion_basica"
          value={formData.escolaridad.educacion_basica}
          onChange={handleChange}
        />
        <label>Educación media:</label>
        <input
          name="escolaridad.educacion_media"
          value={formData.escolaridad.educacion_media}
          onChange={handleChange}
        />
        <label>Educación superior:</label>
        <input
          name="escolaridad.educacion_superior"
          value={formData.escolaridad.educacion_superior}
          onChange={handleChange}
        />
      </div>

      <label>Categoría residente:</label>
      <select name="categoria" value={formData.categoria} onChange={handleChange}>
        <option value="">Seleccione</option>
        <option value="Dependencia leve">Dependencia leve</option>
        <option value="Dependencia moderada">Dependencia moderada</option>
        <option value="Dependencia severa">Dependencia severa</option>
        <option value="Dependencia total">Dependencia total</option>
      </select>

      <label>Observaciones:</label>
      <textarea
        name="observaciones"
        value={formData.observaciones}
        onChange={handleChange}
        rows={3}
      />

      <button type="submit">
        {modo === "editar" ? "Guardar Cambios" : "Crear Ficha"}
      </button>
    </form>
  );
}
