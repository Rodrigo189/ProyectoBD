import api from './api';

export const getFichaCompleta = async (rut) => {
  const res = await api.get(`/ficha/${rut}`);
  return res.data;
};

export const crearFicha = async (ficha) => {
  const response = await api.post("/api/fichas", ficha);
  return response.data;
};


export const updateFicha = async (rut, data) => {
  const res = await api.put(`/fichas/${rut}`, data);
  return res.data;
};
