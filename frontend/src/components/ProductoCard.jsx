"use client"
import { useNavigate } from "react-router-dom"
import { deleteProducto } from "../api/productos"
import { Package, DollarSign, Archive, Edit, Trash2, AlertTriangle } from "lucide-react"

export default function ProductoCard({ producto, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar producto ${producto.nombre}?`)) return
    try {
      await deleteProducto(producto.id_producto)
      onDelete(producto.id_producto)
    } catch (error) {
      console.error("Error eliminando producto:", error)
      alert("No se pudo eliminar el producto.")
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "red", text: "Sin stock", icon: AlertTriangle }
    if (stock < 10) return { color: "yellow", text: "Stock bajo", icon: AlertTriangle }
    return { color: "green", text: "En stock", icon: Archive }
  }

  const stockStatus = getStockStatus(producto.stock)

  return (
    <div className="card animate-fade-in">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-green-600">${producto.precio}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <stockStatus.icon className={`w-4 h-4 text-${stockStatus.color}-500`} />
                  <span className={`font-medium text-${stockStatus.color}-600`}>
                    {producto.stock} unidades - {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/productos/editar/${producto.id_producto}`)}
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
