import { useEffect, useState } from 'react';
import { getProductos, crearProducto } from '../api/productos';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await crearProducto({
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10)
    });
    setNombre(''); setPrecio(''); setStock('');
    load();
  };

  return (
    <div>
      <h1>Productos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
          required
        />
        <button type="submit">Crear Producto</button>
      </form>

      <ul>
        {productos.map(p => (
          <li key={p.id_producto}>
            {p.nombre} — ${p.precio} — Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
