"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDetalleById, updateDetalle } from "../api/detalles"
import { getProductos } from "../api/productos"
import { getPedidos } from "../api/pedidos"
import { FileText, ShoppingCart, Package, Hash, Save, ArrowLeft, Loader } from "lucide-react"

export default function DetalleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ id_pedido: "", id_producto: "", cantidad: "" })
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [data, prodData, pedData] = await Promise.all([getDetalleById(id), getProductos(), getPedidos()])
        setFormData({
          id_pedido: data.id_pedido,
          id_producto: data.id_producto,
          cantidad: data.cantidad,
        })
        setProductos(prodData)
        setPedidos(pedData)
      } catch {
        setError("Error al cargar detalle")
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
      await updateDetalle(id, {
        id_pedido: Number.parseInt(formData.id_pedido, 10),
        id_producto: Number.parseInt(formData.id_producto, 10),
        cantidad: Number.parseInt(formData.cantidad, 10),
      })
      navigate("/detalles")
    } catch {
      alert("Error al actualizar detalle")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Cargando detalle...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate("/detalles")} className="btn-primary">
              Volver a Detalles
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
            <button onClick={() => navigate("/detalles")} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Detalle #{id}</h1>
              <p className="text-gray-600">Actualiza la información del detalle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información del Detalle</h3>
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
                  <Package className="w-4 h-4" />
                  <span>Producto</span>
                </label>
                <select
                  name="id_producto"
                  value={formData.id_producto}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Cantidad</span>
              </label>
              <input
                name="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ej: 5"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
              <button type="button" onClick={() => navigate("/detalles")} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
