"use client"
import { useNavigate } from "react-router-dom"
import { deleteCliente } from "../api/clientes"
import { User, Mail, Phone, Edit, Trash2 } from "lucide-react"

export default function ClienteCard({ cliente, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar cliente ${cliente.nombre}?`)) return
    try {
      await deleteCliente(cliente.id_cliente)
      onDelete(cliente.id_cliente)
    } catch (error) {
      console.error("Error eliminando cliente:", error)
      alert("No se pudo eliminar el cliente. ¿Tiene pedidos asociados?")
    }
  }

  return (
    <div className="card-modern animate-fade-in">
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.3)",
              }}
            >
              <User style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {cliente.nombre}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{cliente.email}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{cliente.telefono}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/clientes/editar/${cliente.id_cliente}`)}
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
