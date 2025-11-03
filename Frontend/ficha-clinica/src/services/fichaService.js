import api from "./api";

/**
 * 🔹 Obtener ficha completa por RUT
 */
export const getFichaCompleta = async (rut) => {
  try {
    const res = await api.get(`/api/fichas/${rut}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener ficha:", error);
    throw error.response?.data || new Error("Error al obtener ficha clínica.");
  }
};

/**
 * 🔹 Crear nueva ficha clínica
 */
export const crearFicha = async (ficha) => {
  try {
    const res = await api.post("/api/fichas", ficha);
    return res.data;
  } catch (error) {
    console.error("❌ Error al crear ficha:", error);
    throw error.response?.data || new Error("Error al crear ficha clínica.");
  }
};

/**
 * 🔹 Actualizar ficha existente
 */
export const updateFicha = async (rut, data) => {
  try {
    const res = await api.put(`/api/fichas/${rut}`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Error al actualizar ficha:", error);
    throw error.response?.data || new Error("Error al actualizar ficha clínica.");
  }
};

/**
 * 🔹 Eliminar ficha por RUT
 */
export const deleteFicha = async (rut) => {
  try {
    const res = await api.delete(`/api/fichas/${rut}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error al eliminar ficha:", error);
    throw error.response?.data || new Error("Error al eliminar ficha clínica.");
  }
};
