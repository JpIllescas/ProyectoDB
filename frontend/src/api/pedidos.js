import axios from 'axios';

const API = import.meta.env.VITE_API_ORACLE;

export const getPedidos = async () => {
  const res = await axios.get(`${API}/pedidos`);
  return res.data;
};

export const crearPedidos = async (data) => {
  const res = await axios.post(`${API}/pedidos`, data);
  return res.data;
};