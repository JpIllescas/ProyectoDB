"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTrackingById, updateTracking } from "../api/tracking"
import { getPedidos } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import { MapPin, ShoppingCart, User, Navigation, Save, ArrowLeft, Loader } from "lucide-react"

export default function TrackingEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id_pedido: "",
    id_cliente: "",
    estado: "",
    ubicacion: "",
  })
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [trk, ped, cli] = await Promise.all([getTrackingById(id), getPedidos(), getClientes()])
        setFormData({
          id_pedido: trk.id_pedido,
          id_cliente: trk.id_cliente,
          estado: trk.estado,
          ubicacion: trk.ubicacion,
        })
        setPedidos(ped)
        setClientes(cli)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((fd) => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateTracking(id, formData)
      navigate("/tracking")
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Cargando...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate("/tracking")} className="btn-primary">
              Volver a Tracking
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
            <button onClick={() => navigate("/tracking")} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Tracking #{id}</h1>
              <p className="text-gray-600">Actualiza la información del registro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información del Tracking</h3>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Pedido</span>
                </label>
                <select
                  name="id_pedido"
                  value={formData.id_pedido}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  {pedidos.map((p) => (
                    <option key={p.id_pedido} value={p.id_pedido}>
                      Pedido #{p.id_pedido}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Cliente</span>
                </label>
                <select
                  name="id_cliente"
                  value={formData.id_cliente}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Estado</span>
                </label>
                <input
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ej: En tránsito, Entregado"
                />
              </div>
              <div>
                <label className="form-label flex items-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>Ubicación</span>
                </label>
                <input
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: Centro de distribución"
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
              <button type="button" onClick={() => navigate("/tracking")} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
