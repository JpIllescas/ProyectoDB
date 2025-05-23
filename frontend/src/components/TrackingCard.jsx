// frontend/src/components/TrackingCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTracking } from '../api/tracking';

export default function TrackingCard({ record, onDelete }) {
  const navigate = useNavigate();
  // Aceptamos id_tracking o id como fallback:
  const id_tracking = record.id_tracking ?? record.id;
  const { id_pedido, ubicacion, estado, fecha } = record;

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar tracking #${id_tracking}?`)) return;
    try {
      await deleteTracking(id_tracking);
      onDelete(id_tracking);
    } catch (error) {
      console.error('Error eliminando tracking:', error);
      alert('No se pudo eliminar el registro de tracking.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <h2>Tracking #{id_tracking}</h2>
      <p><strong>Pedido ID:</strong> {id_pedido}</p>
      <p><strong>Ubicación:</strong> {ubicacion}</p>
      <p><strong>Estado:</strong> {estado}</p>
      <p><strong>Fecha/Hora:</strong> {fecha ? new Date(fecha).toLocaleString() : ''}</p>
      <div style={{ marginTop: '0.5rem' }}>
        <button style={{ marginRight: '0.5rem' }} onClick={() => navigate(`/tracking/editar/${id_tracking}`)}>Editar</button>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
}
