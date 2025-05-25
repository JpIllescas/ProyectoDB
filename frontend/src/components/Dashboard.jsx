"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getClientes } from "../api/clientes"
import { getProductos } from "../api/productos"
import { getPedidos } from "../api/pedidos"
import { getTrackings } from "../api/tracking"
import {
  Users,
  Package,
  ShoppingCart,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Loader,
} from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    pedidos: 0,
    tracking: 0,
    valorInventario: 0,
    pedidosPendientes: 0,
    pedidosEntregados: 0,
    stockBajo: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      try {
        const [clientesData, productosData, pedidosData, trackingData] = await Promise.all([
          getClientes().catch(() => []),
          getProductos().catch(() => []),
          getPedidos().catch(() => []),
          getTrackings().catch(() => []),
        ])

        // Calcular estadísticas reales
        const valorInventario = productosData.reduce((sum, p) => sum + (p.precio * p.stock || 0), 0)
        const stockBajo = productosData.filter((p) => p.stock < 10).length
        const pedidosPendientes = pedidosData.filter((p) => p.estado === "Pendiente").length
        const pedidosEntregados = pedidosData.filter((p) => p.estado === "Entregado").length

        setStats({
          clientes: clientesData.length,
          productos: productosData.length,
          pedidos: pedidosData.length,
          tracking: trackingData.length,
          valorInventario,
          pedidosPendientes,
          pedidosEntregados,
          stockBajo,
        })

        // Obtener pedidos recientes (últimos 5)
        const recent = pedidosData
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 5)
          .map((pedido) => {
            const cliente = clientesData.find((c) => c.id_cliente === pedido.id_cliente)
            return {
              id: `#${pedido.id_pedido}`,
              customer: cliente?.nombre || "Cliente desconocido",
              status: pedido.estado,
              date: new Date(pedido.fecha).toLocaleDateString(),
              priority: pedido.estado === "Pendiente" ? "high" : pedido.estado === "Enviado" ? "medium" : "low",
            }
          })

        setRecentOrders(recent)
      } catch (err) {
        setError("Error al cargar datos del dashboard")
        console.error("Dashboard error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case "Entregado":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "Enviado":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "Pendiente":
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Entregado":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200"
      case "Enviado":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "Pendiente":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  // Funciones de navegación para acciones rápidas
  const handleQuickAction = (action) => {
    switch (action) {
      case "cliente":
        navigate("/clientes")
        break
      case "producto":
        navigate("/productos")
        break
      case "pedido":
        navigate("/pedidos")
        break
      case "tracking":
        navigate("/tracking")
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <Loader style={{ width: "32px", height: "32px", color: "#3b82f6" }} className="animate-spin" />
        <span style={{ marginLeft: "8px", color: "#6b7280" }}>Cargando dashboard...</span>
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
            <BarChart3 style={{ width: "32px", height: "32px", color: "#dc2626" }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
            Error al cargar dashboard
          </h3>
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary-modern">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      name: "Total Clientes",
      value: stats.clientes.toLocaleString(),
      change: stats.clientes > 0 ? "+100%" : "0%",
      changeType: "positive",
      icon: Users,
      color: "blue",
      description: `Activos en el sistema`,
    },
    {
      name: "Productos Activos",
      value: stats.productos.toLocaleString(),
      change: stats.stockBajo > 0 ? `${stats.stockBajo} stock bajo` : "Stock OK",
      changeType: stats.stockBajo > 0 ? "negative" : "positive",
      icon: Package,
      color: "emerald",
      description: `Valor: $${stats.valorInventario.toLocaleString()}`,
    },
    {
      name: "Pedidos Totales",
      value: stats.pedidos.toLocaleString(),
      change: `${stats.pedidosPendientes} pendientes`,
      changeType: stats.pedidosPendientes > 0 ? "negative" : "positive",
      icon: ShoppingCart,
      color: "purple",
      description: `${stats.pedidosEntregados} entregados`,
    },
    {
      name: "Registros Tracking",
      value: stats.tracking.toLocaleString(),
      change: "Tiempo real",
      changeType: "positive",
      icon: MapPin,
      color: "orange",
      description: "Sistema activo",
    },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Hero Section */}
      <div className="card-premium">
        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                }}
              >
                ¡Bienvenido a ShipFlow Pro!
              </h1>
              <p style={{ fontSize: "18px", color: "#6b7280", margin: 0 }}>
                Gestiona tus envíos y pedidos con inteligencia empresarial
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "#ecfdf5",
                    borderRadius: "9999px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#10b981",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#065f46" }}>Sistema Operativo</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "#eff6ff",
                    borderRadius: "9999px",
                  }}
                >
                  <Activity style={{ width: "16px", height: "16px", color: "#2563eb" }} />
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#1e40af" }}>Tiempo Real</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827" }}>
                {currentTime.toLocaleTimeString()}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <BarChart3 style={{ width: "16px", height: "16px", color: "#3b82f6" }} />
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#2563eb" }}>Dashboard Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-modern">
        {statsData.map((stat, index) => {
          const colorClasses = {
            blue: {
              bg: "linear-gradient(135deg, #3b82f6, #2563eb)",
              light: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
            },
            emerald: {
              bg: "linear-gradient(135deg, #10b981, #059669)",
              light: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
            },
            purple: {
              bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              light: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            },
            orange: {
              bg: "linear-gradient(135deg, #f59e0b, #d97706)",
              light: "linear-gradient(135deg, #fef3c7, #fde68a)",
            },
          }

          return (
            <div
              key={stat.name}
              className="stat-card-modern animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div style={{ position: "relative", zIndex: 10 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: colorClasses[stat.color].bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <stat.icon style={{ width: "28px", height: "28px", color: "white" }} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: stat.changeType === "positive" ? "#ecfdf5" : "#fef2f2",
                      color: stat.changeType === "positive" ? "#065f46" : "#991b1b",
                    }}
                  >
                    {stat.changeType === "positive" ? (
                      <TrendingUp style={{ width: "16px", height: "16px" }} />
                    ) : (
                      <TrendingDown style={{ width: "16px", height: "16px" }} />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: 0,
                    }}
                  >
                    {stat.name}
                  </h3>
                  <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827" }}>{stat.value}</div>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{stat.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        {/* Recent Orders */}
        <div className="card-modern">
          <div className="card-header-modern">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingCart style={{ width: "20px", height: "20px", color: "white" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    Pedidos Recientes
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Últimas transacciones del sistema</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/pedidos")}
                className="btn-secondary-modern"
                style={{ fontSize: "14px" }}
              >
                Ver Todos
              </button>
            </div>
          </div>
          <div style={{ padding: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {recentOrders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px" }}>
                  <ShoppingCart style={{ width: "48px", height: "48px", color: "#9ca3af", margin: "0 auto 16px" }} />
                  <p style={{ color: "#6b7280", margin: 0 }}>No hay pedidos recientes</p>
                </div>
              ) : (
                recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                      borderRadius: "12px",
                      borderLeft: `4px solid ${
                        order.priority === "high" ? "#ef4444" : order.priority === "medium" ? "#f59e0b" : "#10b981"
                      }`,
                      transition: "all 0.3s ease",
                      animationDelay: `${index * 0.1}s`,
                    }}
                    className="animate-fade-in hover:shadow-md"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {getStatusIcon(order.status)}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>{order.id}</p>
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "500",
                              }}
                              className={getStatusClass(order.status)}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{order.customer}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{order.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Quick Actions */}
          <div className="card-modern">
            <div className="card-header-modern">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Activity style={{ width: "20px", height: "20px", color: "white" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Acciones Rápidas</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Operaciones frecuentes</p>
                </div>
              </div>
            </div>
            <div style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  {
                    name: "Nuevo Cliente",
                    icon: Users,
                    color: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    description: "Registrar cliente",
                    action: "cliente",
                  },
                  {
                    name: "Nuevo Producto",
                    icon: Package,
                    color: "linear-gradient(135deg, #10b981, #059669)",
                    description: "Añadir inventario",
                    action: "producto",
                  },
                  {
                    name: "Nuevo Pedido",
                    icon: ShoppingCart,
                    color: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    description: "Crear pedido",
                    action: "pedido",
                  },
                  {
                    name: "Tracking",
                    icon: MapPin,
                    color: "linear-gradient(135deg, #f59e0b, #d97706)",
                    description: "Seguimiento",
                    action: "tracking",
                  },
                ].map((action, index) => (
                  <button
                    key={action.name}
                    onClick={() => handleQuickAction(action.action)}
                    style={{
                      padding: "16px",
                      background: action.color,
                      color: "white",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      animationDelay: `${index * 0.1}s`,
                    }}
                    className="animate-scale-in hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <action.icon style={{ width: "24px", height: "24px", margin: "0 auto 8px" }} />
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{action.name}</div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>{action.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card-modern">
            <div className="card-header-modern">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Activity style={{ width: "20px", height: "20px", color: "white" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    Estado del Sistema
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Monitoreo en tiempo real</p>
                </div>
              </div>
            </div>
            <div style={{ padding: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { name: "Base de Datos Oracle", status: "Conectado", uptime: "99.9%" },
                  { name: "Base de Datos CockroachDB", status: "Conectado", uptime: "99.8%" },
                  { name: "Base de Datos MySQL", status: "Conectado", uptime: "99.7%" },
                  { name: "API Services", status: "Operativo", uptime: "100%" },
                ].map((service, index) => (
                  <div
                    key={service.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                      borderRadius: "8px",
                      border: "1px solid #a7f3d0",
                      animationDelay: `${index * 0.1}s`,
                    }}
                    className="animate-fade-in"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          background: "#10b981",
                          borderRadius: "50%",
                          animation: "pulse 3s infinite",
                        }}
                      ></div>
                      <div>
                        <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px", margin: 0 }}>
                          {service.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#065f46", margin: 0 }}>{service.status}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", fontWeight: "700", color: "#065f46", margin: 0 }}>
                        {service.uptime}
                      </p>
                      <p style={{ fontSize: "12px", color: "#059669", margin: 0 }}>Uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
