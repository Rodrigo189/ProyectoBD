import api from "./api";

/**
 * === Helpers para adaptar el JSON real de Mongo al formato que usa la vista ===
 */
function calcularEdad(fechaStr) {
  if (!fechaStr) return null;
  const hoy = new Date();
  const fechaNac = new Date(fechaStr);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
}

function normalizarFicha(doc) {
  // Si ya viene en el modelo nuevo (con datos_personales), no tocamos nada
  if (doc.datos_personales) return doc;

  // Compatibilidad con el modelo antiguo (si algun dia queda algo viejo en la BD)
  const fc = doc.ficha_clinica || {};
  const datosSociales = fc.datos_sociales || {};
  const antecedentes = fc.antecedentes_medicos || {};
  const ubicacion = fc.ubicacion || {};
  const historia = fc.historia_clinica || {};

  const edad = calcularEdad(doc.fecha_nacimiento);

  return {
    rut_residente: doc.rut,
    datos_personales: {
      rut: doc.rut,
      nombre: doc.nombre,
      fecha_nacimiento: doc.fecha_nacimiento,
      edad: edad,
      sexo: doc.sexo,
      peso: doc.peso ?? "",
      prevision_salud: doc.prevision_salud,
      prevision_social: doc.prevision_social ?? "",
      direccion_actual: doc.direccion ?? "",
    },
    ubicacion: {
      habitacion: ubicacion.habitacion ?? "",
      ingresa_desde: ubicacion.ingresa_desde ?? "",
      motivo_institucionalizacion: ubicacion.motivo_institucionalizacion ?? "",
    },
    datos_sociales: {
      religion: datosSociales.religion ?? "",
      actividad_laboral_previa: datosSociales.actividad_laboral_previa ?? "",
      estado_civil: datosSociales.estado_civil ?? "",
      vive_solo: !!datosSociales.vive_solo,
      calidad_apoyo: datosSociales.calidad_apoyo ?? "",
      escolaridad: {
        lectoescritura: datosSociales.escolaridad?.lectoescritura ?? "",
        analfabeto: datosSociales.escolaridad?.analfabeto ?? "",
        educacion_basica: datosSociales.escolaridad?.educacion_basica ?? "",
        educacion_media: datosSociales.escolaridad?.educacion_media ?? "",
        educacion_superior: datosSociales.escolaridad?.educacion_superior ?? "",
      },
    },
    apoderado: doc.apoderado || {},
    antecedentes_medicos: {
      artrosis: !!antecedentes.artrosis,
      cancer: antecedentes.cancer ?? "",
      diabetes_tipo_I: !!antecedentes.diabetes_tipo_I,
      diabetes_tipo_II: !!antecedentes.diabetes_tipo_II,
      glaucoma: !!antecedentes.glaucoma,
      epoc: !!antecedentes.epoc,
      patologia_renal: !!antecedentes.patologia_renal,
      otras_patologias: antecedentes.otras_patologias ?? "",
      detalle_patologia_renal: antecedentes.detalle_patologia_renal ?? "",
    },
    historia_clinica: {
      categoria_residente: historia.categoria_residente ?? "",
      alergias: historia.alergias ?? "",
      examenes: historia.examenes ?? "",
      medicamentos_asociados: historia.medicamentos_asociados ?? "",
      historial_atenciones: Array.isArray(historia.historial_atenciones)
        ? historia.historial_atenciones
        : [],
    },
  };
}

/**
 * Obtener ficha completa por RUT
 * Ahora se lee directo desde /api/residentes/:rut y se normaliza
 */
export const getFichaCompleta = async (rut) => {
  try {
    const res = await api.get(`/api/residentes/${rut}`);
    return normalizarFicha(res.data);
  } catch (error) {
    console.error("❌ Error al obtener ficha:", error);
    throw error.response?.data || new Error("Error al obtener ficha clínica.");
  }
};

/**
 * Helper: armar payload para el backend unificado de residentes
 * 100% alineado con app.py (crear_residente / actualizar_residente)
 */
function buildResidentePayload(ficha) {
  const dp = ficha.datos_personales || {};
  const ds = ficha.datos_sociales || {};
  const ub = ficha.ubicacion || {};
  const am = ficha.antecedentes_medicos || {};
  const hc = ficha.historia_clinica || {};
  const ap = ficha.apoderado || {};

  return {
    // Campos raiz que el backend usa al crear el documento
    rut: dp.rut,
    nombre: dp.nombre,

    // Puedes agregar mas campos raiz si despues los aprovechas en el backend
    // fecha_nacimiento: dp.fecha_nacimiento,
    // diagnostico: hc.diagnostico || "",
    // medico_tratante: hc.medico_tratante || "",
    // proximo_control: hc.proximo_control || "",

    // Estos son EXACTAMENTE los que espera tu backend:
    datos_personales: {
      rut: dp.rut,
      nombre: dp.nombre,
      fecha_nacimiento: dp.fecha_nacimiento || null,
      edad: dp.edad ?? calcularEdad(dp.fecha_nacimiento),
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
        lectoescritura: ds.escolaridad?.lectoescritura || "",
        analfabeto: ds.escolaridad?.analfabeto || "",
        educacion_basica: ds.escolaridad?.educacion_basica || "",
        educacion_media: ds.escolaridad?.educacion_media || "",
        educacion_superior: ds.escolaridad?.educacion_superior || "",
      },
    },
    apoderado: {
      nombre: ap.nombre || "",
      parentesco: ap.parentesco || "",
      telefono: ap.telefono || "",
      correo: ap.correo || "",
    },
    antecedentes_medicos: {
      artrosis: !!am.artrosis,
      cancer: am.cancer || "",
      diabetes_tipo_I: !!am.diabetes_tipo_I,
      diabetes_tipo_II: !!am.diabetes_tipo_II,
      glaucoma: !!am.glaucoma,
      epoc: !!am.epoc,
      patologia_renal: !!am.patologia_renal,
      otras_patologias: am.otras_patologias || "",
      detalle_patologia_renal: am.detalle_patologia_renal || "",
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
}

/**
 * Crear nueva ficha clinica
 * Ahora TODO se guarda en un solo documento en /api/residentes
 */
export const crearFicha = async (ficha) => {
  try {
    const payload = buildResidentePayload(ficha);
    await api.post("/api/residentes", payload);
    console.log("✅ Ficha/residente creado en modelo unificado");
  } catch (error) {
    console.error("❌ Error al crear ficha completa:", error);
    throw error.response?.data || new Error("Error al crear ficha clínica.");
  }
};

/**
 * Actualizar ficha existente
 * Se actualiza el mismo documento en /api/residentes/:rut
 */
export const updateFicha = async (rut, ficha) => {
  try {
    const rut_residente = rut;
    const payload = buildResidentePayload(ficha);
    await api.put(`/api/residentes/${rut_residente}`, payload);
    console.log("✅ Ficha/residente actualizada en modelo unificado");
  } catch (error) {
    console.error("❌ Error al actualizar ficha completa:", error);
    throw error.response?.data || new Error("Error al actualizar ficha clínica.");
  }
};

/**
 * Eliminar ficha y registros relacionados
 * Ahora basta con borrar el residente (va todo embebido).
 */
export const deleteFicha = async (rut) => {
  try {
    await api.delete(`/api/residentes/${rut}`);
    console.log("✅ Ficha/residente eliminado correctamente");
  } catch (error) {
    console.error("❌ Error al eliminar ficha:", error);
    throw error.response?.data || new Error("Error al eliminar ficha clínica.");
  }
};
