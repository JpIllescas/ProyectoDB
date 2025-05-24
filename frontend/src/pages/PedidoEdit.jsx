"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPedidoById, updatePedido } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import { ShoppingCart, User, Calendar, Package, Save, ArrowLeft, Loader } from "lucide-react"

export default function PedidoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ cliente_id: "", fecha: "", estado: "" })
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [pedido, cliData] = await Promise.all([getPedidoById(id), getClientes()])
        setFormData({
          cliente_id: pedido.id_cliente,
          fecha: pedido.fecha.split("T")[0],
          estado: pedido.estado,
        })
        setClientes(cliData)
      } catch {
        setError("Error al cargar datos.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updatePedido(id, {
        id_cliente: Number.parseInt(formData.cliente_id, 10),
        fecha: formData.fecha,
        estado: formData.estado,
      })
      navigate("/pedidos")
    } catch {
      setError("Error al actualizar pedido")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Cargando pedido...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate("/pedidos")} className="btn-primary">
              Volver a Pedidos
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
            <button onClick={() => navigate("/pedidos")} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Pedido #{id}</h1>
              <p className="text-gray-600">Actualiza la información del pedido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información del Pedido</h3>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Cliente</span>
                </label>
                <select
                  name="cliente_id"
                  value={formData.cliente_id}
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
              <div>
                <label className="form-label flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Estado</span>
                </label>
                <select name="estado" value={formData.estado} onChange={handleChange} required className="form-input">
                  <option>Pendiente</option>
                  <option>Enviado</option>
                  <option>Entregado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Fecha</span>
              </label>
              <input
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
              <button type="button" onClick={() => navigate("/pedidos")} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
