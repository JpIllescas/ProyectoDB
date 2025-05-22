import { useEffect, useState } from 'react';
import { getTracking, crearTracking } from '../api/tracking';

export default function Tracking() {
  const [events, setEvents] = useState([]);
  const [idPedido, setIdPedido] = useState('');
  const [estado, setEstado] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getTracking();
    setEvents(data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await crearTracking({ id_pedido: idPedido, estado, ubicacion });
    setIdPedido(''); setEstado(''); setUbicacion('');
    load();
  };

  return (
    <div>
      <h1>Tracking de Pedidos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID Pedido"
          value={idPedido}
          onChange={e => setIdPedido(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Estado"
          value={estado}
          onChange={e => setEstado(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          onChange={e => setUbicacion(e.target.value)}
          required
        />
        <button type="submit">Registrar Evento</button>
      </form>

      <ul>
        {events.map(ev => (
          <li key={ev.id}>
            Pedido #{ev.id_pedido}: {ev.estado} — {ev.ubicacion} (
            {new Date(ev.timestamp).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
