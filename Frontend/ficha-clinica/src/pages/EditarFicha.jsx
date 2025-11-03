import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFichaCompleta, updateFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import "../assets/styles/fichaClinica.module.css";

export default function EditarFicha() {
  const { rut } = useParams();
  const navigate = useNavigate();

  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFicha = async () => {
      try {
        const data = await getFichaCompleta(rut);
        const fichaSegura = {
          ...data,
          historia_clinica: {
            categoria_residente: data.historia_clinica?.categoria_residente || "",
            alergias: data.historia_clinica?.alergias || "",
            examenes: data.historia_clinica?.examenes || "",
            medicamentos_asociados: data.historia_clinica?.medicamentos_asociados || "",
            historial_atenciones: Array.isArray(data.historia_clinica?.historial_atenciones)
              ? data.historia_clinica.historial_atenciones
              : [],
          },
        };
        setFicha(fichaSegura);
      } catch (error) {
        console.error("❌ Error al cargar ficha:", error);
        alert("No se pudo cargar la ficha para editar.");
      } finally {
        setLoading(false);
      }
    };
    fetchFicha();
  }, [rut]);

  const handleChange = (section, field, value) => {
    setFicha({
      ...ficha,
      [section]: { ...ficha[section], [field]: value },
    });
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

  const agregarAtencion = () => {
    setFicha({
      ...ficha,
      historia_clinica: {
        ...ficha.historia_clinica,
        historial_atenciones: [
          ...ficha.historia_clinica.historial_atenciones,
          { fecha: "", hora: "", motivo: "", tratante: "", medicamentos: "" },
        ],
      },
    });
  };

  const actualizarAtencion = (index, campo, valor) => {
    const nuevas = [...ficha.historia_clinica.historial_atenciones];
    nuevas[index][campo] = valor;
    setFicha({
      ...ficha,
      historia_clinica: { ...ficha.historia_clinica, historial_atenciones: nuevas },
    });
  };

  const eliminarAtencion = (index) => {
    const nuevas = ficha.historia_clinica.historial_atenciones.filter((_, i) => i !== index);
    setFicha({
      ...ficha,
      historia_clinica: { ...ficha.historia_clinica, historial_atenciones: nuevas },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fichaActualizada = {
        ...ficha,
        rut_residente: rut,
        datos_personales: {
          ...ficha.datos_personales,
          edad: calcularEdad(ficha.datos_personales.fecha_nacimiento),
        },
      };
      await updateFicha(rut, fichaActualizada);
      alert("✅ Ficha actualizada correctamente");
      navigate(`/ficha/${rut}`);
    } catch (error) {
      console.error("Error al actualizar ficha:", error);
      alert("❌ No se pudo actualizar la ficha");
    }
  };

  if (loading) return <p className="loading-msg">Cargando ficha...</p>;
  if (!ficha) return <p className="error-msg">Ficha no encontrada.</p>;

  return (
    <div>
      <Navbar titulo="Editar Ficha Clínica" />
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Editar Ficha Clínica</h2>

        {/* === DATOS PERSONALES === */}
        <div className="form-section">
          <h3>Datos Personales</h3>
          <div className="form-grid">
            <div>
              <label>RUT residente</label>
              <input type="text" value={rut} readOnly />
            </div>
            <div>
              <label>Nombre completo</label>
              <input
                value={ficha.datos_personales.nombre}
                onChange={(e) => handleChange("datos_personales", "nombre", e.target.value)}
              />
            </div>
            <div>
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={ficha.datos_personales.fecha_nacimiento?.substring(0, 10) || ""}
                onChange={(e) => {
                  handleChange("datos_personales", "fecha_nacimiento", e.target.value);
                  handleChange("datos_personales", "edad", calcularEdad(e.target.value));
                }}
              />
            </div>
            <div>
              <label>Edad (automática)</label>
              <input type="number" value={ficha.datos_personales.edad || ""} readOnly />
            </div>
            <div>
              <label>Sexo</label>
              <input
                value={ficha.datos_personales.sexo}
                onChange={(e) => handleChange("datos_personales", "sexo", e.target.value)}
              />
            </div>
            <div>
              <label>Peso (kg)</label>
              <input
                type="number"
                value={ficha.datos_personales.peso}
                onChange={(e) => handleChange("datos_personales", "peso", e.target.value)}
              />
            </div>
            <div>
              <label>Previsión de salud</label>
              <input
                value={ficha.datos_personales.prevision_salud}
                onChange={(e) =>
                  handleChange("datos_personales", "prevision_salud", e.target.value)
                }
              />
            </div>
            <div>
              <label>Previsión social</label>
              <input
                value={ficha.datos_personales.prevision_social}
                onChange={(e) =>
                  handleChange("datos_personales", "prevision_social", e.target.value)
                }
              />
            </div>
            <div>
              <label>Dirección actual</label>
              <input
                value={ficha.datos_personales.direccion_actual}
                onChange={(e) =>
                  handleChange("datos_personales", "direccion_actual", e.target.value)
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
                onChange={(e) => handleChange("datos_sociales", "religion", e.target.value)}
              />
            </div>
            <div>
              <label>Actividad laboral previa</label>
              <input
                value={ficha.datos_sociales.actividad_laboral_previa}
                onChange={(e) =>
                  handleChange("datos_sociales", "actividad_laboral_previa", e.target.value)
                }
              />
            </div>
            <div>
              <label>Estado civil</label>
              <input
                value={ficha.datos_sociales.estado_civil}
                onChange={(e) => handleChange("datos_sociales", "estado_civil", e.target.value)}
              />
            </div>
            <div>
              <label>Vive solo</label>
              <select
                value={ficha.datos_sociales.vive_solo ? "Sí" : "No"}
                onChange={(e) =>
                  handleChange("datos_sociales", "vive_solo", e.target.value === "Sí")
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

          <div className="subsection">
            <h4>Escolaridad</h4>
            <div className="form-grid">
              {Object.keys(ficha.datos_sociales.escolaridad).map((campo) => (
                <div key={campo}>
                  <label>{campo.replace("_", " ")}</label>
                  <select
                    value={ficha.datos_sociales.escolaridad[campo]}
                    onChange={(e) =>
                      handleNestedChange("datos_sociales", "escolaridad", campo, e.target.value)
                    }
                  >
                    <option value="">Seleccione...</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                    <option value="Completa">Completa</option>
                    <option value="Incompleta">Incompleta</option>
                  </select>
                </div>
              ))}
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
                onChange={(e) => handleChange("apoderado", "nombre", e.target.value)}
              />
            </div>
            <div>
              <label>Parentesco</label>
              <input
                value={ficha.apoderado.parentesco}
                onChange={(e) => handleChange("apoderado", "parentesco", e.target.value)}
              />
            </div>
            <div>
              <label>Teléfono</label>
              <input
                value={ficha.apoderado.telefono}
                onChange={(e) => handleChange("apoderado", "telefono", e.target.value)}
              />
            </div>
            <div>
              <label>Correo electrónico</label>
              <input
                type="email"
                value={ficha.apoderado.correo}
                onChange={(e) => handleChange("apoderado", "correo", e.target.value)}
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
                  onChange={() => handleCheckbox("antecedentes_medicos", campo)}
                />
                {campo.replaceAll("_", " ").replace("tipo I", "Tipo I").replace("tipo II", "Tipo II")}
              </label>
            ))}
          </div>

          {ficha.antecedentes_medicos.patologia_renal && (
            <div>
              <label>Detalle patología renal</label>
              <input
                value={ficha.antecedentes_medicos.detalle_patologia_renal || ""}
                onChange={(e) =>
                  handleChange("antecedentes_medicos", "detalle_patologia_renal", e.target.value)
                }
              />
            </div>
          )}

          <div>
            <label>Cáncer (tipo/etapa)</label>
            <input
              value={ficha.antecedentes_medicos.cancer}
              onChange={(e) => handleChange("antecedentes_medicos", "cancer", e.target.value)}
            />
          </div>

          <div>
            <label>Otras patologías</label>
            <textarea
              value={ficha.antecedentes_medicos.otras_patologias}
              onChange={(e) =>
                handleChange("antecedentes_medicos", "otras_patologias", e.target.value)
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
                  handleChange("historia_clinica", "categoria_residente", e.target.value)
                }
              />
            </div>
            <div>
              <label>Alergias / Contraindicaciones</label>
              <textarea
                value={ficha.historia_clinica.alergias}
                onChange={(e) => handleChange("historia_clinica", "alergias", e.target.value)}
              />
            </div>
            <div>
              <label>Exámenes realizados</label>
              <textarea
                value={ficha.historia_clinica.examenes}
                onChange={(e) => handleChange("historia_clinica", "examenes", e.target.value)}
              />
            </div>
            <div>
              <label>Medicamentos asociados al ingreso</label>
              <textarea
                value={ficha.historia_clinica.medicamentos_asociados}
                onChange={(e) =>
                  handleChange("historia_clinica", "medicamentos_asociados", e.target.value)
                }
              />
            </div>
          </div>

          {/* === HISTORIAL DE ATENCIONES === */}
          <h4>Historial de Atenciones</h4>
          {ficha.historia_clinica.historial_atenciones.map((at, index) => (
            <div key={index} className="subsection">
              <div className="form-grid">
                <div>
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={at.fecha}
                    onChange={(e) => actualizarAtencion(index, "fecha", e.target.value)}
                  />
                </div>
                <div>
                  <label>Hora</label>
                  <input
                    type="time"
                    value={at.hora}
                    onChange={(e) => actualizarAtencion(index, "hora", e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Motivo / Observaciones</label>
                  <input
                    value={at.motivo}
                    onChange={(e) => actualizarAtencion(index, "motivo", e.target.value)}
                  />
                </div>
                <div>
                  <label>Profesional tratante</label>
                  <input
                    value={at.tratante}
                    onChange={(e) => actualizarAtencion(index, "tratante", e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Medicamentos indicados</label>
                  <textarea
                    value={at.medicamentos}
                    onChange={(e) => actualizarAtencion(index, "medicamentos", e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-accion eliminar"
                onClick={() => eliminarAtencion(index)}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
          <button type="button" className="btn-accion pdf" onClick={agregarAtencion}>
            ➕ Agregar atención
          </button>
        </div>

        {/* === BOTONES === */}
        <div className="acciones-ficha">
          <button type="submit" className="btn-crear">
            💾 Guardar Cambios
          </button>
          <button type="button" className="btn-cancelar" onClick={() => navigate(`/ficha/${rut}`)}>
            ↩️ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
