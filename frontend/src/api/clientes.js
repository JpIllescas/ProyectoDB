import axios from 'axios';

const API = import.meta.env.VITE_API_ORACLE;

export const getClientes = async () => {
  const res = await axios.get(`${API}/clientes`);
  return res.data;
};

export const crearCliente = async (data) => {
  const res = await axios.post(`${API}/clientes`, data);
  return res.data;
};