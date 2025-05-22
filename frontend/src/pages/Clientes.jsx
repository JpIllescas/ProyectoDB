// Archivo: frontend/src/pages/Clientes.jsx
import { useEffect, useState } from 'react';
import { getClientes } from '../api/clientes';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getClientes();
      setClientes(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Clientes</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id_cliente}>
            {cliente.nombre} - {cliente.email} - {cliente.telefono}
          </li>
        ))}
      </ul>
    </div>
  );
}