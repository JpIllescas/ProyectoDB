"use client"
import { useNavigate } from "react-router-dom"
import { FileText, ShoppingCart, Package, Hash, Edit } from "lucide-react"

export default function DetalleCard({ detalle }) {
  const navigate = useNavigate()
  const { id_detalle, id_pedido, id_producto, cantidad } = detalle

  return (
    <div className="card animate-fade-in">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Detalle #{id_detalle}</h3>
              <div className="space-y-1 mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Pedido #{id_pedido}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>
                    {detalle.producto?.nombre || "Producto no encontrado"} (ID: {id_producto})
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Hash className="w-4 h-4" />
                  <span className="font-semibold text-blue-600">{cantidad} unidades</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/detalles/editar/${id_detalle}`)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
