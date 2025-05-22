import axios from 'axios';

const API = import.meta.env.VITE_API_ORACLE;

export const getProductos = async () => {
  const res = await axios.get(`${API}/productos`);
  return res.data;
};

export const crearProducto = async (data) => {
  const res = await axios.post(`${API}/productos`, data);
  return res.data;
};