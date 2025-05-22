import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Tracking from './pages/Tracking';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/clientes">Clientes</Link> |{" "}
        <Link to="/productos">Productos</Link> |{" "}
        <Link to="/pedidos">Pedidos</Link> |{" "}
        <Link to="/tracking">Tracking</Link>
      </nav>
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </Router>
  );
}

export default App;
