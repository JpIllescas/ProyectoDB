"use client"
import { useNavigate } from "react-router-dom"
import { deletePedido } from "../api/pedidos"
import { ShoppingCart, User, Calendar, Package, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function PedidoCard({ pedido, onDelete }) {
  const navigate = useNavigate()

  const { id_pedido, cliente = { nombre: "Cliente no encontrado" }, fecha, estado } = pedido || {}

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar pedido #${id_pedido}?`)) return
    try {
      await deletePedido(id_pedido)
      onDelete(id_pedido)
    } catch (error) {
      console.error("Error eliminando pedido:", error)
      alert("No se pudo eliminar el pedido.")
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Entregado":
        return { color: "green", icon: CheckCircle, bgColor: "bg-green-100", textColor: "text-green-800" }
      case "Enviado":
        return { color: "blue", icon: Package, bgColor: "bg-blue-100", textColor: "text-blue-800" }
      case "Pendiente":
        return { color: "yellow", icon: Clock, bgColor: "bg-yellow-100", textColor: "text-yellow-800" }
      default:
        return { color: "gray", icon: AlertCircle, bgColor: "bg-gray-100", textColor: "text-gray-800" }
    }
  }

  const statusConfig = getStatusConfig(estado)

  return (
    <div className="card animate-fade-in">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Pedido #{id_pedido}</h3>
                <span
                  className={`status-badge ${statusConfig.bgColor} ${statusConfig.textColor} flex items-center space-x-1`}
                >
                  <statusConfig.icon className="w-3 h-3" />
                  <span>{estado}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{cliente.nombre}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{fecha ? new Date(fecha).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/pedidos/editar/${id_pedido}`)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button onClick={handleDelete} className="btn-danger flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
