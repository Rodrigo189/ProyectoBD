// src/services/fichaService.js
import api from "./api";

// -------------------------------------------------------------
//  NORMALIZADOR: adapta el JSON REAL del backend al formato del frontend
// -------------------------------------------------------------
function calcularEdad(fechaStr) {
  if (!fechaStr) return null;
  const hoy = new Date();
  const f = new Date(fechaStr);
  let edad = hoy.getFullYear() - f.getFullYear();
  const m = hoy.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) edad--;
  return edad;
}

function normalizarFicha(doc) {
  return {
    rut_residente: doc.rut,
    
    datos_personales: {
      rut: doc.rut,
      nombre: doc.nombre,
      fecha_nacimiento: doc.fecha_nacimiento || "",
      edad: calcularEdad(doc.fecha_nacimiento),
      sexo: doc.sexo || "",
      peso: doc.peso || "",
      prevision_salud: doc.prevision_salud || "",
      prevision_social: doc.prevision_social || "",
      direccion_actual: doc.direccion || "",
    },

    ubicacion: doc.ficha_clinica?.ubicacion || {},

    datos_sociales: doc.ficha_clinica?.datos_sociales || {},

    antecedentes_medicos: doc.ficha_clinica?.antecedentes_medicos || {},

    historia_clinica: doc.ficha_clinica?.historia_clinica || {},

    apoderado: doc.apoderado || {},
  };
}

// -------------------------------------------------------------
//  GET ficha
// -------------------------------------------------------------
export const getFichaCompleta = async (rut) => {
  const res = await api.get(`/api/residentes/${rut}`);
  return normalizarFicha(res.data);
};

// -------------------------------------------------------------
//  CREATE ficha
// -------------------------------------------------------------
export const crearFicha = async (ficha) => {
  await api.post("/api/residentes", ficha);
};

// -------------------------------------------------------------
//  UPDATE ficha
// -------------------------------------------------------------
export const updateFicha = async (rut, ficha) => {
  await api.put(`/api/residentes/${rut}`, ficha);
};

// -------------------------------------------------------------
//  DELETE ficha
// -------------------------------------------------------------
export const deleteFicha = async (rut) => {
  await api.delete(`/api/residentes/${rut}`);
};
