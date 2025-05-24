"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"

const stats = [
  {
    name: "Total Clientes",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    color: "blue",
    description: "Nuevos este mes: +156",
  },
  {
    name: "Productos Activos",
    value: "1,234",
    change: "+5%",
    changeType: "positive",
    icon: Package,
    color: "emerald",
    description: "Stock total: 45,678 unidades",
  },
  {
    name: "Pedidos del Mes",
    value: "892",
    change: "+18%",
    changeType: "positive",
    icon: ShoppingCart,
    color: "purple",
    description: "Valor: $125,430",
  },
  {
    name: "Envíos en Tránsito",
    value: "156",
    change: "-3%",
    changeType: "negative",
    icon: MapPin,
    color: "orange",
    description: "Entregados hoy: 23",
  },
]

const recentOrders = [
  { id: "#001", customer: "Juan Pérez", status: "Entregado", amount: "$1,250", date: "2024-01-15", priority: "high" },
  {
    id: "#002",
    customer: "María García",
    status: "En tránsito",
    amount: "$890",
    date: "2024-01-14",
    priority: "medium",
  },
  { id: "#003", customer: "Carlos López", status: "Pendiente", amount: "$2,100", date: "2024-01-14", priority: "high" },
  { id: "#004", customer: "Ana Martínez", status: "Entregado", amount: "$750", date: "2024-01-13", priority: "low" },
  {
    id: "#005",
    customer: "Luis Rodríguez",
    status: "En tránsito",
    amount: "$1,500",
    date: "2024-01-13",
    priority: "medium",
  },
]

const quickActions = [
  { name: "Nuevo Cliente", icon: Users, color: "blue", description: "Registrar cliente" },
  { name: "Nuevo Producto", icon: Package, color: "emerald", description: "Añadir inventario" },
  { name: "Nuevo Pedido", icon: ShoppingCart, color: "purple", description: "Crear pedido" },
  { name: "Tracking", icon: MapPin, color: "orange", description: "Seguimiento" },
]

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case "Entregado":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "En tránsito":
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
        return "status-badge bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200"
      case "En tránsito":
        return "status-badge bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
      case "Pendiente":
        return "status-badge bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
      default:
        return "status-badge bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200"
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

  return (
    <div className="section-spacing">
      {/* Hero Section */}
      <div className="card-premium">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="heading-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ¡Bienvenido a ShipFlow Pro!
              </h1>
              <p className="text-lg text-muted">Gestiona tus envíos y pedidos con inteligencia empresarial</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">Sistema Operativo</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Tiempo Real</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-3xl font-bold text-gray-900">{currentTime.toLocaleTimeString()}</div>
              <div className="text-sm text-muted">
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center justify-end space-x-2 mt-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Dashboard Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const colorClasses = {
            blue: { bg: "from-blue-500 to-blue-600", light: "from-blue-50 to-indigo-50" },
            emerald: { bg: "from-emerald-500 to-emerald-600", light: "from-emerald-50 to-green-50" },
            purple: { bg: "from-purple-500 to-purple-600", light: "from-purple-50 to-violet-50" },
            orange: { bg: "from-orange-500 to-orange-600", light: "from-orange-50 to-amber-50" },
          }

          return (
            <div
              key={stat.name}
              className={`card metric-card metric-card-${stat.color} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${colorClasses[stat.color].bg} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      stat.changeType === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.changeType === "positive" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.name}</h3>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-sm text-muted">{stat.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-sm">Pedidos Recientes</h3>
                    <p className="text-subtle text-sm">Últimas transacciones del sistema</p>
                  </div>
                </div>
                <button className="btn-secondary text-sm">Ver Todos</button>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 ${getPriorityColor(order.priority)} hover:shadow-md transition-all duration-300 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <div className="flex items-center space-x-3">
                            <p className="font-semibold text-gray-900">{order.id}</p>
                            <span className={getStatusClass(order.status)}>{order.status}</span>
                          </div>
                          <p className="text-sm text-muted">{order.customer}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{order.amount}</p>
                      <p className="text-sm text-muted">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="heading-sm">Acciones Rápidas</h3>
                  <p className="text-subtle text-sm">Operaciones frecuentes</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const colorClasses = {
                    blue: "from-blue-500 to-blue-600",
                    emerald: "from-emerald-500 to-emerald-600",
                    purple: "from-purple-500 to-purple-600",
                    orange: "from-orange-500 to-orange-600",
                  }

                  return (
                    <button
                      key={action.name}
                      className={`p-4 bg-gradient-to-r ${colorClasses[action.color]} text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 animate-scale-in`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <action.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-semibold">{action.name}</div>
                      <div className="text-xs opacity-90 mt-1">{action.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="heading-sm">Estado del Sistema</h3>
                  <p className="text-subtle text-sm">Monitoreo en tiempo real</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {[
                  { name: "Base de Datos Oracle", status: "Conectado", uptime: "99.9%" },
                  { name: "Base de Datos CockroachDB", status: "Conectado", uptime: "99.8%" },
                  { name: "API Services", status: "Operativo", uptime: "100%" },
                ].map((service, index) => (
                  <div
                    key={service.name}
                    className={`flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse-slow"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                        <p className="text-xs text-emerald-700">{service.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-700">{service.uptime}</p>
                      <p className="text-xs text-emerald-600">Uptime</p>
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
