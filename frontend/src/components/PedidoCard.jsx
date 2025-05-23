// 2) Componente: frontend/src/components/PedidoCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePedido } from '../api/pedidos';

export default function PedidoCard({ pedido, onDelete }) {
  const navigate = useNavigate();
  // Desestructuramos y garantizamos fallback
  const {
    id_pedido,
    cliente = { nombre: 'Cliente no encontrado' },
    fecha,
    estado
  } = pedido || {};

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar pedido #${id_pedido}?`)) return;
    try {
      await deletePedido(id_pedido);
      onDelete(id_pedido);
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      alert('No se pudo eliminar el pedido.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <h2>Pedido #{id_pedido}</h2>
      <p><strong>Cliente:</strong> {cliente.nombre}</p>
      <p><strong>Fecha:</strong> {fecha ? new Date(fecha).toLocaleDateString() : ''}</p>
      <p><strong>Estado:</strong> {estado}</p>
      <div style={{ marginTop: '0.5rem' }}>
        <button style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={() => navigate(`/pedidos/editar/${id_pedido}`)}>
          Editar
        </button>
        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

