"use client"

import { useState, useEffect } from "react"
import { getTrackings, createTracking } from "../api/tracking"
import { getPedidos } from "../api/pedidos"
import { getClientes } from "../api/clientes"
import TrackingCard from "../components/TrackingCard"
import { MapPin, Plus, Search, Navigation, Clock, TrendingUp, Loader } from "lucide-react"

export default function Tracking() {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    id_pedido: "",
    id_cliente: "",
    estado: "",
    ubicacion: "",
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [trk, ped, cli] = await Promise.all([getTrackings(), getPedidos(), getClientes()])
      setRecords(trk)
      setFilteredRecords(trk)
      setPedidos(ped)
      setClientes(cli)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = records.filter(
      (record) =>
        record.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id_pedido.toString().includes(searchTerm) ||
        record.id_cliente.toString().includes(searchTerm),
    )
    setFilteredRecords(filtered)
  }, [searchTerm, records])

  const handleDelete = (id) => setRecords((rs) => rs.filter((r) => r.id !== id))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((fd) => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("Enviando:", formData)
      await createTracking(formData)
      setFormData({ id_pedido: "", id_cliente: "", estado: "", ubicacion: "" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error("Error creando:", err)
      alert(err.message)
    }
  }

  // Estadísticas
  const totalRegistros = records.length
  const enTransito = records.filter((r) => r.estado.toLowerCase().includes("tránsito")).length
  const entregados = records.filter((r) => r.estado.toLowerCase().includes("entregado")).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Cargando tracking...</span>
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
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                <p className="text-2xl font-semibold text-gray-900">{totalRegistros}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Tránsito</p>
                <p className="text-2xl font-semibold text-gray-900">{enTransito}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-semibold text-gray-900">{entregados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resultados</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredRecords.length}</p>
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
                placeholder="Buscar por estado, ubicación, pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{showForm ? "Cancelar" : "Nuevo Registro"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Registro de Tracking</h3>
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
                    <option value="">Seleccione pedido</option>
                    {pedidos.map((p) => (
                      <option key={p.id_pedido} value={p.id_pedido}>
                        Pedido #{p.id_pedido}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Cliente</label>
                  <select
                    name="id_cliente"
                    value={formData.id_cliente}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Seleccione cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Estado</label>
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
                  <label className="form-label">Ubicación</label>
                  <input
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ej: Centro de distribución"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Guardar Registro
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de registros */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron registros" : "No hay registros de tracking"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer registro"}
                </p>
                {!searchTerm && (
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Crear Primer Registro
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredRecords.map((r) => <TrackingCard key={r.id} record={r} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
