// 1) API: frontend/src/api/detalles.js
const BASE = import.meta.env.VITE_API_ORACLE;

export async function getDetalles() {
  const res = await fetch(`${BASE}/detalle_pedido`);
  if (!res.ok) throw new Error('Error al obtener detalles');
  return res.json();
}

export async function getDetalleById(id) {
  const res = await fetch(`${BASE}/detalle_pedido/${id}`);
  if (!res.ok) throw new Error('Error al obtener detalle');
  return res.json();
}

export async function createDetalle(detalle) {
  const res = await fetch(`${BASE}/detalle_pedido`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_pedido: detalle.id_pedido,
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad
    }),
  });
  if (!res.ok) throw new Error('Error al crear detalle');
  return res.json();
}

export async function updateDetalle(id, detalle) {
  const res = await fetch(`${BASE}/detalle_pedido/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_detalle: id,
      id_pedido: detalle.id_pedido,
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad
    }),
  });
  if (!res.ok) throw new Error('Error al actualizar detalle');
  return res.json();
}