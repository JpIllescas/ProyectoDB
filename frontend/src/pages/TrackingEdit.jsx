"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTrackingById, updateTracking } from "../api/tracking"
import { getPedidos } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import { MapPin, ShoppingCart, User, Navigation, Save, ArrowLeft, Loader } from "lucide-react"

export default function TrackingEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id_pedido: "",
    id_cliente: "",
    estado: "",
    ubicacion: "",
  })
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [trk, ped, cli] = await Promise.all([getTrackingById(id), getPedidos(), getClientes()])
        setFormData({
          id_pedido: trk.id_pedido,
          id_cliente: trk.id_cliente,
          estado: trk.estado,
          ubicacion: trk.ubicacion,
        })
        setPedidos(ped)
        setClientes(cli)
      } catch (err) {
        console.error(err)
        setError("Error al cargar registro de tracking")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((fd) => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateTracking(id, formData)
      navigate("/tracking")
    } catch (err) {
      console.error(err)
      setError("Error al actualizar registro")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#f59e0b" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando registro...</span>
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
            <MapPin style={{ width: "32px", height: "32px", color: "#dc2626" }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>Error</h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={() => navigate("/tracking")} className="btn-primary-modern">
            Volver a Tracking
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
              onClick={() => navigate("/tracking")}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Volver</span>
            </button>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>
                Editar Tracking #{id}
              </h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Actualiza la información del registro</p>
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
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
              Información del Tracking
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
                  <User style={{ width: "16px", height: "16px" }} />
                  <span>Cliente</span>
                </label>
                <select
                  name="id_cliente"
                  value={formData.id_cliente}
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
                  <MapPin style={{ width: "16px", height: "16px" }} />
                  <span>Estado</span>
                </label>
                <input
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="form-modern"
                  placeholder="Ej: En tránsito, Entregado"
                />
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
                  <Navigation style={{ width: "16px", height: "16px" }} />
                  <span>Ubicación</span>
                </label>
                <input
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="form-modern"
                  placeholder="Ej: Centro de distribución"
                />
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
              <button type="button" onClick={() => navigate("/tracking")} className="btn-secondary-modern">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
