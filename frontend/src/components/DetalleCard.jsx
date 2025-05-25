"use client"
import { useNavigate } from "react-router-dom"
import { FileText, ShoppingCart, Package, Hash, Edit } from "lucide-react"

export default function DetalleCard({ detalle }) {
  const navigate = useNavigate()
  const { id_detalle, id_pedido, id_producto, cantidad } = detalle

  return (
    <div className="card-modern animate-fade-in">
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.3)",
              }}
            >
              <FileText style={{ width: "24px", height: "24px", color: "white" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                Detalle #{id_detalle}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShoppingCart style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>Pedido #{id_pedido}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Package style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {detalle.producto?.nombre || "Producto no encontrado"} (ID: {id_producto})
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Hash style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb" }}>{cantidad} unidades</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/detalles/editar/${id_detalle}`)}
              className="btn-secondary-modern"
              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}
            >
              <Edit style={{ width: "16px", height: "16px" }} />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
