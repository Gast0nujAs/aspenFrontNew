import { useNavigate, useLocation } from "react-router-dom"
import { cloudinaryThumb } from "../lib/imageUrl"
import { useComparador } from "../contexts/ComparadorContext"

const BarraComparador = () => {
  const { seleccionados, quitarVehiculo, limpiar, max } = useComparador()
  const navigate = useNavigate()
  const location = useLocation()

  // No mostrar si no hay seleccionados o si ya estamos en la pagina de comparar
  if (seleccionados.length === 0 || location.pathname === "/comparar") return null

  const formatPrecio = (precio, moneda) => {
    const num = Math.floor(Number(precio))
    const formatted = num.toLocaleString("es-AR")
    return moneda === "USD" ? `USD ${formatted}` : `$ ${formatted}`
  }

  const puedeComparar = seleccionados.length === max

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none"
      style={{ animation: "slideUpBar 0.3s ease-out" }}
    >
      <style>{`
        @keyframes slideUpBar {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div
        className="pointer-events-auto mx-auto max-w-4xl rounded-2xl shadow-2xl p-3 md:p-4 "
        style={{
          background: "rgba(141, 174, 221, 0.25)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-3 md:gap-4 ">
          {/* Slots de vehiculos */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {Array.from({ length: max }).map((_, i) => {
              const v = seleccionados[i]
              if (v) {
                const imagen = v.imagenes?.[0] ? cloudinaryThumb(v.imagenes[0], 120) : null
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 rounded-xl p-2 pr-2.5 min-w-0 flex-1 md:flex-none md:w-60"
                    style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                  >
                    <div className="relative flex-shrink-0">
                      {imagen ? (
                        <img
                          src={imagen || "/placeholder.svg"}
                          alt={`${v.marca} ${v.modelo}`}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg" style={{ background: "var(--muted)" }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate leading-tight" style={{ color: "var(--foreground)" }}>
                        {v.marca} {v.modelo}
                      </p>
                      <p className="text-xs font-bold truncate mt-0.5" style={{ color: "var(--primary)" }}>
                        {formatPrecio(v.precio, v.moneda)}
                      </p>
                    </div>
                    <button
                      onClick={() => quitarVehiculo(v.id)}
                      aria-label="Quitar vehiculo"
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center mx-[-15px] md:mx-0 justify-center transition-colors hover:bg-red-700"
                      style={{ background: "rgba(0,0,0,0.4)", color: "white" }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              }
              // Slot vacio
              return (
                <div
                  key={`empty-${i}`}
                  className="hidden md:flex items-center justify-center rounded-xl w-60 h-[72px] text-xs"
                  style={{
                    border: "1px dashed var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Elegí otro vehículo
                </div>
              )
            })}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate("/comparar")}
              disabled={!puedeComparar}
              className="px-4 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              style={{ background: "var(--primary)", color: "white" }}
            >
              Comparar
            </button>
            <button
              onClick={limpiar}
              aria-label="Vaciar comparador"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hint cuando falta el segundo */}
        {!puedeComparar && (
          <p className="text-xs mt-2 text-center md:text-left" style={{ color: "var(--muted-foreground)" }}>
            Seleccioná {max - seleccionados.length} vehículo más para comparar.
          </p>
        )}
      </div>
    </div>
  )
}

export default BarraComparador