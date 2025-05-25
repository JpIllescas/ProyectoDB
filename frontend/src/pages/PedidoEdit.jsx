"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPedidoById, updatePedido } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import { ShoppingCart, User, Calendar, Package, Save, ArrowLeft, Loader } from "lucide-react"

export default function PedidoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ cliente_id: "", fecha: "", estado: "" })
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [pedido, cliData] = await Promise.all([getPedidoById(id), getClientes()])
        setFormData({
          cliente_id: pedido.id_cliente,
          fecha: pedido.fecha.split("T")[0],
          estado: pedido.estado,
        })
        setClientes(cliData)
      } catch {
        setError("Error al cargar datos del pedido")
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
      await updatePedido(id, {
        id_cliente: Number.parseInt(formData.cliente_id, 10),
        fecha: formData.fecha,
        estado: formData.estado,
      })
      navigate("/pedidos")
    } catch {
      setError("Error al actualizar pedido")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#6366f1" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando pedido...</span>
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
            <ShoppingCart style={{ width: "32px", height: "32px", color: "#dc2626" }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>Error</h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={() => navigate("/pedidos")} className="btn-primary-modern">
            Volver a Pedidos
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
              onClick={() => navigate("/pedidos")}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Volver</span>
            </button>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>Editar Pedido #{id}</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Actualiza la información del pedido</p>
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
                background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart style={{ width: "20px", height: "20px", color: "#6366f1" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Información del Pedido</h3>
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
                  <User style={{ width: "16px", height: "16px" }} />
                  <span>Cliente</span>
                </label>
                <select
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleChange}
                  required
                  className="form-modern"
                >
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre}
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
                  <span>Estado</span>
                </label>
                <select name="estado" value={formData.estado} onChange={handleChange} required className="form-modern">
                  <option>Pendiente</option>
                  <option>Enviado</option>
                  <option>Entregado</option>
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
                <Calendar style={{ width: "16px", height: "16px" }} />
                <span>Fecha</span>
              </label>
              <input
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="form-modern"
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
              <button type="button" onClick={() => navigate("/pedidos")} className="btn-secondary-modern">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
