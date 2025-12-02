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

  // --- Datos personales ---
  const datosPersonalesRaw = doc.datos_personales || {};
  const datos_personales = {
    rut: datosPersonalesRaw.rut || doc.rut || "",
    nombre: datosPersonalesRaw.nombre || doc.nombre || "",
    fecha_nacimiento:
      datosPersonalesRaw.fecha_nacimiento || doc.fecha_nacimiento || "",
    edad: datosPersonalesRaw.edad || "",
    sexo: datosPersonalesRaw.sexo || doc.sexo || "",
    peso: datosPersonalesRaw.peso || doc.peso || "",
    prevision_salud:
      datosPersonalesRaw.prevision_salud || doc.prevision_salud || "",
    prevision_social:
      datosPersonalesRaw.prevision_social || doc.prevision_social || "",
    direccion_actual:
      datosPersonalesRaw.direccion_actual || doc.direccion || "",
  };

  // --- Ubicación ---
  const ubicacion =
    doc.ubicacion ||
    doc.ficha_clinica?.ubicacion || {
      habitacion: "",
      ingresa_desde: "",
      motivo_institucionalizacion: "",
    };

  // --- Datos sociales ---
  const datosSocialesRaw =
    doc.datos_sociales || doc.ficha_clinica?.datos_sociales || {};
  const escolaridadRaw = datosSocialesRaw.escolaridad || {};
  const datos_sociales = {
    religion: datosSocialesRaw.religion || "",
    actividad_laboral_previa: datosSocialesRaw.actividad_laboral_previa || "",
    estado_civil: datosSocialesRaw.estado_civil || "",
    vive_solo: !!datosSocialesRaw.vive_solo,
    calidad_apoyo: datosSocialesRaw.calidad_apoyo || "",
    escolaridad: {
      lectoescritura: escolaridadRaw.lectoescritura || "",
      analfabeto: escolaridadRaw.analfabeto || "",
      educacion_basica: escolaridadRaw.educacion_basica || "",
      educacion_media: escolaridadRaw.educacion_media || "",
      educacion_superior: escolaridadRaw.educacion_superior || "",
    },
  };

  // --- Apoderado ---
  const apoderado = doc.apoderado || {
    nombre: "",
    parentesco: "",
    telefono: "",
    correo: "",
  };

  // --- Antecedentes médicos ---
  const antecedentesRaw =
    doc.antecedentes_medicos || doc.ficha_clinica?.antecedentes_medicos || {};
  const antecedentes_medicos = {
    diabetes_tipo_I: !!antecedentesRaw.diabetes_tipo_I,
    diabetes_tipo_II: !!antecedentesRaw.diabetes_tipo_II,
    glaucoma: !!antecedentesRaw.glaucoma,
    patologia_renal: !!antecedentesRaw.patologia_renal,
    detalle_patologia_renal: antecedentesRaw.detalle_patologia_renal || "",
    epoc: !!antecedentesRaw.epoc,
    artrosis: !!antecedentesRaw.artrosis,
    cancer: antecedentesRaw.cancer || "",
    otras_patologias: antecedentesRaw.otras_patologias || "",
  };

  // --- Historia clínica ---
  const historiaRaw =
    doc.historia_clinica || doc.ficha_clinica?.historia_clinica || {};
  const historia_clinica = {
    categoria_residente: historiaRaw.categoria_residente || "",
    alergias: historiaRaw.alergias || "",
    examenes: historiaRaw.examenes || "",
    medicamentos_asociados: historiaRaw.medicamentos_asociados || "",
    historial_atenciones: Array.isArray(historiaRaw.historial_atenciones)
      ? historiaRaw.historial_atenciones
      : [],
  };

  return {
    datos_personales,
    ubicacion,
    datos_sociales,
    apoderado,
    antecedentes_medicos,
    historia_clinica,
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
