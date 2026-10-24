import { useNavigate } from "react-router-dom"
import { FaChevronLeft } from "react-icons/fa"
import { cloudinaryThumb } from "../lib/imageUrl"
import { useComparador } from "../contexts/ComparadorContext"

const WHATSAPP = "5493513232880"

const formatPrecio = (precio, moneda) => {
  const num = Math.floor(Number(precio))
  const formatted = num.toLocaleString("es-AR")
  return moneda === "USD" ? `USD ${formatted}` : `$ ${formatted}`
}

const formatNumero = (n) => Number(n || 0).toLocaleString("es-AR")

const precioComparable = (v) => (v.moneda === "USD" ? Number(v.precio) * 1100 : Number(v.precio))

export const Comparar = () => {
  const { seleccionados, quitarVehiculo, limpiar } = useComparador()
  const navigate = useNavigate()

  if (seleccionados.length === 0) {
    return (
      <>
       
        <div
          className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
          style={{ background: "var(--background)" }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
          >
            <svg
              className="w-9 h-9"
              style={{ color: "var(--muted-foreground)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-3 text-center" style={{ color: "var(--foreground)" }}>
            No hay vehículos para comparar
          </h1>
          <p className="text-sm mb-8 text-center max-w-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Agregá hasta 2 vehículos desde el catálogo usando el botón &quot;Comparar&quot; en cada tarjeta.
          </p>
          <button
            onClick={() => navigate("/usados")}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Ir al catálogo
          </button>
        </div>
        
      </>
    )
  }

  const filas = [
    {
      label: "Precio",
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 8v1m-2.599-1A2.25 2.25 0 007 15m0 0H5m14 0h-2m-7-5.5A2.25 2.25 0 0112 8" />
      ),
      get: (v) => formatPrecio(v.precio, v.moneda),
      mejor: (vs) => {
        const vals = vs.map(precioComparable)
        const min = Math.min(...vals)
        return vals.map((x) => x === min)
      },
      descripcionMejor: "Menor precio",
    },
    {
      label: "Año",
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
      get: (v) => v.año || "-",
      mejor: (vs) => {
        const vals = vs.map((v) => Number(v.año) || 0)
        const max = Math.max(...vals)
        return vals.map((x) => x === max)
      },
      descripcionMejor: "Más nuevo",
    },
    {
      label: "Kilometraje",
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      get: (v) => `${formatNumero(v.kilometros)} km`,
      mejor: (vs) => {
        const vals = vs.map((v) => Number(v.kilometros) || 0)
        const min = Math.min(...vals)
        return vals.map((x) => x === min)
      },
      descripcionMejor: "Menos km",
    },
    {
      label: "Transmisión",
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      ),
      get: (v) => v.transmision || "-",
    },
    {
      label: "Combustible",
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      get: (v) => v.combustible || "-",
    },
    {
      label: "Estado",
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      get: (v) => (v.estado === "nuevo" ? "0 km" : "Usado"),
    },
    
  ]

  if (seleccionados.some((v) => v.categoria === "moto")) {
    filas.push({
      label: "Tipo",
      icono: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4" />),
      get: (v) => v.tipo || "-",
    })
    filas.push({
      label: "Cilindrada",
      icono: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />),
      get: (v) => (v.cilindrada ? `${v.cilindrada} cc` : "-"),
    })
  }

  const cols = seleccionados.length

  return (
    <>
      
      <div className="min-h-screen" style={{ background: "var(--background)" }}>

        {/* Hero header */}
        <div
          className="px-4 py-10 md:py-14 text-center"
          style={{
            background: "linear-gradient(180deg, rgba(220,38,38,0.06) 0%, transparent 100%)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 mt-20"
            style={{ background: "rgba(220,38,38,0.12)", color: "var(--primary)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            Comparativa
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-balance" style={{ color: "var(--foreground)" }}>
            Compará lado a lado
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Las mejores características están resaltadas con una marca roja.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Cards de vehículos */}
          <div className={`grid gap-4 mb-8 ${cols === 2 ? "grid-cols-2" : "grid-cols-1 max-w-xs mx-auto"}`}>
            {seleccionados.map((v) => {
              const imagen = v.imagenes?.[0] ? cloudinaryThumb(v.imagenes[0], 600) : null
              return (
                <div
                  key={v.id}
                  className="rounded-2xl overflow-hidden relative"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  {/* Foto */}
                  <div
                    className="relative cursor-pointer overflow-hidden"
                    style={{ height: "200px", background: "var(--secondary)" }}
                    onClick={() => navigate(`/${v.ruta || "usados"}/${v.id}`)}
                  >
                    {imagen ? (
                      <img
                        src={imagen}
                        alt={`${v.marca} ${v.modelo}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Badge año */}
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: "rgba(0,0,0,0.75)", color: "white", backdropFilter: "blur(4px)" }}
                    >
                      {v.año || "-"}
                    </div>
                    {/* Boton quitar */}
                    <button
                      onClick={(e) => { e.stopPropagation(); quitarVehiculo(v.id) }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-red-700"
                      style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
                      aria-label="Quitar vehiculo"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2
                      className="font-black text-base leading-tight mb-1 cursor-pointer hover:underline"
                      style={{ color: "var(--foreground)" }}
                      onClick={() => navigate(`/${v.ruta || "usados"}/${v.id}`)}
                    >
                      {v.marca} {v.modelo}
                    </h2>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                      {v.transmision} · {v.combustible}
                    </p>
                    <div
                      className="text-xl font-black"
                      style={{ color: "var(--primary)" }}
                    >
                      {formatPrecio(v.precio, v.moneda)}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Slot vacio */}
            {seleccionados.length < 2 && (
              <button
                onClick={() => navigate("/usados")}
                className="rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[280px] transition-all hover:border-red-600 group"
                style={{ border: "2px dashed var(--border)", background: "transparent" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors group-hover:bg-red-600"
                  style={{ background: "var(--secondary)" }}
                >
                  <svg className="w-5 h-5" style={{ color: "var(--foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                  Agregar vehículo
                </span>
              </button>
            )}
          </div>

          {/* Tabla de comparación */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {/* Header tabla */}
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
            >
              <svg className="w-4 h-4" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                Especificaciones
              </span>
            </div>

            {filas.map((fila, idx) => {
              const ganadores = fila.mejor ? fila.mejor(seleccionados) : seleccionados.map(() => false)
              const hayGanador = fila.mejor && ganadores.filter(Boolean).length < cols

              return (
                <div
                  key={fila.label}
                  style={{
                    background: idx % 2 === 0 ? "var(--background)" : "var(--card)",
                    borderBottom: idx < filas.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  {/* MOBILE: label arriba, valores abajo en dos columnas */}
                  <div className="md:hidden">
                    {/* Label row */}
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {fila.icono}
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                        {fila.label}
                      </span>
                    </div>
                    {/* Valores row */}
                    <div className="grid pb-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                      {seleccionados.map((v, i) => {
                        const esGanador = hayGanador && ganadores[i]
                        return (
                          <div
                            key={v.id}
                            className="px-4 py-1.5 flex flex-col gap-1"
                            style={{
                              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                              background: esGanador ? "rgba(220,38,38,0.04)" : "transparent",
                            }}
                          >
                            {esGanador && (
                              <span
                                className="text-xs font-bold px-1.5 py-0.5 rounded-md w-fit"
                                style={{ background: "rgba(220,38,38,0.15)", color: "var(--primary)" }}
                              >
                                {fila.descripcionMejor || "Mejor"}
                              </span>
                            )}
                            <span
                              className="text-sm"
                              style={{
                                color: esGanador ? "var(--foreground)" : "var(--muted-foreground)",
                                fontWeight: esGanador ? 700 : 500,
                              }}
                            >
                              {fila.get(v)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* DESKTOP: 3 columnas (label | v1 | v2) */}
                  <div
                    className="hidden md:grid"
                    style={{ gridTemplateColumns: `1fr repeat(${cols}, 1fr)` }}
                  >
                    <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderRight: "1px solid var(--border)" }}>
                      <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {fila.icono}
                      </svg>
                      <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                        {fila.label}
                      </span>
                    </div>
                    {seleccionados.map((v, i) => {
                      const esGanador = hayGanador && ganadores[i]
                      return (
                        <div
                          key={v.id}
                          className="px-5 py-4 flex items-center gap-2"
                          style={{
                            borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                            background: esGanador ? "rgba(220,38,38,0.04)" : "transparent",
                          }}
                        >
                          {esGanador && (
                            <span
                              className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-md"
                              style={{ background: "rgba(220,38,38,0.15)", color: "var(--primary)" }}
                            >
                              {fila.descripcionMejor || "Mejor"}
                            </span>
                          )}
                          <span
                            className="text-sm font-semibold"
                            style={{
                              color: esGanador ? "var(--foreground)" : "var(--muted-foreground)",
                              fontWeight: esGanador ? 700 : 500,
                            }}
                          >
                            {fila.get(v)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTAs finales */}
          <div className={`grid gap-4 mt-6 ${cols === 2 ? "grid-cols-2" : "grid-cols-1 max-w-xs mx-auto"}`}>
            {seleccionados.map((v) => {
              const mensaje = encodeURIComponent(
                `Hola! Me interesa el ${v.marca} ${v.modelo} ${v.año || ""}. Lo vi en la comparativa de la web.`,
              )
              return (
                <div
                  key={v.id}
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <p className="text-xs font-semibold text-center" style={{ color: "var(--muted-foreground)" }}>
                    {v.marca} {v.modelo}
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${mensaje}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-black transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Me interesa este
                  </a>
                  <button
                    onClick={() => navigate(`/${v.ruta || "usados"}/${v.id}`)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                  >
                    Ver detalle completo
                  </button>
                </div>
              )
            })}
          </div>

          {/* Vaciar */}
          <div className="mt-8 text-center">
           <button
                       onClick={() => navigate(-1)}
                       className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-80 active:scale-95 cursor-pointer"
                       style={{ color: "#ffffff" }}
                     >
                       <FaChevronLeft size={12} />
                       Volver al listado
                     </button>
          </div>

        </div>
      </div>
     
    </>
  )
}

export default Comparar
