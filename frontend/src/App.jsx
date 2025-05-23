/*
2) Rutas - frontend/src/App.jsx
   - Importar página de edición y agregar ruta
*/

// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Clientes from './pages/Clientes';
import ClienteEdit from './pages/ClienteEdit';
import Productos from './pages/Productos';
import ProductoEdit from './pages/ProductoEdit';
import Pedidos from './pages/Pedidos';
import Tracking from './pages/Tracking';

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 space-x-4">
        <Link to="/clientes">Clientes</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/pedidos">Pedidos</Link>
        <Link to="/tracking">Tracking</Link>
      </nav>
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/editar/:id" element={<ClienteEdit />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/editar/:id" element={<ProductoEdit />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </Router>
  );
}

export default App;