import axios from 'axios';

const API = import.meta.env.VITE_API_COCKROACH;

export const getTracking = async () => {
  const res = await axios.get(`${API}/tracking`);
  return res.data;
};

export const crearTracking = async (data) => {
  const res = await axios.post(`${API}/tracking`, data);
  return res.data;
};