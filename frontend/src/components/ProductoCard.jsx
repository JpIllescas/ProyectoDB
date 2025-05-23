// 2) Componente: frontend/src/components/ProductoCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProducto } from '../api/productos';

export default function ProductoCard({ producto, onDelete }) {
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar producto ${producto.nombre}?`)) return;
    try {
      await deleteProducto(producto.id_producto);
      onDelete(producto.id_producto);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('No se pudo eliminar el producto.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <h2 style={{ margin: 0 }}>{producto.nombre}</h2>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>
      <div style={{ marginTop: '0.5rem' }}>
        <button
          style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={() => navigate(`/productos/editar/${producto.id_producto}`)}
        >Editar</button>
        <button
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={handleDelete}
        >Eliminar</button>
      </div>
    </div>
  );
}

