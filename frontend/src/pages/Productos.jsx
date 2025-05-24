"use client"

import { useEffect, useState } from "react"
import { getProductos, createProducto } from "../api/productos"
import ProductoCard from "../components/ProductoCard"
import { Package, Plus, Search, TrendingUp, DollarSign, Archive, Loader } from "lucide-react"

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ nombre: "", precio: "", stock: "" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductos()
      setProductos(data)
      setFilteredProductos(data)
    } catch (err) {
      setError("Error al cargar los productos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = productos.filter((producto) => producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredProductos(filtered)
  }, [searchTerm, productos])

  const handleDelete = (id) => {
    setProductos((prev) => prev.filter((p) => p.id_producto !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createProducto({
        nombre: formData.nombre,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock, 10),
      })
      setFormData({ nombre: "", precio: "", stock: "" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error(err)
      alert("Error al crear producto")
    }
  }

  // Calcular estadísticas
  const totalProductos = productos.length
  const valorInventario = productos.reduce((sum, p) => sum + p.precio * p.stock, 0)
  const stockBajo = productos.filter((p) => p.stock < 10).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Cargando productos...</span>
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
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-semibold text-gray-900">{totalProductos}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
                <p className="text-2xl font-semibold text-gray-900">${valorInventario.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-semibold text-gray-900">{stockBajo}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resultados</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredProductos.length}</p>
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
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{showForm ? "Cancelar" : "Nuevo Producto"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Producto</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nombre del producto</label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ej: Laptop Dell XPS 13"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Precio</label>
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
                  <label className="form-label">Stock inicial</label>
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
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Guardar Producto
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="space-y-4">
        {filteredProductos.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
                </p>
                {!searchTerm && (
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Crear Primer Producto
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredProductos.map((producto) => (
            <ProductoCard key={producto.id_producto} producto={producto} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}
