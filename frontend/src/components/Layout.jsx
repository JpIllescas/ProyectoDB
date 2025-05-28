"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Package,
  Users,
  ShoppingCart,
  FileText,
  MapPin,
  Menu,
  X,
  Home,
  TrendingUp,
  Bell,
  Settings,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, color: "text-blue-600" },
  { name: "Clientes", href: "/clientes", icon: Users, color: "text-emerald-600" },
  { name: "Productos", href: "/productos", icon: Package, color: "text-purple-600" },
  { name: "Pedidos", href: "/pedidos", icon: ShoppingCart, color: "text-indigo-600" },
  { name: "Detalles", href: "/detalles", icon: FileText, color: "text-teal-600" },
  { name: "Tracking", href: "/tracking", icon: MapPin, color: "text-orange-600" },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"
    }
    return "light"
  })
  const location = useLocation()
  const settingsRef = useRef(null)

  // Aplicar tema al documento
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme)
      localStorage.setItem("theme", theme)

      // Para el tema sistema, detectar preferencia del usuario
      if (theme === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const applySystemTheme = () => {
          document.documentElement.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light")
        }

        applySystemTheme()
        mediaQuery.addEventListener("change", applySystemTheme)

        return () => mediaQuery.removeEventListener("change", applySystemTheme)
      }
    }
  }, [theme])

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false)
      }
    }

    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [settingsOpen])

  // Cerrar sidebar móvil cuando cambia la ruta
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setSettingsOpen(false)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon style={{ width: "20px", height: "20px" }} />
      case "light":
        return <Sun style={{ width: "20px", height: "20px" }} />
      default:
        return <Monitor style={{ width: "20px", height: "20px" }} />
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)" }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            style={{ background: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(4px)" }}
          />
          <div className="sidebar-modern">
            <div className="sidebar-header">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "white",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <TrendingUp style={{ width: "24px", height: "24px", color: "#2563eb" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>ShipFlow</span>
                    <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>Jp y SHolweger</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    color: "white",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.1)")}
                  onMouseLeave={(e) => (e.target.style.background = "none")}
                >
                  <X style={{ width: "24px", height: "24px" }} />
                </button>
              </div>
            </div>
            <nav className="sidebar-nav">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`nav-item ${isActive ? "active" : ""}`}
                  >
                    <item.icon className="nav-icon" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="sidebar-modern hidden lg:flex lg:flex-col">
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <TrendingUp style={{ width: "24px", height: "24px", color: "#2563eb" }} />
            </div>
            <div>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>ShipFlow</span>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>JpIllescas y SHolweger</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.name} to={item.href} className={`nav-item ${isActive ? "active" : ""}`}>
                <item.icon className="nav-icon" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>A</span>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "white", margin: 0 }}>Admin User</p>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>Sistema Activo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#374151",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f3f4f6"
              e.target.style.color = "#111827"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none"
              e.target.style.color = "#374151"
            }}
          >
            <Menu style={{ height: "24px", width: "24px" }} />
          </button>

          <div style={{ display: "flex", flex: 1, gap: "24px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>
                {navigation.find((item) => item.href === location.pathname)?.name || "Dashboard"}
              </h1>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                style={{
                  padding: "8px",
                  color: "#9ca3af",
                  background: "none",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f3f4f6"
                  e.target.style.color = "#374151"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none"
                  e.target.style.color = "#9ca3af"
                }}
              >
                <Bell style={{ height: "24px", width: "24px" }} />
              </button>

              {/* Settings dropdown */}
              <div style={{ position: "relative" }} ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  style={{
                    padding: "8px",
                    color: settingsOpen ? "#374151" : "#9ca3af",
                    background: settingsOpen ? "#f3f4f6" : "none",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!settingsOpen) {
                      e.target.style.background = "#f3f4f6"
                      e.target.style.color = "#374151"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!settingsOpen) {
                      e.target.style.background = "none"
                      e.target.style.color = "#9ca3af"
                    }
                  }}
                >
                  <Settings style={{ height: "24px", width: "24px" }} />
                </button>

                {settingsOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      marginTop: "8px",
                      background: "white",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      border: "1px solid #e5e7eb",
                      padding: "8px",
                      minWidth: "200px",
                      zIndex: 50,
                    }}
                  >
                    <div style={{ padding: "8px 12px", borderBottom: "1px solid #f3f4f6", marginBottom: "8px" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>Configuración</p>
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <p style={{ fontSize: "12px", fontWeight: "500", color: "#6b7280", margin: "0 0 8px 12px" }}>
                        Tema
                      </p>
                      {[
                        { key: "light", label: "Claro", icon: Sun },
                        { key: "dark", label: "Oscuro", icon: Moon },
                        { key: "system", label: "Sistema", icon: Monitor },
                      ].map((themeOption) => (
                        <button
                          key={themeOption.key}
                          onClick={() => handleThemeChange(themeOption.key)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px 12px",
                            background: theme === themeOption.key ? "#f3f4f6" : "transparent",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "#374151",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (theme !== themeOption.key) {
                              e.target.style.background = "#f9fafb"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (theme !== themeOption.key) {
                              e.target.style.background = "transparent"
                            }
                          }}
                        >
                          <themeOption.icon style={{ width: "16px", height: "16px" }} />
                          <span>{themeOption.label}</span>
                          {theme === themeOption.key && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                background: "#10b981",
                                borderRadius: "50%",
                                marginLeft: "auto",
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#10b981",
                    borderRadius: "50%",
                    animation: "pulse 2s infinite",
                  }}
                ></div>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Sistema Operativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="page-content">
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}
