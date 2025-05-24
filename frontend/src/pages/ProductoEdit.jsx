"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductoById, updateProducto } from "../api/productos"
import { Package, DollarSign, Archive, Save, ArrowLeft, Loader } from "lucide-react"

export default function ProductoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nombre: "", precio: "", stock: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id)
        setFormData({ nombre: data.nombre, precio: data.precio, stock: data.stock })
      } catch {
        setError("Error al cargar producto")
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
      await updateProducto(id, {
        nombre: formData.nombre,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock, 10),
      })
      navigate("/productos")
    } catch {
      setError("Error al actualizar producto")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Cargando producto...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate("/productos")} className="btn-primary">
              Volver a Productos
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
            <button onClick={() => navigate("/productos")} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
              <p className="text-gray-600">Actualiza la información del producto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información del Producto</h3>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Nombre del producto</span>
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ej: Laptop Dell XPS 13"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Precio</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="form-label flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span>Stock</span>
                </label>
                <div className="relative">
                  <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
              <button type="button" onClick={() => navigate("/productos")} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
