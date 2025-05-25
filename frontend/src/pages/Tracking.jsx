"use client"

import { useState, useEffect } from "react"
import { getTrackings, createTracking } from "../api/tracking"
import { getPedidos } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import TrackingCard from "../components/TrackingCard"
import { MapPin, Plus, Search, Navigation, Clock, TrendingUp, Loader } from "lucide-react"

export default function Tracking() {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    id_pedido: "",
    id_cliente: "",
    estado: "",
    ubicacion: "",
  })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [trk, ped, cli] = await Promise.all([getTrackings(), getPedidos(), getClientes()])
      // Enriquecer los datos de tracking con información de pedidos y clientes
      const enriched = trk.map((record) => ({
        ...record,
        pedido: ped.find((p) => p.id_pedido === record.id_pedido) || { id_pedido: record.id_pedido },
        cliente: cli.find((c) => c.id_cliente === record.id_cliente) || { nombre: "Cliente no encontrado" },
      }))
      setRecords(enriched)
      setFilteredRecords(enriched)
      setPedidos(ped)
      setClientes(cli)
    } catch (err) {
      console.error(err)
      setError("Error al cargar datos de tracking")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = records.filter(
      (record) =>
        record.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id_pedido.toString().includes(searchTerm) ||
        record.id_cliente.toString().includes(searchTerm) ||
        record.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRecords(filtered)
  }, [searchTerm, records])

  const handleDelete = (id) => setRecords((rs) => rs.filter((r) => r.id !== id))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((fd) => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("Enviando:", formData)
      await createTracking(formData)
      setFormData({ id_pedido: "", id_cliente: "", estado: "", ubicacion: "" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error("Error creando:", err)
      alert(err.message)
    }
  }

  // Estadísticas REALES calculadas dinámicamente
  const totalRegistros = records.length
  const enTransito = records.filter(
    (r) => r.estado.toLowerCase().includes("tránsito") || r.estado.toLowerCase().includes("transito"),
  ).length
  const entregados = records.filter((r) => r.estado.toLowerCase().includes("entregado")).length
  const pendientes = records.filter((r) => r.estado.toLowerCase().includes("pendiente")).length

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#f59e0b" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando tracking...</span>
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
                background: "#f59e0b",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Total Registros</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{totalRegistros}</p>
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
              <Navigation style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>En Tránsito</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{enTransito}</p>
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
              <TrendingUp style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Entregados</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{entregados}</p>
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
              <Clock style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Pendientes</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{pendientes}</p>
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
                placeholder="Buscar por estado, ubicación, pedido o cliente..."
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
              <span>{showForm ? "Cancelar" : "Nuevo Registro"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card-modern animate-fade-in">
          <div className="card-header-modern">
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
              Crear Nuevo Registro de Tracking
            </h3>
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
                    <option value="">Seleccione pedido</option>
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
                    Cliente
                  </label>
                  <select
                    name="id_cliente"
                    value={formData.id_cliente}
                    onChange={handleChange}
                    required
                    className="form-modern"
                  >
                    <option value="">Seleccione cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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
                    Estado
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
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Ubicación
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
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary-modern">
                  Guardar Registro
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-modern">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de registros */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredRecords.length === 0 ? (
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
                <MapPin style={{ width: "32px", height: "32px", color: "#9ca3af" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {searchTerm ? "No se encontraron registros" : "No hay registros de tracking"}
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer registro"}
              </p>
              {!searchTerm && (
                <button onClick={() => setShowForm(true)} className="btn-primary-modern">
                  Crear Primer Registro
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredRecords.map((r) => <TrackingCard key={r.id} record={r} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
