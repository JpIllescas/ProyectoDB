"use client"
import { useNavigate } from "react-router-dom"
import { deleteTracking } from "../api/tracking"
import { MapPin, User, ShoppingCart, Clock, Edit, Trash2, Navigation } from "lucide-react"

export default function TrackingCard({ record, onDelete }) {
  const navigate = useNavigate()
  const { id, id_pedido, id_cliente, estado, ubicacion, timestamp } = record

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar registro #${id}?`)) return
    try {
      await deleteTracking(id)
      onDelete(id)
    } catch (err) {
      console.error("Error eliminando:", err)
      alert(err.message)
    }
  }

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "entregado":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200"
      case "en tránsito":
      case "en transito":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "pendiente":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  return (
    <div className="card-modern animate-fade-in">
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.3)",
              }}
            >
              <MapPin style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Registro #{id}</h3>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className={getStatusColor(estado)}
                >
                  {estado}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShoppingCart style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>Pedido #{id_pedido}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <User style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {record.cliente?.nombre || `Cliente #${id_cliente}`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Navigation style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{ubicacion}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {timestamp ? new Date(timestamp).toLocaleString() : "Sin fecha"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/tracking/editar/${id}`)}
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
