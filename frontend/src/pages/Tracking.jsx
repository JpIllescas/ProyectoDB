// frontend/src/pages/Tracking.jsx
import React, { useState, useEffect } from 'react';
import { getTrackings, createTracking } from '../api/tracking';
import { getPedidos } from '../api/pedidos';
import TrackingCard from '../components/TrackingCard';

export default function Tracking() {
  const [records, setRecords] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id_pedido: '', ubicacion: '', estado: '', fecha: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trkData, pedData] = await Promise.all([getTrackings(), getPedidos()]);
      setRecords(trkData);
      setPedidos(pedData);
    } catch {
      setError('Error al cargar tracking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = id => setRecords(prev => prev.filter(r => (r.id_tracking ?? r.id) !== id));
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createTracking({
        id_pedido: parseInt(formData.id_pedido, 10),
        ubicacion: formData.ubicacion,
        estado: formData.estado,
        fecha: formData.fecha
      });
      setShowForm(false);
      setFormData({ id_pedido: '', ubicacion: '', estado: '', fecha: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al crear registro de tracking');
    }
  };

  if (loading) return <p>Cargando tracking...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '1rem' }}>
      <h1>Tracking Pedidos</h1>
      <button style={{ marginBottom: '1rem' }} onClick={() => setShowForm(v => !v)}>
        {showForm ? 'Cancelar' : 'Nuevo Registro'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Pedido</label><br/>
            <select name="id_pedido" value={formData.id_pedido} onChange={handleChange} required>
              <option value="">Seleccione Pedido</option>
              {pedidos.map(p => (
                <option key={p.id_pedido} value={p.id_pedido}># {p.id_pedido}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Ubicación</label><br/>
            <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Estado</label><br/>
            <input name="estado" value={formData.estado} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Fecha/Hora</label><br/>
            <input name="fecha" type="datetime-local" value={formData.fecha} onChange={handleChange} required />
          </div>
          <button type="submit">Guardar Registro</button>
        </form>
      )}
      {records.length === 0 ? (
        <p>No hay registros de tracking.</p>
      ) : (
        records.map(r => {
          const key = r.id_tracking ?? r.id;
          return <TrackingCard key={key} record={r} onDelete={handleDelete} />;
        })
      )}
    </div>
  );
}