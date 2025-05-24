// File: frontend/src/pages/Tracking.jsx
import React, { useState, useEffect } from 'react';
import { getTrackings, createTracking } from '../api/tracking';
import { getPedidos } from '../api/pedidos';
import { getClientes } from '../api/clientes';
import TrackingCard from '../components/TrackingCard';

export default function Tracking() {
  const [records, setRecords] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_pedido: '',
    id_cliente: '',
    estado: '',
    ubicacion: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trk, ped, cli] = await Promise.all([
        getTrackings(),
        getPedidos(),
        getClientes()
      ]);
      setRecords(trk);
      setPedidos(ped);
      setClientes(cli);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = id => setRecords(rs => rs.filter(r => r.id !== id));

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Enviando:', formData);
      await createTracking(formData);
      setFormData({ id_pedido: '', id_cliente: '', estado: '', ubicacion: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error('Error creando:', err);
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tracking</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => setShowForm(s => !s)}
      >{showForm ? 'Cancelar' : 'Nuevo Registro'}</button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded shadow">
          <div className="mb-2">
            <label>Pedido</label>
            <select
              name="id_pedido"
              value={formData.id_pedido}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione pedido</option>
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
              <option value="">Seleccione cliente</option>
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
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
        </form>
      )}

      {records.length === 0 ? <p>No hay registros</p> : records.map(r => (
        <TrackingCard key={r.id} record={r} onDelete={handleDelete} />
      ))}
    </div>
  );
}