/*
4) Página de edición - frontend/src/pages/ClienteEdit.jsx
   - Formulario para editar, carga datos, actualiza y redirige
*/

// frontend/src/pages/ClienteEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById, updateCliente } from '../api/clientes';

export default function ClienteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCliente() {
      try {
        const data = await getClienteById(id);
        setFormData({ nombre: data.nombre, email: data.email, telefono: data.telefono });
      } catch (err) {
        setError('No se pudo cargar el cliente');
      } finally {
        setLoading(false);
      }
    }
    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCliente(id, formData);
      navigate('/clientes');
    } catch (err) {
      setError('Error al actualizar');
    }
  };

  if (loading) return <p>Cargando cliente...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Editar Cliente</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre</label><br />
          <input name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label><br />
          <input name="email" type="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Teléfono</label><br />
          <input name="telefono" value={formData.telefono} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar Cambios</button>
      </form>
    </div>
  );
}
