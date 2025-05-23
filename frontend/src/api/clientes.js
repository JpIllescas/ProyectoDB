// frontend/src/api/clientes.js
const BASE = import.meta.env.VITE_API_ORACLE;

export async function getClientes() {
  const res = await fetch(`${BASE}/clientes`);
  if (!res.ok) throw new Error('Error al obtener clientes');
  return res.json();
}

export async function getClienteById(id) {
  const res = await fetch(`${BASE}/clientes/${id}`);
  if (!res.ok) throw new Error('Error al obtener el cliente');
  return res.json();
}

export async function createCliente(cliente) {
  const res = await fetch(`${BASE}/clientes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(cliente),
  });
  if (!res.ok) throw new Error('Error al crear cliente');
  return res.json();
}

export async function updateCliente(id, cliente) {
  const res = await fetch(`${BASE}/clientes/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(cliente),
  });
  if (!res.ok) throw new Error('Error al actualizar cliente');
  return res.json();
}

export async function deleteCliente(id) {
  const res = await fetch(`${BASE}/clientes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar cliente');
  return res.json();
}
