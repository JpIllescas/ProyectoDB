// 4) Page edit: frontend/src/pages/TrackingEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrackingById, updateTracking } from '../api/tracking';
import { getPedidos } from '../api/pedidos';

export default function TrackingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id_pedido: '', ubicacion: '', estado: '', fecha: '' });
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [track, pedData] = await Promise.all([getTrackingById(id), getPedidos()]);
        setFormData({
          id_pedido: track.id_pedido,
          ubicacion: track.ubicacion,
          estado:    track.estado,
          fecha:     track.fecha.replace(' ', 'T')
        });
        setPedidos(pedData);
      } catch {
        setError('Error al cargar registro');
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    await updateTracking(id, {
      id_pedido: parseInt(formData.id_pedido, 10),
      ubicacion: formData.ubicacion,
      estado:    formData.estado,
      fecha:     formData.fecha
    });
    navigate('/tracking');
  };

  if (loading) return <p>Cargando registro...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Editar Tracking #{id}</h1>
      <form onSubmit={handleSubmit}>
        {/* Similar al form de creación pero con valores precargados */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Pedido</label><br />
          <select name="id_pedido" value={formData.id_pedido} onChange={handleChange} required>
            {pedidos.map(p => <option key={p.id_pedido} value={p.id_pedido}># {p.id_pedido}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Ubicación</label><br />
          <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Estado</label><br />
          <input name="estado" value={formData.estado} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Fecha/Hora</label><br />
          <input name="fecha" type="datetime-local" value={formData.fecha} onChange={handleChange} required />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
    );
}
