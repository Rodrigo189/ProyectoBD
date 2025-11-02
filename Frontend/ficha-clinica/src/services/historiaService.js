import api from './api';

export const getHistoriaClinica = async (rut) => {
  const res = await api.get(`/historia/${rut}`);
  return res.data;
};
