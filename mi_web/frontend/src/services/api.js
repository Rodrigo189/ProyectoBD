import axios from 'axios';

// URL de tu Backend en Render
const BASE_URL = 'https://clinica-eleam.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;