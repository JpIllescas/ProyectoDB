// 2) Component: frontend/src/components/DetalleCard.jsx
// 2) Component: frontend/src/components/DetalleCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DetalleCard({ detalle}) {
  const navigate = useNavigate();
  const { id_detalle, id_pedido, id_producto, cantidad } = detalle;


return (
    <div style={{ border: '1px solid #ccc', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <h2 style={{ margin: 0 }}>Detalle #{id_detalle}</h2>
      <p><strong>Pedido:</strong> {id_pedido}</p>
      <p><strong>Producto:</strong> {detalle.producto.nombre} <small>(ID {detalle.id_producto})</small></p>
      <p><strong>Cantidad:</strong> {cantidad}</p>
      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={() => navigate(`/detalles/editar/${id_detalle}`)} style={{ marginRight: '0.5rem' }}>
          Editar
        </button>
      </div>
    </div>
  );
}
