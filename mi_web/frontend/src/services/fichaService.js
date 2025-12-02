// src/services/fichaService.js
import api from "./api";

/**
 * Normaliza un RUT:
 * - Quita espacios y puntos
 * - Mantiene el guion y la K
 */
const normalizarRut = (rut) => {
  if (!rut) return "";
  return rut.toString().trim().replace(/\./g, "").toUpperCase();
};

/**
 * Adapta el documento que viene de MongoDB
 * al formato que usan las pantallas (Crear/Editar/FichaClinica)
 *
 * Soporta dos formas:
 * - Nueva: datos_personales, ubicacion, datos_sociales, ...
 * - Antigua: campos sueltos + ficha_clinica.{datos_sociales, ubicacion, ...}
 */
const adaptarDesdeBackend = (doc) => {
  if (!doc) return null;

  const ficha = doc.ficha_clinica || {};
  const datos_sociales = ficha.datos_sociales || {};
  const antecedentes = ficha.antecedentes_medicos || {};
  const ubicacion = ficha.ubicacion || {};
  const historia = ficha.historia_clinica || {};
  const escolaridad = datos_sociales.escolaridad || {};

  return {
    // 🔹 Datos personales (nivel raíz)
    datos_personales: {
      rut: doc.rut || "",
      nombre: doc.nombre || "",
      fecha_nacimiento: doc.fecha_nacimiento || "",
      fecha_ingreso: doc.fecha_ingreso || "",
      sexo: doc.sexo || "",
      peso: doc.peso || "",
      direccion_actual: doc.direccion || "",
      prevision_salud: doc.prevision_salud || "",
      medico_tratante: doc.medico_tratante || "",
      proximo_control: doc.proximo_control || "",
      diagnostico: doc.diagnostico || "",
    },

    // 🔹 Ubicación dentro de ficha_clinica
    ubicacion: {
      habitacion: ubicacion.habitacion || "",
      ingresa_desde: ubicacion.ingresa_desde || "",
      motivo_institucionalizacion:
        ubicacion.motivo_institucionalizacion || "",
    },

    // 🔹 Datos sociales
    datos_sociales: {
      religion: datos_sociales.religion || "",
      actividad_laboral_previa: datos_sociales.actividad_laboral_previa || "",
      estado_civil: datos_sociales.estado_civil || "",
      vive_solo: !!datos_sociales.vive_solo,
      calidad_apoyo: datos_sociales.calidad_apoyo || "",
      escolaridad: {
        lectoescritura: escolaridad.lectoescritura || "",
        analfabeto: escolaridad.analfabeto || "",
        educacion_basica: escolaridad.educacion_basica || "",
        educacion_media: escolaridad.educacion_media || "",
        educacion_superior: escolaridad.educacion_superior || "",
      },
    },

    // 🔹 Apoderado
    apoderado: {
      nombre: doc.apoderado?.nombre || "",
      parentesco: doc.apoderado?.parentesco || "",
      telefono: doc.apoderado?.telefono || "",
      correo: doc.apoderado?.correo || "",
    },

    // 🔹 Antecedentes médicos
    antecedentes_medicos: {
      artrosis: !!antecedentes.artrosis,
      cancer: antecedentes.cancer || "",
      detalle_patologia_renal: antecedentes.detalle_patologia_renal || "",
      diabetes_tipo_I: !!antecedentes.diabetes_tipo_I,
      diabetes_tipo_II: !!antecedentes.diabetes_tipo_II,
      epoc: !!antecedentes.epoc,
      glaucoma: !!antecedentes.glaucoma,
      otras_patologias: antecedentes.otras_patologias || "",
      patologia_renal: !!antecedentes.patologia_renal,
    },

    // 🔹 Historia clínica
    historia_clinica: {
      alergias: historia.alergias || "",
      categoria_residente: historia.categoria_residente || "",
      examenes: historia.examenes || "",
      medicamentos_asociados: historia.medicamentos_asociados || "",
      historial_atenciones: historia.historial_atenciones || [],
    },

    // 🔹 Medicamentos y signos vitales (arrays opcionales)
    medicamentos: Array.isArray(doc.medicamentos) ? doc.medicamentos : [],
    signos_vitales: Array.isArray(doc.signos_vitales)
      ? doc.signos_vitales
      : [],
  };
};


/**
 * Adapta la ficha del frontend al formato que espera tu backend
 * en /api/residentes (coincide con lo que haces en crear_residente)
 */
