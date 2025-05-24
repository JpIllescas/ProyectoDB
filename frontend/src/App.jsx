import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Clientes from './pages/Clientes';
import ClienteEdit from './pages/ClienteEdit';
import Productos from './pages/Productos';
import ProductoEdit from './pages/ProductoEdit';
import Pedidos from './pages/Pedidos';
import PedidoEdit from './pages/PedidoEdit';
import Detalles from './pages/Detalles';
import DetalleEdit from './pages/DetalleEdit';
import Tracking from './pages/Tracking';
import TrackingEdit from './pages/TrackingEdit';

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 space-x-10">
        <Link to="/clientes">Clientes</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/pedidos">Pedidos</Link>
        <Link to="/detalles">Detalles</Link>
        <Link to="/tracking">Tracking</Link>
      </nav>
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/editar/:id" element={<ClienteEdit />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/editar/:id" element={<ProductoEdit />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/editar/:id" element={<PedidoEdit />} />
        <Route path="/detalles" element={<Detalles />} />
        <Route path="/detalles/editar/:id" element={<DetalleEdit />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/tracking/editar/:id" element={<TrackingEdit />} />
      </Routes>
    </Router>
  );
}

export default App;