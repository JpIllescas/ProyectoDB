// File: frontend/src/components/TrackingCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTracking } from '../api/tracking';

export default function TrackingCard({ record, onDelete }) {
  const navigate = useNavigate();
  const { id, id_pedido, id_cliente, estado, ubicacion, timestamp } = record;

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar registro #${id}?`)) return;
    try {
      await deleteTracking(id);
      onDelete(id);
    } catch (err) {
      console.error('Error eliminando:', err);
      alert(err.message);
    }
  };

  return (
    <div className="border p-4 rounded mb-4 shadow">
      <h3 className="text-lg font-semibold">Registro #{id}</h3>
      <p><strong>Pedido:</strong> {id_pedido}</p>
      <p><strong>Cliente:</strong> {id_cliente}</p>
      <p><strong>Estado:</strong> {estado}</p>
      <p><strong>Ubicación:</strong> {ubicacion}</p>
      <p><strong>Fecha:</strong> {new Date(timestamp).toLocaleString()}</p>
      <div className="mt-2 space-x-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => navigate(`/tracking/editar/${id}`)}
        >Editar</button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={handleDelete}
        >Eliminar</button>
      </div>
    </div>
  );
}
