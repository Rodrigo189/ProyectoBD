import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import "../assets/styles/fichaClinica.module.css";

export default function CrearFicha() {
  const navigate = useNavigate();

  const [ficha, setFicha] = useState({
    datos_personales: {
      rut: "",
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
      detalle_patologia_renal: "",
      epoc: false,
      artrosis: false,
      cancer: "",
      otras_patologias: "",
    },
    historia_clinica: {
      categoria_residente: "",
      alergias: "",
      examenes: "",
      medicamentos_asociados: "",
    },
  });

  // === Handlers ===
  const handleChange = (section, field, value) => {
    setFicha({ ...ficha, [section]: { ...ficha[section], [field]: value } });
  };

  const handleNestedChange = (section, subgroup, field, value) => {
    setFicha({
      ...ficha,
      [section]: {
        ...ficha[section],
        [subgroup]: { ...ficha[section][subgroup], [field]: value },
      },
    });
  };

  const handleCheckbox = (section, field) => {
    setFicha({
      ...ficha,
      [section]: { ...ficha[section], [field]: !ficha[section][field] },
    });
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return "";
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fichaFinal = {
        ...ficha,
        datos_personales: {
          ...ficha.datos_personales,
          edad: calcularEdad(ficha.datos_personales.fecha_nacimiento),
        },
      };
      await crearFicha(fichaFinal);
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
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Crear Nueva Ficha Clínica</h2>

        {/* === DATOS PERSONALES === */}
        <div className="form-section">
          <h3>Datos Personales</h3>
          <div className="form-grid">
            <div>
              <label>RUT residente</label>
              <input
                value={ficha.datos_personales.rut}
                onChange={(e) =>
                  handleChange("datos_personales", "rut", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Nombre completo</label>
              <input
                value={ficha.datos_personales.nombre}
                onChange={(e) =>
                  handleChange("datos_personales", "nombre", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={
                  ficha.datos_personales.fecha_nacimiento
                    ? ficha.datos_personales.fecha_nacimiento.substring(0, 10)
                    : ""
                }
                onChange={(e) => {
                  const fecha = e.target.value;
                  handleChange("datos_personales", "fecha_nacimiento", fecha);
                  handleChange(
                    "datos_personales",
                    "edad",
                    calcularEdad(fecha)
                  );
                }}
                required
              />
            </div>
            <div>
              <label>Edad (automática)</label>
              <input
                type="number"
                value={ficha.datos_personales.edad || ""}
                readOnly
              />
            </div>
            <div>
              <label>Sexo</label>
              <input
                value={ficha.datos_personales.sexo}
                onChange={(e) =>
                  handleChange("datos_personales", "sexo", e.target.value)
                }
              />
            </div>
            <div>
              <label>Peso (kg)</label>
              <input
                type="number"
                value={ficha.datos_personales.peso}
                onChange={(e) =>
                  handleChange("datos_personales", "peso", e.target.value)
                }
              />
            </div>
            <div>
              <label>Previsión de salud</label>
              <input
                value={ficha.datos_personales.prevision_salud}
                onChange={(e) =>
                  handleChange(
                    "datos_personales",
                    "prevision_salud",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Previsión social</label>
              <input
                value={ficha.datos_personales.prevision_social}
                onChange={(e) =>
                  handleChange(
                    "datos_personales",
                    "prevision_social",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Dirección actual</label>
              <input
                value={ficha.datos_personales.direccion_actual}
                onChange={(e) =>
                  handleChange(
                    "datos_personales",
                    "direccion_actual",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* === UBICACIÓN === */}
        <div className="form-section">
          <h3>Ubicación e Ingreso</h3>
          <div className="form-grid">
            <div>
              <label>Habitación</label>
              <input
                value={ficha.ubicacion.habitacion}
                onChange={(e) =>
                  handleChange("ubicacion", "habitacion", e.target.value)
                }
              />
            </div>
            <div>
              <label>Ingresa desde</label>
              <select
                value={ficha.ubicacion.ingresa_desde}
                onChange={(e) =>
                  handleChange("ubicacion", "ingresa_desde", e.target.value)
                }
              >
                <option value="">Seleccione...</option>
                <option value="Hospital">Hospital</option>
                <option value="Casa">Casa</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Motivo de institucionalización</label>
              <textarea
                value={ficha.ubicacion.motivo_institucionalizacion}
                onChange={(e) =>
                  handleChange(
                    "ubicacion",
                    "motivo_institucionalizacion",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* === DATOS SOCIALES === */}
        <div className="form-section">
          <h3>Datos Sociales</h3>
          <div className="form-grid">
            <div>
              <label>Religión</label>
              <input
                value={ficha.datos_sociales.religion}
                onChange={(e) =>
                  handleChange("datos_sociales", "religion", e.target.value)
                }
              />
            </div>
            <div>
              <label>Actividad laboral previa</label>
              <input
                value={ficha.datos_sociales.actividad_laboral_previa}
                onChange={(e) =>
                  handleChange(
                    "datos_sociales",
                    "actividad_laboral_previa",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Estado civil</label>
              <input
                value={ficha.datos_sociales.estado_civil}
                onChange={(e) =>
                  handleChange("datos_sociales", "estado_civil", e.target.value)
                }
              />
            </div>
            <div>
              <label>Vive solo</label>
              <select
                value={ficha.datos_sociales.vive_solo ? "Sí" : "No"}
                onChange={(e) =>
                  handleChange(
                    "datos_sociales",
                    "vive_solo",
                    e.target.value === "Sí"
                  )
                }
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
            <div>
              <label>Calidad de apoyo</label>
              <select
                value={ficha.datos_sociales.calidad_apoyo}
                onChange={(e) =>
                  handleChange(
                    "datos_sociales",
                    "calidad_apoyo",
                    e.target.value
                  )
                }
              >
                <option value="">Seleccione...</option>
                <option value="Nula">Nula</option>
                <option value="Mala">Mala</option>
                <option value="Regular">Regular</option>
                <option value="Buena">Buena</option>
              </select>
            </div>
          </div>

          {/* === ESCOLARIDAD === */}
          <div className="subsection">
            <h4>Escolaridad</h4>
            <div className="form-grid">
              <div>
                <label>Lectoescritura</label>
                <select
                  value={ficha.datos_sociales.escolaridad.lectoescritura}
                  onChange={(e) =>
                    handleNestedChange(
                      "datos_sociales",
                      "escolaridad",
                      "lectoescritura",
                      e.target.value
                    )
                  }
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label>Analfabeto</label>
                <select
                  value={ficha.datos_sociales.escolaridad.analfabeto}
                  onChange={(e) =>
                    handleNestedChange(
                      "datos_sociales",
                      "escolaridad",
                      "analfabeto",
                      e.target.value
                    )
                  }
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label>Educación básica</label>
                <select
                  value={ficha.datos_sociales.escolaridad.educacion_basica}
                  onChange={(e) =>
                    handleNestedChange(
                      "datos_sociales",
                      "escolaridad",
                      "educacion_basica",
                      e.target.value
                    )
                  }
                >
                  <option value="">Seleccione...</option>
                  <option value="Completa">Completa</option>
                  <option value="Incompleta">Incompleta</option>
                </select>
              </div>
              <div>
                <label>Educación media</label>
                <select
                  value={ficha.datos_sociales.escolaridad.educacion_media}
                  onChange={(e) =>
                    handleNestedChange(
                      "datos_sociales",
                      "escolaridad",
                      "educacion_media",
                      e.target.value
                    )
                  }
                >
                  <option value="">Seleccione...</option>
                  <option value="Completa">Completa</option>
                  <option value="Incompleta">Incompleta</option>
                </select>
              </div>
              <div>
                <label>Educación superior</label>
                <select
                  value={ficha.datos_sociales.escolaridad.educacion_superior}
                  onChange={(e) =>
                    handleNestedChange(
                      "datos_sociales",
                      "escolaridad",
                      "educacion_superior",
                      e.target.value
                    )
                  }
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
        <div className="form-section">
          <h3>Apoderado</h3>
          <div className="form-grid">
            <div>
              <label>Nombre</label>
              <input
                value={ficha.apoderado.nombre}
                onChange={(e) =>
                  handleChange("apoderado", "nombre", e.target.value)
                }
              />
            </div>
            <div>
              <label>Parentesco</label>
              <input
                value={ficha.apoderado.parentesco}
                onChange={(e) =>
                  handleChange("apoderado", "parentesco", e.target.value)
                }
              />
            </div>
            <div>
              <label>Teléfono</label>
              <input
                value={ficha.apoderado.telefono}
                onChange={(e) =>
                  handleChange("apoderado", "telefono", e.target.value)
                }
              />
            </div>
            <div>
              <label>Correo electrónico</label>
              <input
                type="email"
                value={ficha.apoderado.correo}
                onChange={(e) =>
                  handleChange("apoderado", "correo", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* === ANTECEDENTES MÉDICOS === */}
        <div className="form-section">
          <h3>Antecedentes Médicos</h3>
          <div className="checkbox-group">
            {[
              "diabetes_tipo_I",
              "diabetes_tipo_II",
              "glaucoma",
              "epoc",
              "artrosis",
              "patologia_renal",
            ].map((campo) => (
              <label key={campo} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={ficha.antecedentes_medicos[campo]}
                  onChange={() =>
                    handleCheckbox("antecedentes_medicos", campo)
                  }
                />
                {campo.replace("_", " ")}
              </label>
            ))}
          </div>

          {ficha.antecedentes_medicos.patologia_renal && (
            <div>
              <label>Detalle patología renal</label>
              <input
                value={
                  ficha.antecedentes_medicos.detalle_patologia_renal || ""
                }
                onChange={(e) =>
                  handleChange(
                    "antecedentes_medicos",
                    "detalle_patologia_renal",
                    e.target.value
                  )
                }
              />
            </div>
          )}

          <div>
            <label>Cáncer (tipo/etapa)</label>
            <input
              value={ficha.antecedentes_medicos.cancer}
              onChange={(e) =>
                handleChange("antecedentes_medicos", "cancer", e.target.value)
              }
            />
          </div>

          <div>
            <label>Otras patologías</label>
            <textarea
              value={ficha.antecedentes_medicos.otras_patologias}
              onChange={(e) =>
                handleChange(
                  "antecedentes_medicos",
                  "otras_patologias",
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* === HISTORIA CLÍNICA === */}
        <div className="form-section">
          <h3>Historia Clínica</h3>
          <div className="form-grid">
            <div>
              <label>Categoría del residente (dependencia)</label>
              <input
                value={ficha.historia_clinica.categoria_residente}
                onChange={(e) =>
                  handleChange(
                    "historia_clinica",
                    "categoria_residente",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Alergias / Contraindicaciones</label>
              <textarea
                value={ficha.historia_clinica.alergias}
                onChange={(e) =>
                  handleChange("historia_clinica", "alergias", e.target.value)
                }
              />
            </div>
            <div>
              <label>Exámenes realizados</label>
              <textarea
                value={ficha.historia_clinica.examenes}
                onChange={(e) =>
                  handleChange("historia_clinica", "examenes", e.target.value)
                }
              />
            </div>
            <div>
              <label>Medicamentos asociados al ingreso</label>
              <textarea
                value={ficha.historia_clinica.medicamentos_asociados}
                onChange={(e) =>
                  handleChange(
                    "historia_clinica",
                    "medicamentos_asociados",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* === BOTONES === */}
        <div className="acciones-ficha">
          <button type="submit" className="btn-crear">
            💾 Guardar Ficha
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/")}
          >
            ↩️ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
