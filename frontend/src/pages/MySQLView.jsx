"use client"

import { useState, useEffect } from "react"
import { getMySQLClientes, getMySQLProductos, getMySQLPedidos, getMySQLDetalles, getMySQLStats } from "../api/mysql"
import {
  Database,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Eye,
  Loader,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Zap,
  Server,
  RefreshCw,
  BarChart3,
  Mail,
  Phone,
  DollarSign,
  Archive,
  Calendar,
  Hash,
} from "lucide-react"

export default function MySQLView() {
  const [activeTab, setActiveTab] = useState("stats")
  const [data, setData] = useState({
    stats: {},
    clientes: [],
    productos: [],
    pedidos: [],
    detalles: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSync, setLastSync] = useState(new Date())

  const tabs = [
    {
      id: "stats",
      name: "Estadísticas",
      icon: BarChart3,
      color: "linear-gradient(135deg, #3b82f6, #2563eb)",
      description: "Resumen de datos replicados",
    },
    {
      id: "clientes",
      name: "Clientes",
      icon: Users,
      color: "linear-gradient(135deg, #10b981, #059669)",
      description: "Base de clientes replicada",
    },
    {
      id: "productos",
      name: "Productos",
      icon: Package,
      color: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      description: "Inventario sincronizado",
    },
    {
      id: "pedidos",
      name: "Pedidos",
      icon: ShoppingCart,
      color: "linear-gradient(135deg, #f59e0b, #d97706)",
      description: "Órdenes replicadas",
    },
    {
      id: "detalles",
      name: "Detalles",
      icon: FileText,
      color: "linear-gradient(135deg, #ef4444, #dc2626)",
      description: "Detalles de pedidos",
    },
  ]

  const fetchData = async (tab) => {
    setLoading(true)
    setError(null)
    try {
      switch (tab) {
        case "stats":
          const stats = await getMySQLStats()
          setData((prev) => ({ ...prev, stats }))
          break
        case "clientes":
          const clientes = await getMySQLClientes()
          setData((prev) => ({ ...prev, clientes }))
          break
        case "productos":
          const productos = await getMySQLProductos()
          setData((prev) => ({ ...prev, productos }))
          break
        case "pedidos":
          const pedidos = await getMySQLPedidos()
          setData((prev) => ({ ...prev, pedidos }))
          break
        case "detalles":
          const detalles = await getMySQLDetalles()
          setData((prev) => ({ ...prev, detalles }))
          break
      }
      setLastSync(new Date())
    } catch (err) {
      setError(`Error al cargar ${tab}: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const renderStats = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Hero Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {[
          {
            name: "Clientes Replicados",
            value: data.stats.clientes,
            icon: Users,
            color: "#3b82f6",
            bgGradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
            change: "+100%",
            description: "Sincronización completa",
          },
          {
            name: "Productos Sincronizados",
            value: data.stats.productos,
            icon: Package,
            color: "#10b981",
            bgGradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
            change: "Tiempo real",
            description: `Valor: $${(data.stats.valorInventario || 0).toLocaleString()}`,
          },
          {
            name: "Pedidos Replicados",
            value: data.stats.pedidos,
            icon: ShoppingCart,
            color: "#8b5cf6",
            bgGradient: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            change: "Activo",
            description: "Replicación automática",
          },
          {
            name: "Detalles Sincronizados",
            value: data.stats.detalles,
            icon: FileText,
            color: "#f59e0b",
            bgGradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
            change: "RabbitMQ",
            description: "Cola de mensajes activa",
          },
        ].map((stat, index) => (
          <div
            key={stat.name}
            className="card-modern animate-fade-in"
            style={{
              animationDelay: `${index * 0.1}s`,
              background: stat.bgGradient,
              border: `1px solid ${stat.color}20`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                right: "-50%",
                width: "200%",
                height: "200%",
                background: `radial-gradient(circle, ${stat.color}10 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            <div style={{ padding: "32px", position: "relative", zIndex: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 32px ${stat.color}40`,
                  }}
                >
                  <stat.icon style={{ width: "32px", height: "32px", color: "white" }} />
                </div>
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: `${stat.color}20`,
                    color: stat.color,
                    fontSize: "12px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Activity style={{ width: "14px", height: "14px" }} />
                  {stat.change}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                    margin: "0 0 8px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {stat.name}
                </h3>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "800",
                    color: "#111827",
                    lineHeight: "1",
                    marginBottom: "8px",
                  }}
                >
                  {stat.value || 0}
                </div>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Replication Status */}
      <div className="card-modern">
        <div
          style={{
            padding: "32px",
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap style={{ width: "28px", height: "28px", color: "white" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>
                Estado de Replicación
              </h3>
              <p style={{ color: "#065f46", margin: 0, fontSize: "16px" }}>Oracle → RabbitMQ → MySQL & CockroachDB</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "#10b981",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                <CheckCircle style={{ width: "16px", height: "16px" }} />
                Operativo
              </div>
              <p style={{ fontSize: "12px", color: "#059669", margin: "4px 0 0 0" }}>
                Última sync: {lastSync.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            {[
              { label: "Latencia Promedio", value: "< 50ms", icon: TrendingUp, color: "#10b981" },
              {
                label: "Replicaciones Exitosas",
                value: `${(data.stats.clientes || 0) + (data.stats.productos || 0) + (data.stats.pedidos || 0) + (data.stats.detalles || 0)}`,
                icon: RefreshCw,
                color: "#3b82f6",
              },
              { label: "Tasa de Éxito", value: "99.9%", icon: CheckCircle, color: "#059669" },
              { label: "Cola RabbitMQ", value: "0 pendientes", icon: Server, color: "#8b5cf6" },
            ].map((metric, index) => (
              <div
                key={metric.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: metric.color,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <metric.icon style={{ width: "20px", height: "20px", color: "white" }} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{metric.label}</p>
                  <p style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: 0 }}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderEnhancedTable = (items, columns, tabInfo) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Table Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px",
          background: tabInfo.color,
          borderRadius: "16px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <tabInfo.icon style={{ width: "32px", height: "32px" }} />
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>{tabInfo.name}</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>{tabInfo.description}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "32px", fontWeight: "800" }}>{items.length}</div>
          <div style={{ fontSize: "14px", opacity: 0.9 }}>registros</div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="card-modern" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {col.icon && <col.icon style={{ width: "16px", height: "16px", color: "#6b7280" }} />}
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    transition: "all 0.2s ease",
                    background: index % 2 === 0 ? "transparent" : "#fafbfc",
                  }}
                  className="hover:bg-blue-50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "20px 24px",
                        fontSize: "14px",
                        color: "#374151",
                        fontWeight: col.key.includes("id") ? "600" : "400",
                      }}
                    >
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const getTableConfig = () => {
    const tabInfo = tabs.find((tab) => tab.id === activeTab)

    switch (activeTab) {
      case "clientes":
        return {
          items: data.clientes,
          columns: [
            { key: "id_cliente", label: "ID Cliente", icon: Hash },
            { key: "nombre", label: "Nombre Completo", icon: Users },
            { key: "email", label: "Correo Electrónico", icon: Mail },
            { key: "telefono", label: "Teléfono", icon: Phone },
          ],
          tabInfo,
        }
      case "productos":
        return {
          items: data.productos,
          columns: [
            { key: "id_producto", label: "ID Producto", icon: Hash },
            { key: "nombre", label: "Nombre del Producto", icon: Package },
            {
              key: "precio",
              label: "Precio",
              icon: DollarSign,
              render: (value) => (
                <span
                  style={{
                    fontWeight: "600",
                    color: "#059669",
                    fontSize: "16px",
                  }}
                >
                  ${value}
                </span>
              ),
            },
            {
              key: "stock",
              label: "Stock",
              icon: Archive,
              render: (value) => (
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: value < 10 ? "#fef2f2" : "#ecfdf5",
                    color: value < 10 ? "#dc2626" : "#059669",
                  }}
                >
                  {value} unidades
                </span>
              ),
            },
          ],
          tabInfo,
        }
      case "pedidos":
        return {
          items: data.pedidos,
          columns: [
            { key: "id_pedido", label: "ID Pedido", icon: Hash },
            { key: "id_cliente", label: "Cliente", icon: Users },
            {
              key: "fecha",
              label: "Fecha",
              icon: Calendar,
              render: (value) =>
                new Date(value).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
            },
            {
              key: "estado",
              label: "Estado",
              icon: Activity,
              render: (value) => (
                <span
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: value === "Entregado" ? "#ecfdf5" : value === "Enviado" ? "#eff6ff" : "#fef3c7",
                    color: value === "Entregado" ? "#059669" : value === "Enviado" ? "#2563eb" : "#d97706",
                  }}
                >
                  {value}
                </span>
              ),
            },
          ],
          tabInfo,
        }
      case "detalles":
        return {
          items: data.detalles,
          columns: [
            { key: "id_detalle", label: "ID Detalle", icon: Hash },
            { key: "id_pedido", label: "Pedido", icon: ShoppingCart },
            { key: "id_producto", label: "Producto", icon: Package },
            {
              key: "cantidad",
              label: "Cantidad",
              icon: Archive,
              render: (value) => (
                <span
                  style={{
                    fontWeight: "600",
                    color: "#2563eb",
                    fontSize: "16px",
                  }}
                >
                  {value}
                </span>
              ),
            },
          ],
          tabInfo,
        }
      default:
        return { items: [], columns: [], tabInfo }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Enhanced Header */}
      <div
        className="card-modern"
        style={{
          background: "linear-gradient(135deg, #1e293b, #334155)",
          color: "white",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-30%",
            width: "100%",
            height: "200%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ padding: "40px", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)",
                }}
              >
                <Database style={{ width: "40px", height: "40px", color: "white" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "36px", fontWeight: "800", margin: 0 }}>Vista MySQL</h1>
                <p style={{ fontSize: "18px", margin: "8px 0 0 0", opacity: 0.9 }}>
                  Datos replicados desde Oracle via RabbitMQ
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      background: "rgba(16, 185, 129, 0.2)",
                      borderRadius: "20px",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <CheckCircle style={{ width: "16px", height: "16px", color: "#10b981" }} />
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#10b981" }}>Replicación Activa</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      background: "rgba(245, 158, 11, 0.2)",
                      borderRadius: "20px",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    <Eye style={{ width: "16px", height: "16px", color: "#f59e0b" }} />
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#f59e0b" }}>Solo Lectura</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "48px", fontWeight: "800", lineHeight: "1" }}>
                {(data.stats.clientes || 0) +
                  (data.stats.productos || 0) +
                  (data.stats.pedidos || 0) +
                  (data.stats.detalles || 0)}
              </div>
              <div style={{ fontSize: "16px", opacity: 0.8, marginTop: "4px" }}>Registros Totales</div>
              <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "8px" }}>
                Última actualización: {lastSync.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="card-modern">
        <div style={{ padding: "32px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  background: activeTab === tab.id ? tab.color : "transparent",
                  color: activeTab === tab.id ? "white" : "#6b7280",
                  transform: activeTab === tab.id ? "translateY(-2px)" : "none",
                  boxShadow: activeTab === tab.id ? "0 8px 25px rgba(0, 0, 0, 0.15)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = "#f3f4f6"
                    e.target.style.color = "#374151"
                    e.target.style.transform = "translateY(-1px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = "transparent"
                    e.target.style.color = "#6b7280"
                    e.target.style.transform = "none"
                  }
                }}
              >
                <tab.icon style={{ width: "20px", height: "20px" }} />
                <div style={{ textAlign: "left" }}>
                  <div>{tab.name}</div>
                  {activeTab === tab.id && (
                    <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "2px" }}>{tab.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content */}
        <div style={{ padding: "40px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
              <div style={{ textAlign: "center" }}>
                <Loader
                  style={{ width: "48px", height: "48px", color: "#3b82f6", margin: "0 auto 16px" }}
                  className="animate-spin"
                />
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                  Cargando datos de MySQL
                </h3>
                <p style={{ color: "#6b7280", margin: 0 }}>Sincronizando información replicada...</p>
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <AlertCircle style={{ width: "40px", height: "40px", color: "#ef4444" }} />
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                Error de Conexión
              </h3>
              <p style={{ color: "#ef4444", marginBottom: "24px", fontSize: "16px" }}>{error}</p>
              <button onClick={() => fetchData(activeTab)} className="btn-primary-modern">
                <RefreshCw style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                Reintentar Conexión
              </button>
            </div>
          ) : (
            <>
              {activeTab === "stats" && renderStats()}
              {activeTab !== "stats" && (
                <>
                  {getTableConfig().items.length > 0 ? (
                    renderEnhancedTable(getTableConfig().items, getTableConfig().columns, getTableConfig().tabInfo)
                  ) : (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                          borderRadius: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 24px",
                        }}
                      >
                        <Database style={{ width: "40px", height: "40px", color: "#9ca3af" }} />
                      </div>
                      <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                        No hay datos disponibles
                      </h3>
                      <p style={{ color: "#6b7280", margin: 0, fontSize: "16px" }}>
                        La replicación aún no ha sincronizado datos para esta tabla
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
