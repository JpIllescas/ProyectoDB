"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDetalleById, updateDetalle } from "../api/detalles"
import { getProductos } from "../api/productos"
import { getPedidos } from "../api/pedidos"
import { FileText, ShoppingCart, Package, Hash, Save, ArrowLeft, Loader } from "lucide-react"

export default function DetalleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ id_pedido: "", id_producto: "", cantidad: "" })
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [data, prodData, pedData] = await Promise.all([getDetalleById(id), getProductos(), getPedidos()])
        setFormData({
          id_pedido: data.id_pedido,
          id_producto: data.id_producto,
          cantidad: data.cantidad,
        })
        setProductos(prodData)
        setPedidos(pedData)
      } catch {
        setError("Error al cargar detalle")
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
      await updateDetalle(id, {
        id_pedido: Number.parseInt(formData.id_pedido, 10),
        id_producto: Number.parseInt(formData.id_producto, 10),
        cantidad: Number.parseInt(formData.cantidad, 10),
      })
      navigate("/detalles")
    } catch {
      setError("Error al actualizar detalle")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#10b981" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando detalle...</span>
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
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>Error</h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={() => navigate("/detalles")} className="btn-primary-modern">
            Volver a Detalles
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
              onClick={() => navigate("/detalles")}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Volver</span>
            </button>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>Editar Detalle #{id}</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Actualiza la información del detalle</p>
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
                background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText style={{ width: "20px", height: "20px", color: "#10b981" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
              Información del Detalle
            </h3>
          </div>
        </div>
        <div style={{ padding: "32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                  <ShoppingCart style={{ width: "16px", height: "16px" }} />
                  <span>Pedido</span>
                </label>
                <select
                  name="id_pedido"
                  value={formData.id_pedido}
                  onChange={handleChange}
                  required
                  className="form-modern"
                >
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
                  <span>Producto</span>
                </label>
                <select
                  name="id_producto"
                  value={formData.id_producto}
                  onChange={handleChange}
                  required
                  className="form-modern"
                >
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
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                <Hash style={{ width: "16px", height: "16px" }} />
                <span>Cantidad</span>
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
              <button type="button" onClick={() => navigate("/detalles")} className="btn-secondary-modern">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
