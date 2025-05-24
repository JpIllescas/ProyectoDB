"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getClienteById, updateCliente } from "../api/clientes"
import { User, Mail, Phone, Save, ArrowLeft, Loader } from "lucide-react"

export default function ClienteEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCliente() {
      try {
        const data = await getClienteById(id)
        setFormData({ nombre: data.nombre, email: data.email, telefono: data.telefono })
      } catch (err) {
        setError("No se pudo cargar el cliente")
      } finally {
        setLoading(false)
      }
    }
    fetchCliente()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateCliente(id, formData)
      navigate("/clientes")
    } catch (err) {
      setError("Error al actualizar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando cliente...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate("/clientes")} className="btn-primary">
              Volver a Clientes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate("/clientes")} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
              <p className="text-gray-600">Actualiza la información del cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Nombre completo</span>
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="form-label flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Teléfono</span>
                </label>
                <input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ej: +1234567890"
                />
              </div>
            </div>
            <div>
              <label className="form-label flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ej: juan@ejemplo.com"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
              <button type="button" onClick={() => navigate("/clientes")} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
