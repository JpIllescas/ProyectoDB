// 3) Page list/create: frontend/src/pages/Detalles.jsx
import React, { useEffect, useState } from 'react';
import { getProductos } from '../api/productos';
import { getDetalles, createDetalle } from '../api/detalles';
import DetalleCard from '../components/DetalleCard';

export default function Detalles() {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id_pedido: '', id_producto: '', cantidad: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, prodData] = await Promise.all([
        getDetalles(),
        getProductos()
      ]);
      // Enriquecer cada detalle con datos de producto
      const enriched = data.map(d => ({
        ...d,
        producto: prodData.find(p => p.id_producto === d.id_producto) || { nombre: 'Desconocido' }
      }));
      setDetalles(enriched);
    } catch {
      setError('Error cargando detalles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = id => setDetalles(prev => prev.filter(d => d.id_detalle !== id));
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createDetalle({
        id_pedido:  parseInt(formData.id_pedido, 10),
        id_producto: parseInt(formData.id_producto, 10),
        cantidad:    parseInt(formData.cantidad, 10)
      });
      setFormData({ id_pedido: '', id_producto: '', cantidad: '' });
      setShowForm(false);
      fetchData();
    } catch {
      alert('Error al crear detalle');
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Detalle de Pedidos</h1>
      <button onClick={() => setShowForm(v => !v)} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Cancelar' : 'Nuevo Detalle'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
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
          <button type="submit">Guardar</button>
        </form>
      )}

      {detalles.length === 0
        ? <p>No hay detalles registrados.</p>
        : detalles.map(d => (
            <DetalleCard key={d.id_detalle} detalle={d} onDelete={handleDelete} />
          ))}
    </div>
  );
}