const mapFichaToBackend = (ficha) => {
  const dp = ficha.datos_personales || {};
  const ub = ficha.ubicacion || {};
  const ds = ficha.datos_sociales || {};
  const esc = ds.escolaridad || {};
  const ap = ficha.apoderado || {};
  const ant = ficha.antecedentes_medicos || {};
  const hc = ficha.historia_clinica || {};

  return {
    rut: normalizarRut(dp.rut),
    nombre: dp.nombre || "",
    datos_personales: {
      rut: normalizarRut(dp.rut),
      nombre: dp.nombre || "",
      fecha_nacimiento: dp.fecha_nacimiento || "",
      edad: dp.edad || "",
      sexo: dp.sexo || "",
      peso: dp.peso || "",
      prevision_salud: dp.prevision_salud || "",
      prevision_social: dp.prevision_social || "",
      direccion_actual: dp.direccion_actual || "",
    },
    ubicacion: {
      habitacion: ub.habitacion || "",
      ingresa_desde: ub.ingresa_desde || "",
      motivo_institucionalizacion: ub.motivo_institucionalizacion || "",
    },
    datos_sociales: {
      religion: ds.religion || "",
      actividad_laboral_previa: ds.actividad_laboral_previa || "",
      estado_civil: ds.estado_civil || "",
      vive_solo: !!ds.vive_solo,
      calidad_apoyo: ds.calidad_apoyo || "",
      escolaridad: {
        lectoescritura: esc.lectoescritura || "",
        analfabeto: esc.analfabeto || "",
        educacion_basica: esc.educacion_basica || "",
        educacion_media: esc.educacion_media || "",
        educacion_superior: esc.educacion_superior || "",
      },
    },
    apoderado: {
      nombre: ap.nombre || "",
      parentesco: ap.parentesco || "",
      telefono: ap.telefono || "",
      correo: ap.correo || "",
    },
    antecedentes_medicos: {
      diabetes_tipo_I: !!ant.diabetes_tipo_I,
      diabetes_tipo_II: !!ant.diabetes_tipo_II,
      glaucoma: !!ant.glaucoma,
      patologia_renal: !!ant.patologia_renal,
      detalle_patologia_renal: ant.detalle_patologia_renal || "",
      epoc: !!ant.epoc,
      artrosis: !!ant.artrosis,
      cancer: ant.cancer || "",
      otras_patologias: ant.otras_patologias || "",
    },
    historia_clinica: {
      categoria_residente: hc.categoria_residente || "",
      alergias: hc.alergias || "",
      examenes: hc.examenes || "",
      medicamentos_asociados: hc.medicamentos_asociados || "",
      historial_atenciones: Array.isArray(hc.historial_atenciones)
        ? hc.historial_atenciones
        : [],
    },
  };
};

/**
 * 🔹 Obtener ficha completa por RUT
 *    Usa: GET /api/residentes/<rut>
 */
export const getFichaCompleta = async (rut) => {
  try {
    const rutNorm = normalizarRut(rut);
    const res = await api.get(`/api/residentes/${rutNorm}`);
    return adaptarDesdeBackend(res.data);
  } catch (error) {
    console.error("❌ Error al obtener ficha:", error);
    throw error.response?.data || new Error("Error al obtener ficha clínica.");
  }
};

/**
 * 🔹 Crear nueva ficha clínica
 *    Usa: POST /api/residentes
 */
export const crearFicha = async (ficha) => {
  try {
    const payload = mapFichaToBackend(ficha);
    await api.post("/api/residentes", payload);
    console.log("✅ Residente + ficha creada en /api/residentes");
  } catch (error) {
    console.error("❌ Error al crear ficha:", error);
    throw error.response?.data || new Error("Error al crear ficha clínica.");
  }
};

/**
 * 🔹 Actualizar ficha existente
 *    Usa: PUT /api/residentes/<rut>
 */
export const updateFicha = async (rut, ficha) => {
  try {
    const rutNorm = normalizarRut(rut || ficha?.datos_personales?.rut);
    const payload = mapFichaToBackend(ficha);
    await api.put(`/api/residentes/${rutNorm}`, payload);
    console.log("✅ Ficha actualizada en /api/residentes");
  } catch (error) {
    console.error("❌ Error al actualizar ficha:", error);
    throw error.response?.data || new Error("Error al actualizar ficha clínica.");
  }
};

/**
 * 🔹 Eliminar ficha completa
 *    Usa: DELETE /api/residentes/<rut>
 */
export const deleteFicha = async (rut) => {
  try {
    const rutNorm = normalizarRut(rut);
    await api.delete(`/api/residentes/${rutNorm}`);
    console.log("✅ Ficha eliminada desde /api/residentes");
  } catch (error) {
    console.error("❌ Error al eliminar ficha:", error);
    throw error.response?.data || new Error("Error al eliminar ficha clínica.");
  }
};
