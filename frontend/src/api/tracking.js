// frontend/src/api/tracking.js
// Ajustamos BASE al microservicio correcto (Cockroach):
const BASE = import.meta.env.VITE_API_COCKROACH;

export async function getTrackings() {
  const res = await fetch(`${BASE}/tracking`);
  if (!res.ok) throw new Error('Error al obtener tracking');
  return res.json();
}

export async function getTrackingById(id) {
  const res = await fetch(`${BASE}/tracking/${id}`);
  if (!res.ok) throw new Error('Error al obtener el registro de tracking');
  return res.json();
}

export async function createTracking(record) {
  const res = await fetch(`${BASE}/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Error al crear registro de tracking');
  return res.json();
}

export async function updateTracking(id, record) {
  const res = await fetch(`${BASE}/tracking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Error al actualizar registro de tracking');
  return res.json();
}

export async function deleteTracking(id) {
  const res = await fetch(`${BASE}/tracking/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar registro de tracking');
  // no JSON si backend responde 204
  return;
}