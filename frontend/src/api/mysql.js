// API para consultar datos de MySQL (solo lectura)
const BASE = import.meta.env.VITE_API_MYSQL 

export async function getMySQLClientes() {
  const res = await fetch(`${BASE}/clientes`)
  if (!res.ok) throw new Error("Error al obtener clientes de MySQL")
  return res.json()
}

export async function getMySQLProductos() {
  const res = await fetch(`${BASE}/productos`)
  if (!res.ok) throw new Error("Error al obtener productos de MySQL")
  return res.json()
}

export async function getMySQLPedidos() {
  const res = await fetch(`${BASE}/pedidos`)
  if (!res.ok) throw new Error("Error al obtener pedidos de MySQL")
  return res.json()
}

export async function getMySQLDetalles() {
  const res = await fetch(`${BASE}/detalle_pedido`)
  if (!res.ok) throw new Error("Error al obtener detalles de MySQL")
  return res.json()
}

export async function getMySQLStats() {
  try {
    const [clientes, productos, pedidos, detalles] = await Promise.all([
      getMySQLClientes(),
      getMySQLProductos(),
      getMySQLPedidos(),
      getMySQLDetalles(),
    ])

    return {
      clientes: clientes.length,
      productos: productos.length,
      pedidos: pedidos.length,
      detalles: detalles.length,
      valorInventario: productos.reduce((sum, p) => sum + (p.precio * p.stock || 0), 0),
      stockBajo: productos.filter((p) => p.stock < 10).length,
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas de MySQL:", error)
    return {
      clientes: 0,
      productos: 0,
      pedidos: 0,
      detalles: 0,
      valorInventario: 0,
      stockBajo: 0,
    }
  }
}
