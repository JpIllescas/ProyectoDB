import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"
import Clientes from "./pages/Clientes"
import ClienteEdit from "./pages/ClienteEdit"
import Productos from "./pages/Productos"
import ProductoEdit from "./pages/ProductoEdit"
import Pedidos from "./pages/Pedidos"
import PedidoEdit from "./pages/PedidoEdit"
import Detalles from "./pages/Detalles"
import DetalleEdit from "./pages/DetalleEdit"
import Tracking from "./pages/Tracking"
import TrackingEdit from "./pages/TrackingEdit"
import MySQLView from "./pages/MySQLView"

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
          <Route path="/mysql-view" element={<MySQLView />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
