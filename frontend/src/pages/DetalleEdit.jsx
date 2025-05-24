// 4) Page edit: frontend/src/pages/DetalleEdit.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetalleById, updateDetalle } from '../api/detalles';

export default function DetalleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id_pedido: '', id_producto: '', cantidad: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDetalleById(id);
        setFormData({
          id_pedido: data.id_pedido,
          id_producto: data.id_producto,
          cantidad: data.cantidad
        });
      } catch {
        setError('Error al cargar detalle');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateDetalle(id, {
        id_pedido:  parseInt(formData.id_pedido, 10),
        id_producto: parseInt(formData.id_producto, 10),
        cantidad:    parseInt(formData.cantidad, 10)
      });
      navigate('/detalles');
    } catch {
      alert('Error al actualizar detalle');
    }
  };

  if (loading) return <p>Cargando detalle...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
      <h1>Editar Detalle #{id}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Pedido</label><br />
          <input name="id_pedido" value={formData.id_pedido} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Producto</label><br />
          <input name="id_producto" value={formData.id_producto} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Cantidad</label><br />
          <input name="cantidad" type="number" value={formData.cantidad} onChange={handleChange} required />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}