const BASE = import.meta.env.VITE_API_COCKROACH;

async function handleResponse(res) {
  if (!res.ok) {
    let err = 'Error HTTP ' + res.status;
    try {
      const body = await res.json();
      if (body.error) err = body.error;
    } catch {}
    throw new Error(err);
  }
  // DELETE returns no body
  if (res.status === 204 || res.status === 200 && res.headers.get('Content-Length') === '0') return;
  return res.json();
}

export function getTrackings() {
  return fetch(`${BASE}/tracking`).then(handleResponse);
}

export function getTrackingById(id) {
  return fetch(`${BASE}/tracking/${id}`).then(handleResponse);
}

export function createTracking(record) {
  return fetch(`${BASE}/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  }).then(handleResponse);
}

export function updateTracking(id, record) {
  return fetch(`${BASE}/tracking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  }).then(handleResponse);
}

export function deleteTracking(id) {
  return fetch(`${BASE}/tracking/${id}`, {
    method: 'DELETE',
  }).then(handleResponse);
}
