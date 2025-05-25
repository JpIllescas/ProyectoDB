"use client"

import { useEffect, useState } from "react"
import { getPedidos, createPedido } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import PedidoCard from "../components/PedidoCard"
import { ShoppingCart, Plus, Search, TrendingUp, Users, Calendar, Loader } from "lucide-react"

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [filteredPedidos, setFilteredPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ cliente_id: "", fecha: "", estado: "Pendiente" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pedData, cliData] = await Promise.all([getPedidos(), getClientes()])
      const enriched = pedData.map((p) => ({
        ...p,
        cliente: cliData.find((c) => c.id_cliente === p.id_cliente) || { nombre: "Cliente no encontrado" },
      }))
      setPedidos(enriched)
      setFilteredPedidos(enriched)
      setClientes(cliData)
    } catch {
      setError("Error al cargar datos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = pedidos.filter(
      (pedido) =>
        pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.id_pedido.toString().includes(searchTerm),
    )
    setFilteredPedidos(filtered)
  }, [searchTerm, pedidos])

  const handleDelete = (id) => setPedidos((prev) => prev.filter((p) => p.id_pedido !== id))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createPedido({
        id_cliente: Number.parseInt(formData.cliente_id, 10),
        fecha: formData.fecha,
        estado: formData.estado,
      })
      setFormData({ cliente_id: "", fecha: "", estado: "Pendiente" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error(err)
      alert("Error al crear pedido")
    }
  }

  // Estadísticas REALES
  const totalPedidos = pedidos.length
  const pedidosPendientes = pedidos.filter((p) => p.estado === "Pendiente").length
  const pedidosEnviados = pedidos.filter((p) => p.estado === "Enviado").length
  const pedidosEntregados = pedidos.filter((p) => p.estado === "Entregado").length

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#6366f1" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando pedidos...</span>
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
                background: "#6366f1",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Total Pedidos</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{totalPedidos}</p>
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
              <Calendar style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Pendientes</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{pedidosPendientes}</p>
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
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Enviados</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{pedidosEnviados}</p>
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
              <Users style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", margin: 0 }}>Entregados</p>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>{pedidosEntregados}</p>
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
                placeholder="Buscar por cliente o número de pedido..."
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
              <span>{showForm ? "Cancelar" : "Nuevo Pedido"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card-modern animate-fade-in">
          <div className="card-header-modern">
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Crear Nuevo Pedido</h3>
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
                    Cliente
                  </label>
                  <select
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    required
                    className="form-modern"
                  >
                    <option value="">Seleccione un cliente...</option>
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
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    className="form-modern"
                  >
                    <option>Pendiente</option>
                    <option>Enviado</option>
                    <option>Entregado</option>
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
                  Fecha
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
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary-modern">
                  Guardar Pedido
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-modern">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de pedidos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredPedidos.length === 0 ? (
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
                <ShoppingCart style={{ width: "32px", height: "32px", color: "#9ca3af" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {searchTerm ? "No se encontraron pedidos" : "No hay pedidos registrados"}
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer pedido"}
              </p>
              {!searchTerm && (
                <button onClick={() => setShowForm(true)} className="btn-primary-modern">
                  Crear Primer Pedido
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredPedidos.map((p) => <PedidoCard key={p.id_pedido} pedido={p} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
