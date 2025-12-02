// src/services/api.js
import axios from "axios";

// Configura la instancia de Axios apuntando a tu backend Flask
const api = axios.create({
  baseURL: "http://127.0.0.1:5001", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true 
});

export default api;