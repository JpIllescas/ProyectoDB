import { useEffect, useState } from 'react';
import { getPedidos, crearPedidos } from '../api/pedidos';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [estado, setEstado] = useState('');
  const [idCliente, setIdCliente] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await crearPedidos({ estado, id_cliente: idCliente });
    setEstado(''); setIdCliente('');
    load();
  };

  return (
    <div>
      <h1>Pedidos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Estado"
          value={estado}
          onChange={e => setEstado(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID Cliente"
          value={idCliente}
          onChange={e => setIdCliente(e.target.value)}
          required
        />
        <button type="submit">Crear Pedido</button>
      </form>

      <ul>
        {pedidos.map(p => (
          <li key={p.id_pedido}>
            Pedido #{p.id_pedido}: {p.estado} — Cliente: {p.id_cliente}
          </li>
        ))}
      </ul>
    </div>
  );
}
