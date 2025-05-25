"use client"

import { useEffect, useState } from "react"
import { getProductos } from "../api/productos"
import { getDetalles, createDetalle } from "../api/detalles"
import { getPedidos } from "../api/pedidos"
import DetalleCard from "../components/DetalleCard"
import { FileText, Plus, Search, ShoppingCart, Hash, Package, Loader } from "lucide-react"

export default function Detalles() {
  const [detalles, setDetalles] = useState([])
  const [filteredDetalles, setFilteredDetalles] = useState([])
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ id_pedido: "", id_producto: "", cantidad: "" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, prodData, pedData] = await Promise.all([getDetalles(), getProductos(), getPedidos()])
      const enriched = data.map((d) => ({
        ...d,
        producto: prodData.find((p) => p.id_producto === d.id_producto) || { nombre: "Producto no encontrado" },
        pedido: pedData.find((p) => p.id_pedido === d.id_pedido) || { id_pedido: d.id_pedido },
      }))
      setDetalles(enriched)
      setFilteredDetalles(enriched)
      setProductos(prodData)
      setPedidos(pedData)
    } catch {
      setError("Error cargando detalles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = detalles.filter(
      (detalle) =>
        detalle.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detalle.id_pedido.toString().includes(searchTerm) ||
        detalle.id_detalle.toString().includes(searchTerm),
    )
    setFilteredDetalles(filtered)
  }, [searchTerm, detalles])

  const handleDelete = (id) => setDetalles((prev) => prev.filter((d) => d.id_detalle !== id))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createDetalle({
        id_pedido: Number.parseInt(formData.id_pedido, 10),
        id_producto: Number.parseInt(formData.id_producto, 10),
        cantidad: Number.parseInt(formData.cantidad, 10),
      })
      setFormData({ id_pedido: "", id_producto: "", cantidad: "" })
      setShowForm(false)
      fetchData()
    } catch {
      alert("Error al crear detalle")
    }
  }

  // Estadísticas REALES calculadas dinámicamente
  const totalDetalles = detalles.length
  const totalUnidades = detalles.reduce((sum, d) => sum + (d.cantidad || 0), 0)
  const pedidosUnicos = new Set(detalles.map((d) => d.id_pedido)).size
  const productosUnicos = new Set(detalles.map((d) => d.id_producto)).size

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#10b981" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando detalles...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-modern">
        <div style={{ padding: "32px", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#fef2f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FileText style={{ width: "32px", height: "32px", color: "#dc2626" }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
            Error al cargar
          </h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={fetchData} className="btn-primary-modern">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Estadísticas REALES */}
      <div className="stats-grid-modern" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat-card-modern">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#10b981",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Total Detalles</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{totalDetalles}</p>
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#3b82f6",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Hash style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Total Unidades</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{totalUnidades}</p>
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#8b5cf6",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Pedidos Únicos</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{pedidosUnicos}</p>
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#f59e0b",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Productos Únicos</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{productosUnicos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="card-modern">
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            className="sm:flex-row sm:items-center sm:justify-between"
          >
            <div style={{ position: "relative", flex: 1, maxWidth: "384px" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  width: "20px",
                  height: "20px",
                }}
              />
              <input
                type="text"
                placeholder="Buscar por producto, pedido o detalle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-modern"
                style={{ paddingLeft: "44px" }}
              />
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Plus style={{ width: "20px", height: "20px" }} />
              <span>{showForm ? "Cancelar" : "Nuevo Detalle"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card-modern animate-fade-in">
          <div className="card-header-modern">
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Crear Nuevo Detalle</h3>
          </div>
          <div style={{ padding: "32px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Pedido
                  </label>
                  <select
                    name="id_pedido"
                    value={formData.id_pedido}
                    onChange={handleChange}
                    required
                    className="form-modern"
                  >
                    <option value="">Seleccione un pedido...</option>
                    {pedidos.map((p) => (
                      <option key={p.id_pedido} value={p.id_pedido}>
                        Pedido #{p.id_pedido}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Producto
                  </label>
                  <select
                    name="id_producto"
                    value={formData.id_producto}
                    onChange={handleChange}
                    required
                    className="form-modern"
                  >
                    <option value="">Seleccione un producto...</option>
                    {productos.map((p) => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Cantidad
                </label>
                <input
                  name="cantidad"
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                  className="form-modern"
                  placeholder="Ej: 5"
                />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary-modern">
                  Guardar Detalle
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-modern">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de detalles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredDetalles.length === 0 ? (
          <div className="card-modern">
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "#f3f4f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <FileText style={{ width: "32px", height: "32px", color: "#9ca3af" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {searchTerm ? "No se encontraron detalles" : "No hay detalles registrados"}
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer detalle"}
              </p>
              {!searchTerm && (
                <button onClick={() => setShowForm(true)} className="btn-primary-modern">
                  Crear Primer Detalle
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredDetalles.map((d) => <DetalleCard key={d.id_detalle} detalle={d} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
