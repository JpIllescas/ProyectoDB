// 3) Página list/create: frontend/src/pages/Pedidos.jsx
import React, { useEffect, useState } from 'react';
import { getPedidos, createPedido } from '../api/pedidos';
import { getClientes } from '../api/clientes';
import PedidoCard from '../components/PedidoCard';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ cliente_id: '', fecha: '', estado: 'Pendiente' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedData, cliData, prodData] = await Promise.all([
        getPedidos(), getClientes()
      ]);
      // Enriquecemos cada pedido con sus objetos cliente/producto
      const enriched = pedData.map(p => ({
        ...p,
        cliente:  cliData.find(c => c.id_cliente === p.id_cliente) || { nombre: 'Cliente no encontrado' },
      }));
      setPedidos(enriched);
      setClientes(cliData);
    } catch {
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = id => setPedidos(prev => prev.filter(p => p.id_pedido !== id));

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createPedido({
        id_cliente:  parseInt(formData.cliente_id,  10),
        fecha:       formData.fecha,
        estado:      formData.estado
      });
      setFormData({ cliente_id: '', fecha: '', estado: 'Pendiente' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al crear pedido');
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '1rem' }}>
      <h1>Pedidos</h1>
      <button style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }} onClick={() => setShowForm(v => !v)}>
        {showForm ? 'Cancelar' : 'Nuevo Pedido'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Cliente</label><br />
            <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
              <option value="">Seleccione...</option>
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
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar Pedido</button>
        </form>
      )}

      {pedidos.length === 0 ? <p>No hay pedidos.</p> : pedidos.map(p => (
        <PedidoCard key={p.id_pedido} pedido={p} onDelete={handleDelete} />
      ))}
    </div>
  );
}

