"use client"

import { useEffect, useState } from "react"
import { getClientes, createCliente } from "../api/clientes"
import ClienteCard from "../components/ClienteCard"
import { Users, Plus, Search, UserPlus, Loader } from "lucide-react"

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getClientes()
      setClientes(data)
      setFilteredClientes(data)
    } catch (err) {
      setError("Error al cargar los clientes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClientes(filtered)
  }, [searchTerm, clientes])

  const handleDelete = (id) => {
    setClientes((prev) => prev.filter((c) => c.id_cliente !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCliente(formData)
      await fetchData()
      setFormData({ nombre: "", email: "", telefono: "" })
      setShowForm(false)
    } catch (err) {
      console.error("Error al crear cliente:", err)
      alert("Error al crear cliente.")
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#3b82f6" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando clientes...</span>
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
            <Users style={{ width: "32px", height: "32px", color: "#dc2626" }} />
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
      <div className="stats-grid-modern">
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
              <Users style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Total Clientes</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{clientes.length}</p>
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
              <UserPlus style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Nuevos este mes</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>
                +{Math.floor(clientes.length * 0.1)}
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
                background: "#8b5cf6",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Resultados</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>
                {filteredClientes.length}
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
                placeholder="Buscar clientes por nombre o email..."
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
              <span>{showForm ? "Cancelar" : "Nuevo Cliente"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card-modern animate-fade-in">
          <div className="card-header-modern">
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Crear Nuevo Cliente</h3>
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
                    Nombre completo
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
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Teléfono
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
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Email
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
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary-modern">
                  Guardar Cliente
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-modern">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de clientes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredClientes.length === 0 ? (
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
                <Users style={{ width: "32px", height: "32px", color: "#9ca3af" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer cliente"}
              </p>
              {!searchTerm && (
                <button onClick={() => setShowForm(true)} className="btn-primary-modern">
                  Crear Primer Cliente
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredClientes.map((cliente) => (
            <ClienteCard key={cliente.id_cliente} cliente={cliente} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}
