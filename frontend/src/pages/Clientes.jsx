"use client"

import { useEffect, useState } from "react"
import { getClientes, createCliente } from "../api/clientes"
import ClienteCard from "../components/ClienteCard"
import { Users, Plus, Search, UserPlus, Loader } from "lucide-react"

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getClientes()
      setClientes(data)
      setFilteredClientes(data)
    } catch (err) {
      setError("Error al cargar los clientes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClientes(filtered)
  }, [searchTerm, clientes])

  const handleDelete = (id) => {
    setClientes((prev) => prev.filter((c) => c.id_cliente !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCliente(formData)
      await fetchData()
      setFormData({ nombre: "", email: "", telefono: "" })
      setShowForm(false)
    } catch (err) {
      console.error("Error al crear cliente:", err)
      alert("Error al crear cliente.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando clientes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-semibold text-gray-900">{clientes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nuevos este mes</p>
                <p className="text-2xl font-semibold text-gray-900">+{Math.floor(clientes.length * 0.1)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resultados</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredClientes.length}</p>
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
                placeholder="Buscar clientes por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{showForm ? "Cancelar" : "Nuevo Cliente"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Cliente</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nombre completo</label>
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
                  <label className="form-label">Teléfono</label>
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
                <label className="form-label">Email</label>
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
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Guardar Cliente
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="space-y-4">
        {filteredClientes.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer cliente"}
                </p>
                {!searchTerm && (
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Crear Primer Cliente
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredClientes.map((cliente) => (
            <ClienteCard key={cliente.id_cliente} cliente={cliente} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}
