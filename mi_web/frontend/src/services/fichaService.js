import api from "./api";

// Función para limpiar el RUT
const normalizarRut = (rut) => {
  if (!rut) return "";
  return rut.toString().trim().replace(/\./g, "").toUpperCase();
};

// Adaptador: Convierte los datos del Backend al formato del Frontend
const adaptarDesdeBackend = (doc) => {
  if (!doc) return null;

  // Intentamos leer datos planos (formato nuevo) o anidados (formato viejo)
  const nested = doc.ficha_clinica || {};
  const datos_sociales = doc.datos_sociales || nested.datos_sociales || {};
  const antecedentes = doc.antecedentes_medicos || nested.antecedentes_medicos || {};
  const ubicacion = doc.ubicacion || nested.ubicacion || {};
  const historia = doc.historia_clinica || nested.historia_clinica || {};
  const apoderado = doc.apoderado || {};
  
  // Datos personales pueden venir en la raíz o en un objeto
  const dp_source = doc.datos_personales || doc; 

  return {
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
    ubicacion: {
      habitacion: ubicacion.habitacion || "",
      ingresa_desde: ubicacion.ingresa_desde || "",
      motivo_institucionalizacion: ubicacion.motivo_institucionalizacion || "",
    },
    datos_sociales: {
      religion: datos_sociales.religion || "",
      actividad_laboral_previa: datos_sociales.actividad_laboral_previa || "",
      estado_civil: datos_sociales.estado_civil || "",
      vive_solo: !!datos_sociales.vive_solo,
      calidad_apoyo: datos_sociales.calidad_apoyo || "",
      escolaridad: datos_sociales.escolaridad || {
        lectoescritura: "", analfabeto: "", educacion_basica: "",
        educacion_media: "", educacion_superior: ""
      },
    },
    apoderado: {
      nombre: apoderado.nombre || "",
      parentesco: apoderado.parentesco || "",
      telefono: apoderado.telefono || "",
      correo: apoderado.correo || "",
    },
    antecedentes_medicos: {
      diabetes_tipo_I: !!antecedentes.diabetes_tipo_I,
      diabetes_tipo_II: !!antecedentes.diabetes_tipo_II,
      glaucoma: !!antecedentes.glaucoma,
      patologia_renal: !!antecedentes.patologia_renal,
      detalle_patologia_renal: antecedentes.detalle_patologia_renal || "",
      epoc: !!antecedentes.epoc,
      artrosis: !!antecedentes.artrosis,
      cancer: antecedentes.cancer || "",
      otras_patologias: antecedentes.otras_patologias || "",
    },
    historia_clinica: {
      categoria_residente: historia.categoria_residente || "",
      alergias: historia.alergias || "",
      examenes: historia.examenes || "",
      medicamentos_asociados: historia.medicamentos_asociados || "",
      historial_atenciones: historia.historial_atenciones || [],
    },
    // Unificamos medicamentos (backend nuevo + array antiguo)
    medicamentos: Array.isArray(doc.medicamentos) ? doc.medicamentos : [],
    signos_vitales: Array.isArray(doc.signos_vitales) ? doc.signos_vitales : [],
  };
};

// Mapeo inverso: Frontend -> Backend
const mapFichaToBackend = (ficha) => {
  // ... (Esta parte es igual que antes, simplificada aquí) ...
  return { ...ficha, rut: normalizarRut(ficha.datos_personales.rut) };
};

// --- ENDPOINTS CORREGIDOS ---

export const getFichaCompleta = async (rut) => {
  try {
    const rutNorm = normalizarRut(rut);
    // ⚠️ CAMBIO CRÍTICO: Usamos /api/ficha (la ruta nueva unificada)
    const res = await api.get(`/api/ficha/${rutNorm}`);
    return adaptarDesdeBackend(res.data);
  } catch (error) {
    console.error("Error getFichaCompleta:", error);
    throw error;
  }
};

export const crearFicha = async (ficha) => {
  // Usamos /api/residentes para crear (orquestador)
  await api.post("/api/residentes", ficha);
};

export const updateFicha = async (rut, ficha) => {
  await api.post("/api/residentes", ficha);
};

export const deleteFicha = async (rut) => {
  const rutNorm = normalizarRut(rut);
  await api.delete(`/api/residentes/${rutNorm}`);
};

export const listFuncionarios = async () => {
    try {
        const res = await api.get("/api/funcionarios");
        return res.data;
    } catch (e) { return []; }
};