// 4) Página edit: frontend/src/pages/ProductoEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, updateProducto } from '../api/productos';

export default function ProductoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', precio: '', stock: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id);
        setFormData({ nombre: data.nombre, precio: data.precio, stock: data.stock });
      } catch {
        setError('Error al cargar producto');
      } finally { setLoading(false); }
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
      await updateProducto(id, { nombre: formData.nombre, precio: parseFloat(formData.precio), stock: parseInt(formData.stock, 10) });
      navigate('/productos');
    } catch {
      setError('Error al actualizar producto');
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
      <h1>Editar Producto</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Nombre</label><br />
          <input name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Precio</label><br />
          <input name="precio" value={formData.precio} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Stock</label><br />
          <input name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar Cambios</button>
      </form>
    </div>
  );
}

