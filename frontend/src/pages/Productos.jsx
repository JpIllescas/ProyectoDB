// 3) Página list/create: frontend/src/pages/Productos.jsx
import React, { useEffect, useState } from 'react';
import { getProductos, createProducto } from '../api/productos';
import ProductoCard from '../components/ProductoCard';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', precio: '', stock: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      setProductos(data);
    } catch {
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = (id) => setProductos(prev => prev.filter(p => p.id_producto !== id));

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createProducto({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock, 10)
      });
      setFormData({ nombre: '', precio: '', stock: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al crear producto');
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Productos</h1>
      <button style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }} onClick={() => setShowForm(v => !v)}>
        {showForm ? 'Cancelar' : 'Crear Producto'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
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
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar</button>
        </form>
      )}

      {productos.length === 0 ? <p>No hay productos registrados.</p> : productos.map(producto => (
        <ProductoCard key={producto.id_producto} producto={producto} onDelete={handleDelete} />
      ))}
    </div>
  );
}

