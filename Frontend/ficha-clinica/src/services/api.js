import axios from "axios";

// ✅ URL base del backend Flask
const api = axios.create({
  baseURL: "http://127.0.0.1:5001", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
