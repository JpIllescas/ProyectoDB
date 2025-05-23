// 1) API: frontend/src/api/pedidos.js
// Funciones para manejar llamadas al microservicio de pedidos.
const BASE = import.meta.env.VITE_API_MYSQL;

export async function getPedidos() {
  const res = await fetch(`${BASE}/pedidos`);
  if (!res.ok) throw new Error('Error al obtener pedidos');
  return res.json();
}

export async function getPedidoById(id) {
  const res = await fetch(`${BASE}/pedidos/${id}`);
  if (!res.ok) throw new Error('Error al obtener el pedido');
  return res.json();
}

export async function createPedido(pedido) {
  const res = await fetch(`${BASE}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  if (!res.ok) throw new Error('Error al crear pedido');
  return res.json();
}

export async function updatePedido(id, pedido) {
  const res = await fetch(`${BASE}/pedidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  if (!res.ok) throw new Error('Error al actualizar pedido');
  return res.json();
}

export async function deletePedido(id) {
  const res = await fetch(`${BASE}/pedidos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar pedido');
  return res.json();
}

