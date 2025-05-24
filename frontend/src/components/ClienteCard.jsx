"use client"
import { useNavigate } from "react-router-dom"
import { deleteCliente } from "../api/clientes"
import { User, Mail, Phone, Edit, Trash2 } from "lucide-react"

export default function ClienteCard({ cliente, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar cliente ${cliente.nombre}?`)) return
    try {
      await deleteCliente(cliente.id_cliente)
      onDelete(cliente.id_cliente)
    } catch (error) {
      console.error("Error eliminando cliente:", error)
      alert("No se pudo eliminar el cliente. ¿Tiene pedidos asociados?")
    }
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{cliente.nombre}</h3>
              <div className="space-y-1 mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{cliente.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{cliente.telefono}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/clientes/editar/${cliente.id_cliente}`)}
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
