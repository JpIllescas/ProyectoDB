"use client"

import { useEffect, useState } from "react"
import { getProductos, createProducto } from "../api/productos"
import ProductoCard from "../components/ProductoCard"
import { Package, Plus, Search, TrendingUp, DollarSign, Archive, Loader } from "lucide-react"

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ nombre: "", precio: "", stock: "" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductos()
      setProductos(data)
      setFilteredProductos(data)
    } catch (err) {
      setError("Error al cargar los productos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = productos.filter((producto) => producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredProductos(filtered)
  }, [searchTerm, productos])

  const handleDelete = (id) => {
    setProductos((prev) => prev.filter((p) => p.id_producto !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createProducto({
        nombre: formData.nombre,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock, 10),
      })
      setFormData({ nombre: "", precio: "", stock: "" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error(err)
      alert("Error al crear producto")
    }
  }

  // Calcular estadísticas
  const totalProductos = productos.length
  const valorInventario = productos.reduce((sum, p) => sum + p.precio * p.stock, 0)
  const stockBajo = productos.filter((p) => p.stock < 10).length

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#8b5cf6" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando productos...</span>
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
            <Package style={{ width: "32px", height: "32px", color: "#dc2626" }} />
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
      {/* Header con estadísticas */}
      <div className="stats-grid-modern" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
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
              <Package style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Total Productos</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{totalProductos}</p>
            </div>
          </div>
        </div>

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
              <DollarSign style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Valor Inventario</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>
                ${valorInventario.toLocaleString()}
              </p>
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
              <Archive style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Stock Bajo</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{stockBajo}</p>
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
              <TrendingUp style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Resultados</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>
                {filteredProductos.length}
              </p>
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
                placeholder="Buscar productos por nombre..."
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
              <span>{showForm ? "Cancelar" : "Nuevo Producto"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card-modern animate-fade-in">
          <div className="card-header-modern">
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Crear Nuevo Producto</h3>
          </div>
          <div style={{ padding: "32px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                  Nombre del producto
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-modern"
                  placeholder="Ej: Laptop Dell XPS 13"
                />
              </div>
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
                    Precio
                  </label>
                  <div style={{ position: "relative" }}>
                    <DollarSign
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
                      name="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                      className="form-modern"
                      style={{ paddingLeft: "44px" }}
                      placeholder="0.00"
                    />
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
                    Stock inicial
                  </label>
                  <div style={{ position: "relative" }}>
                    <Archive
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
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="form-modern"
                      style={{ paddingLeft: "44px" }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary-modern">
                  Guardar Producto
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-modern">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredProductos.length === 0 ? (
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
                <Package style={{ width: "32px", height: "32px", color: "#9ca3af" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
              </p>
              {!searchTerm && (
                <button onClick={() => setShowForm(true)} className="btn-primary-modern">
                  Crear Primer Producto
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredProductos.map((producto) => (
            <ProductoCard key={producto.id_producto} producto={producto} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}
