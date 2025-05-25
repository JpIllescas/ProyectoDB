"use client"
import { useNavigate } from "react-router-dom"
import { deleteProducto } from "../api/productos"
import { Package, DollarSign, Archive, Edit, Trash2, AlertTriangle } from "lucide-react"

export default function ProductoCard({ producto, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar producto ${producto.nombre}?`)) return
    try {
      await deleteProducto(producto.id_producto)
      onDelete(producto.id_producto)
    } catch (error) {
      console.error("Error eliminando producto:", error)
      alert("No se pudo eliminar el producto.")
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "#dc2626", text: "Sin stock", icon: AlertTriangle }
    if (stock < 10) return { color: "#d97706", text: "Stock bajo", icon: AlertTriangle }
    return { color: "#059669", text: "En stock", icon: Archive }
  }

  const stockStatus = getStockStatus(producto.stock)

  return (
    <div className="card-modern animate-fade-in">
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
              }}
            >
              <Package style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {producto.nombre}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <DollarSign style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#059669" }}>${producto.precio}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <stockStatus.icon style={{ width: "16px", height: "16px", color: stockStatus.color }} />
                  <span style={{ fontSize: "14px", fontWeight: "500", color: stockStatus.color }}>
                    {producto.stock} unidades - {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/productos/editar/${producto.id_producto}`)}
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
