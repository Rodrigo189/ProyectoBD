// src/services/api.js (Corregido)
import axios from "axios";

// --- CORRECCIÓN ---
// Volvemos a añadir la URL de tu backend
const api = axios.create({
  baseURL: "http://127.0.0.1:5001", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // Esto es bueno para la gestión de sesiones
});
// --- FIN CORRECCIÓN ---

export default api;