"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductoById, updateProducto } from "../api/productos"
import { Package, DollarSign, Archive, Save, ArrowLeft, Loader } from "lucide-react"

export default function ProductoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nombre: "", precio: "", stock: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id)
        setFormData({ nombre: data.nombre, precio: data.precio, stock: data.stock })
      } catch {
        setError("Error al cargar producto")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProducto(id, {
        nombre: formData.nombre,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock, 10),
      })
      navigate("/productos")
    } catch {
      setError("Error al actualizar producto")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#8b5cf6" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando producto...</span>
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
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>Error</h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={() => navigate("/productos")} className="btn-primary-modern">
            Volver a Productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="card-modern">
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => navigate("/productos")}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Volver</span>
            </button>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>Editar Producto</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Actualiza la información del producto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card-modern">
        <div className="card-header-modern">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package style={{ width: "20px", height: "20px", color: "#8b5cf6" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
              Información del Producto
            </h3>
          </div>
        </div>
        <div style={{ padding: "32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                <Package style={{ width: "16px", height: "16px" }} />
                <span>Nombre del producto</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  <DollarSign style={{ width: "16px", height: "16px" }} />
                  <span>Precio</span>
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
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  <Archive style={{ width: "16px", height: "16px" }} />
                  <span>Stock</span>
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
            <div style={{ display: "flex", gap: "12px", paddingTop: "16px" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary-modern"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {saving ? (
                  <Loader style={{ width: "16px", height: "16px" }} className="animate-spin" />
                ) : (
                  <Save style={{ width: "16px", height: "16px" }} />
                )}
                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
              <button type="button" onClick={() => navigate("/productos")} className="btn-secondary-modern">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
