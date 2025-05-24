"use client"

import { useEffect, useState } from "react"
import { getProductos } from "../api/productos"
import { getDetalles, createDetalle } from "../api/detalles"
import { getPedidos } from "../api/pedidos"
import DetalleCard from "../components/DetalleCard"
import { FileText, Plus, Search, ShoppingCart, Hash, Loader } from "lucide-react"

export default function Detalles() {
  const [detalles, setDetalles] = useState([])
  const [filteredDetalles, setFilteredDetalles] = useState([])
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ id_pedido: "", id_producto: "", cantidad: "" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, prodData, pedData] = await Promise.all([getDetalles(), getProductos(), getPedidos()])
      const enriched = data.map((d) => ({
        ...d,
        producto: prodData.find((p) => p.id_producto === d.id_producto) || { nombre: "Desconocido" },
      }))
      setDetalles(enriched)
      setFilteredDetalles(enriched)
      setProductos(prodData)
      setPedidos(pedData)
    } catch {
      setError("Error cargando detalles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = detalles.filter(
      (detalle) =>
        detalle.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detalle.id_pedido.toString().includes(searchTerm) ||
        detalle.id_detalle.toString().includes(searchTerm),
    )
    setFilteredDetalles(filtered)
  }, [searchTerm, detalles])

  const handleDelete = (id) => setDetalles((prev) => prev.filter((d) => d.id_detalle !== id))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createDetalle({
        id_pedido: Number.parseInt(formData.id_pedido, 10),
        id_producto: Number.parseInt(formData.id_producto, 10),
        cantidad: Number.parseInt(formData.cantidad, 10),
      })
      setFormData({ id_pedido: "", id_producto: "", cantidad: "" })
      setShowForm(false)
      fetchData()
    } catch {
      alert("Error al crear detalle")
    }
  }

  // Estadísticas
  const totalDetalles = detalles.length
  const totalUnidades = detalles.reduce((sum, d) => sum + d.cantidad, 0)
  const pedidosUnicos = new Set(detalles.map((d) => d.id_pedido)).size

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Cargando detalles...</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-red-600">{error}</p>
            <button onClick={fetchData} className="btn-primary mt-4">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Detalles</p>
                <p className="text-2xl font-semibold text-gray-900">{totalDetalles}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Unidades</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUnidades}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pedidos Únicos</p>
                <p className="text-2xl font-semibold text-gray-900">{pedidosUnicos}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por producto, pedido o detalle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{showForm ? "Cancelar" : "Nuevo Detalle"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Detalle</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Pedido</label>
                  <select
                    name="id_pedido"
                    value={formData.id_pedido}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Seleccione un pedido...</option>
                    {pedidos.map((p) => (
                      <option key={p.id_pedido} value={p.id_pedido}>
                        Pedido #{p.id_pedido}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Producto</label>
                  <select
                    name="id_producto"
                    value={formData.id_producto}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Seleccione un producto...</option>
                    {productos.map((p) => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Cantidad</label>
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
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Guardar Detalle
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de detalles */}
      <div className="space-y-4">
        {filteredDetalles.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron detalles" : "No hay detalles registrados"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer detalle"}
                </p>
                {!searchTerm && (
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Crear Primer Detalle
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredDetalles.map((d) => <DetalleCard key={d.id_detalle} detalle={d} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
