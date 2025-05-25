"use client"
import { useNavigate } from "react-router-dom"
import { deletePedido } from "../api/pedidos"
import { ShoppingCart, User, Calendar, Package, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function PedidoCard({ pedido, onDelete }) {
  const navigate = useNavigate()

  const { id_pedido, cliente = { nombre: "Cliente no encontrado" }, fecha, estado } = pedido || {}

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar pedido #${id_pedido}?`)) return
    try {
      await deletePedido(id_pedido)
      onDelete(id_pedido)
    } catch (error) {
      console.error("Error eliminando pedido:", error)
      alert("No se pudo eliminar el pedido.")
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Entregado":
        return { color: "#059669", icon: CheckCircle, bgColor: "#ecfdf5", textColor: "#065f46" }
      case "Enviado":
        return { color: "#2563eb", icon: Package, bgColor: "#eff6ff", textColor: "#1e40af" }
      case "Pendiente":
        return { color: "#d97706", icon: Clock, bgColor: "#fffbeb", textColor: "#92400e" }
      default:
        return { color: "#6b7280", icon: AlertCircle, bgColor: "#f9fafb", textColor: "#374151" }
    }
  }

  const statusConfig = getStatusConfig(estado)

  return (
    <div className="card-modern animate-fade-in">
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.3)",
              }}
            >
              <ShoppingCart style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                  Pedido #{id_pedido}
                </h3>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: statusConfig.bgColor,
                    color: statusConfig.textColor,
                  }}
                >
                  <statusConfig.icon style={{ width: "12px", height: "12px" }} />
                  <span>{estado}</span>
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <User style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{cliente.nombre}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Calendar style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {fecha ? new Date(fecha).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/pedidos/editar/${id_pedido}`)}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}
            >
              <Edit style={{ width: "16px", height: "16px" }} />
              <span>Editar</span>
            </button>
            <button
              onClick={handleDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px 0 rgba(239, 68, 68, 0.3)",
              }}
            >
              <Trash2 style={{ width: "16px", height: "16px" }} />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
