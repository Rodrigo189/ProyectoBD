// src/services/api.js
import axios from "axios";

// Configura la instancia de Axios apuntando a tu backend Flask
const api = axios.create({
  baseURL: "https://eleam.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true 
});

export default api;