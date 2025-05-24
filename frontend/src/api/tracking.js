// 1) API helper: frontend/src/api/tracking.js
const BASE = import.meta.env.VITE_API_COCKROACH;

export async function getTrackings() {
  const res = await fetch(`${BASE}/tracking`);
  if (!res.ok) throw new Error('Error al obtener trackings');
  return res.json();
}

export async function getTrackingById(id) {
  const res = await fetch(`${BASE}/tracking/${id}`);
  if (!res.ok) throw new Error('Error al obtener registro');
  return res.json();
}

export async function createTracking(record) {
  const res = await fetch(`${BASE}/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Error al crear registro');
  return res.json();
}

export async function updateTracking(id, record) {
  const res = await fetch(`${BASE}/tracking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Error al actualizar registro');
  return res.json();
}

export async function deleteTracking(id) {
  const res = await fetch(`${BASE}/tracking/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar registro');
}
