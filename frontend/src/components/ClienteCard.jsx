/*
3) ClienteCard.jsx - cambiar onEdit para navegar
*/

// frontend/src/components/ClienteCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCliente } from '../api/clientes';

export default function ClienteCard({ cliente, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar cliente ${cliente.nombre}?`)) return;
    try {
      await deleteCliente(cliente.id_cliente);
      onDelete(cliente.id_cliente);
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      alert('No se pudo eliminar el cliente. ¿Tiene pedidos asociados?');
    }
  };
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h2 style={{ margin: 0 }}>{cliente.nombre}</h2>
      <p><strong>Email:</strong> {cliente.email}</p>
      <p><strong>Teléfono:</strong> {cliente.telefono}</p>
      <div>
        <button
          style={{ marginRight: '0.5rem' }}
          onClick={() => navigate(`/clientes/editar/${cliente.id_cliente}`)}
        >Editar</button>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
}
