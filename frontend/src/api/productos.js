const BASE = import.meta.env.VITE_API_ORACLE;

export async function getProductos() {
  const res = await fetch(`${BASE}/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function getProductoById(id) {
  const res = await fetch(`${BASE}/productos/${id}`);
  if (!res.ok) throw new Error('Error al obtener el producto');
  return res.json();
}

export async function createProducto(producto) {
  const res = await fetch(`${BASE}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error('Error al crear producto');
  return res.json();
}

export async function updateProducto(id, producto) {
  const res = await fetch(`${BASE}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return res.json();
}

export async function deleteProducto(id) {
  const res = await fetch(`${BASE}/productos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar producto');
  return res.json();
}