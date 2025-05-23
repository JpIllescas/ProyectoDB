// 4) Página edit: frontend/src/pages/PedidoEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById, updatePedido } from '../api/pedidos';
import { getClientes } from '../api/clientes';

export default function PedidoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ cliente_id: '', fecha: '', estado: '' });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [pedido, cliData, prodData] = await Promise.all([
          getPedidoById(id), getClientes()
        ]);
        setFormData({
          cliente_id: pedido.id_cliente,
          fecha: pedido.fecha.split('T')[0], // yyyy-mm-dd
          estado: pedido.estado
        });
        setClientes(cliData);
      } catch {
        setError('Error al cargar datos.');
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updatePedido(id, {
        id_cliente:  parseInt(formData.cliente_id,  10),
        fecha:       formData.fecha,
        estado:      formData.estado
      });
      navigate('/pedidos');
    } catch {
      setError('Error al actualizar pedido');
    }
  };

  if (loading) return <p>Cargando pedido...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Editar Pedido #{id}</h1>
      <form onSubmit={handleSubmit}>
        {/* Reusar campos de selección e inputs precargados */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Cliente</label><br />
          <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Fecha</label><br />
          <input name="fecha" type="date" value={formData.fecha} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Estado</label><br />
          <select name="estado" value={formData.estado} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            <option>Pendiente</option>
            <option>Enviado</option>
            <option>Entregado</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar Cambios</button>
      </form>
    </div>
  );
}
