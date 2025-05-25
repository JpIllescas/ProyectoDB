"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getClienteById, updateCliente } from "../api/clientes"
import { User, Mail, Phone, Save, ArrowLeft, Loader } from "lucide-react"

export default function ClienteEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCliente() {
      try {
        const data = await getClienteById(id)
        setFormData({ nombre: data.nombre, email: data.email, telefono: data.telefono })
      } catch (err) {
        setError("No se pudo cargar el cliente")
      } finally {
        setLoading(false)
      }
    }
    fetchCliente()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateCliente(id, formData)
      navigate("/clientes")
    } catch (err) {
      setError("Error al actualizar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#3b82f6" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando cliente...</span>
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
            <User style={{ width: "32px", height: "32px", color: "#dc2626" }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>Error</h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={() => navigate("/clientes")} className="btn-primary-modern">
            Volver a Clientes
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
              onClick={() => navigate("/clientes")}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Volver</span>
            </button>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>Editar Cliente</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Actualiza la información del cliente</p>
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
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User style={{ width: "20px", height: "20px", color: "#2563eb" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
              Información del Cliente
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
                  <User style={{ width: "16px", height: "16px" }} />
                  <span>Nombre completo</span>
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-modern"
                  placeholder="Ej: Juan Pérez"
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
                  <Phone style={{ width: "16px", height: "16px" }} />
                  <span>Teléfono</span>
                </label>
                <input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="form-modern"
                  placeholder="Ej: +1234567890"
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
                <Mail style={{ width: "16px", height: "16px" }} />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-modern"
                placeholder="Ej: juan@ejemplo.com"
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
              <button type="button" onClick={() => navigate("/clientes")} className="btn-secondary-modern">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
