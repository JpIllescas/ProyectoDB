"use client"

import { useEffect, useState } from "react"
import { getPedidos, createPedido } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import PedidoCard from "../components/PedidoCard"
import { ShoppingCart, Plus, Search, TrendingUp, Users, Calendar, Loader } from "lucide-react"

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [filteredPedidos, setFilteredPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ cliente_id: "", fecha: "", estado: "Pendiente" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pedData, cliData] = await Promise.all([getPedidos(), getClientes()])
      const enriched = pedData.map((p) => ({
        ...p,
        cliente: cliData.find((c) => c.id_cliente === p.id_cliente) || { nombre: "Cliente no encontrado" },
      }))
      setPedidos(enriched)
      setFilteredPedidos(enriched)
      setClientes(cliData)
    } catch {
      setError("Error al cargar datos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = pedidos.filter(
      (pedido) =>
        pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.id_pedido.toString().includes(searchTerm),
    )
    setFilteredPedidos(filtered)
  }, [searchTerm, pedidos])

  const handleDelete = (id) => setPedidos((prev) => prev.filter((p) => p.id_pedido !== id))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createPedido({
        id_cliente: Number.parseInt(formData.cliente_id, 10),
        fecha: formData.fecha,
        estado: formData.estado,
      })
      setFormData({ cliente_id: "", fecha: "", estado: "Pendiente" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error(err)
      alert("Error al crear pedido")
    }
  }

  // Estadísticas
  const totalPedidos = pedidos.length
  const pedidosPendientes = pedidos.filter((p) => p.estado === "Pendiente").length
  const pedidosEnviados = pedidos.filter((p) => p.estado === "Enviado").length
  const pedidosEntregados = pedidos.filter((p) => p.estado === "Entregado").length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Cargando pedidos...</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                <p className="text-2xl font-semibold text-gray-900">{totalPedidos}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{pedidosPendientes}</p>
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
                <p className="text-sm font-medium text-gray-600">Enviados</p>
                <p className="text-2xl font-semibold text-gray-900">{pedidosEnviados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-semibold text-gray-900">{pedidosEntregados}</p>
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
                placeholder="Buscar por cliente o número de pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{showForm ? "Cancelar" : "Nuevo Pedido"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Pedido</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Cliente</label>
                  <select
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Seleccione un cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} required className="form-input">
                    <option>Pendiente</option>
                    <option>Enviado</option>
                    <option>Entregado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Fecha</label>
                <input
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Guardar Pedido
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {filteredPedidos.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron pedidos" : "No hay pedidos registrados"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer pedido"}
                </p>
                {!searchTerm && (
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Crear Primer Pedido
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredPedidos.map((p) => <PedidoCard key={p.id_pedido} pedido={p} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
