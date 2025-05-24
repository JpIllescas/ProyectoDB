import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrackingById, updateTracking } from '../api/tracking';
import { getPedidos } from '../api/pedidos';
import { getClientes } from '../api/clientes';

export default function TrackingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_pedido: '',
    id_cliente: '',
    estado: '',
    ubicacion: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [trk, ped, cli] = await Promise.all([
          getTrackingById(id),
          getPedidos(),
          getClientes()
        ]);
        setFormData({
          id_pedido: trk.id_pedido,
          id_cliente: trk.id_cliente,
          estado: trk.estado,
          ubicacion: trk.ubicacion
        });
        setPedidos(ped);
        setClientes(cli);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateTracking(id, formData);
      navigate('/tracking');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Tracking #{id}</h1>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-2">
          <label>Pedido</label>
          <select
            name="id_pedido"
            value={formData.id_pedido}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            {pedidos.map(p => (
              <option key={p.id_pedido} value={p.id_pedido}>#{p.id_pedido}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Cliente</label>
          <select
            name="id_cliente"
            value={formData.id_cliente}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Estado</label>
          <input
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Ubicación</label>
          <input
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar Cambios</button>
      </form>
    </div>
  );
}