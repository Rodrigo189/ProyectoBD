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
 */
const adaptarDesdeBackend = (doc) => {
  if (!doc) return null;

  // ⚠️ CORRECCIÓN CLAVE:
  // Buscamos primero en la raíz (formato nuevo) y usamos el anidado como respaldo.
  const ficha_nested = doc.ficha_clinica || {};

  const datos_sociales = doc.datos_sociales || ficha_nested.datos_sociales || {};
  const antecedentes = doc.antecedentes_medicos || ficha_nested.antecedentes_medicos || {};
  const ubicacion = doc.ubicacion || ficha_nested.ubicacion || {};
  const historia = doc.historia_clinica || ficha_nested.historia_clinica || {};
  
  // Apoderado a veces viene directo o dentro de un objeto
  const apoderado = doc.apoderado || {};
  
  // Datos personales a veces vienen planos en 'doc' o dentro de 'datos_personales'
  const dp_source = doc.datos_personales || doc; 

  const escolaridad = datos_sociales.escolaridad || {};

  return {
    // 🔹 Datos personales
    datos_personales: {
      rut: dp_source.rut || doc.rut || "",
      nombre: dp_source.nombre || doc.nombre || "",
      fecha_nacimiento: dp_source.fecha_nacimiento || "",
      fecha_ingreso: dp_source.fecha_ingreso || "",
      sexo: dp_source.sexo || "",
      peso: dp_source.peso || "",
      direccion_actual: dp_source.direccion_actual || dp_source.direccion || "",
      prevision_salud: dp_source.prevision_salud || "",
      prevision_social: dp_source.prevision_social || "",
      medico_tratante: dp_source.medico_tratante || "",
      proximo_control: dp_source.proximo_control || "",
      diagnostico: dp_source.diagnostico || "",
    },
    
    // Auxiliar por si se necesita fuera
    rut_residente: doc.rut || dp_source.rut,

    // 🔹 Ubicación
    ubicacion: {
      habitacion: ubicacion.habitacion || "",
      ingresa_desde: ubicacion.ingresa_desde || "",
      motivo_institucionalizacion: ubicacion.motivo_institucionalizacion || "",
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
      nombre: apoderado.nombre || "",
      parentesco: apoderado.parentesco || "",
      telefono: apoderado.telefono || "",
      correo: apoderado.correo || "",
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
      categoria_residente: historia.categoria_residente || "",
      alergias: historia.alergias || "",
      examenes: historia.examenes || "",
      medicamentos_asociados: historia.medicamentos_asociados || "",
      historial_atenciones: Array.isArray(historia.historial_atenciones) ? historia.historial_atenciones : [],
    },

    // 🔹 Medicamentos y signos vitales
    medicamentos: Array.isArray(doc.medicamentos) ? doc.medicamentos : [],
    signos_vitales: Array.isArray(doc.signos_vitales) ? doc.signos_vitales : [],
  };
};

/**
 * Adapta la ficha del frontend al formato que espera tu backend
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
      historial_atenciones: Array.isArray(hc.historial_atenciones) ? hc.historial_atenciones : [],
    },
  };
};

// --- ENDPOINTS ---

export const getFichaCompleta = async (rut) => {
  try {
    const rutNorm = normalizarRut(rut);
    // CORRECCIÓN: Usamos /api/ficha para obtener el resumen completo
    const res = await api.get(`/api/ficha/${rutNorm}`);
    return adaptarDesdeBackend(res.data);
  } catch (error) {
    console.error("❌ Error al obtener ficha:", error);
    throw error.response?.data || new Error("Error al obtener ficha clínica.");
  }
};

export const crearFicha = async (ficha) => {
  try {
    const payload = mapFichaToBackend(ficha);
    // CORRECCIÓN: Usamos /api/residentes para crear/guardar (el orquestador)
    await api.post("/api/residentes", payload);
    console.log("✅ Residente + ficha creada en /api/residentes");
  } catch (error) {
    console.error("❌ Error al crear ficha:", error);
    throw error.response?.data || new Error("Error al crear ficha clínica.");
  }
};

export const updateFicha = async (rut, ficha) => {
  try {
    const rutNorm = normalizarRut(rut || ficha?.datos_personales?.rut);
    const payload = mapFichaToBackend(ficha);
    // Para actualizar, también podemos usar el POST de residentes (upsert) o el PUT
    await api.post("/api/residentes", payload);
    console.log("✅ Ficha actualizada en /api/residentes");
  } catch (error) {
    console.error("❌ Error al actualizar ficha:", error);
    throw error.response?.data || new Error("Error al actualizar ficha clínica.");
  }
};

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

// Si necesitas listar funcionarios para otra pantalla
export const listFuncionarios = async () => {
    try {
        const res = await api.get("/api/funcionarios");
        return res.data;
    } catch (error) {
        console.error("Error listando funcionarios", error);
        return [];
    }
};