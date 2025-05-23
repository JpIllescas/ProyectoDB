/*
File: frontend/src/pages/Clientes.jsx
Descripción: Página con recarga tras creación para evitar duplicados.
*/
import React, { useEffect, useState } from 'react';
import { getClientes, createCliente } from '../api/clientes';
import ClienteCard from '../components/ClienteCard';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError('Error al cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setClientes((prev) => prev.filter((c) => c.id_cliente !== id));
  };

  const handleEdit = (cliente) => {
    console.log('Editar cliente:', cliente);
    // implementar navegación o modal de edición
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      await fetchData();
      setFormData({ nombre: '', email: '', telefono: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error al crear cliente:', err);
      alert('Error al crear cliente.');
    }
  };

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Clientes</h1>
      <button
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? 'Cancelar' : 'Crear Cliente'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Nombre</label><br />
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Email</label><br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Teléfono</label><br />
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Guardar</button>
        </form>
      )}

      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        clientes.map((cliente) => (
          <ClienteCard
            key={cliente.id_cliente}
            cliente={cliente}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      )}
    </div>
  );
}
