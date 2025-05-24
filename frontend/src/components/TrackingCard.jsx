"use client"
import { useNavigate } from "react-router-dom"
import { deleteTracking } from "../api/tracking"
import { MapPin, User, ShoppingCart, Clock, Edit, Trash2, Navigation } from "lucide-react"

export default function TrackingCard({ record, onDelete }) {
  const navigate = useNavigate()
  const { id, id_pedido, id_cliente, estado, ubicacion, timestamp } = record

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar registro #${id}?`)) return
    try {
      await deleteTracking(id)
      onDelete(id)
    } catch (err) {
      console.error("Error eliminando:", err)
      alert(err.message)
    }
  }

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "entregado":
        return "bg-green-100 text-green-800"
      case "en tránsito":
      case "en transito":
        return "bg-blue-100 text-blue-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Registro #{id}</h3>
                <span className={`status-badge ${getStatusColor(estado)}`}>{estado}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Pedido #{id_pedido}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Cliente #{id_cliente}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4" />
                  <span>{ubicacion}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/tracking/editar/${id}`)}
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
