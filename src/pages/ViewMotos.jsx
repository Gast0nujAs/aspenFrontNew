import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"

import { FaWhatsapp, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import api from "../api/axios"
import { cloudinaryThumb } from "../lib/imageUrl"

const MARCAS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Bajaj", "Motomel", "Zanella", "Gilera", "Corven", "Keller", "Benelli", "KTM", "Royal Enfield", "Mondial", "Guerrero"]
const TIPOS = ["Calle", "Scooter", "Enduro", "Cross", "Touring", "Custom", "Deportiva"]
const CILINDRADAS = ["110", "125", "150", "200", "250", "300+"]
const ORDENES = [
  { value: "", label: "Mas recientes" },
  { value: "precio_asc", label: "Menor precio" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "anio_desc", label: "Mas nuevo" },
]
 const ViewMotos = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalVehiculos, setTotalVehiculos] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filtros
  const [marca, setMarca] = useState("")
  const [tipo, setTipo] = useState("")
  const [cilindrada, setCilindrada] = useState("")
  const [precioMax, setPrecioMax] = useState("")
  const [orden, setOrden] = useState("")

  const fetchVehiculos = useCallback(async (page = 1) => {
    setCargando(true)
    try {
      const params = new URLSearchParams({ page, limit: 9 })
      if (marca) params.set("marca", marca)
      if (tipo) params.set("tipo", tipo)
      if (cilindrada) params.set("cilindrada", cilindrada)
      if (precioMax) params.set("precioMax", precioMax)
      if (orden) params.set("orden", orden)

      const res = await api.get(`/api/motos?${params.toString()}`)
      setVehiculos(res.data.data || [])
      setTotalPaginas(res.data.totalPages || 0)
      setTotalVehiculos(res.data.total || res.data.data?.length || 0)
      setPagina(page)
    } catch {
      setVehiculos([])
    } finally {
      setCargando(false)
    }
  }, [marca, tipo, cilindrada, precioMax, orden])

  useEffect(() => {
    fetchVehiculos(1)
  }, [fetchVehiculos])

  const limpiarFiltros = () => {
    setMarca("")
    setTipo("")
    setCilindrada("")
    setPrecioMax("")
    setOrden("")
  }

  const hayFiltrosActivos = marca || tipo || cilindrada || precioMax

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-base" style={{ color: "#f5f5f5" }}>Filtros</h3>
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="text-xs font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: "#dc2626" }}
          >
            <FaTimes size={10} /> Limpiar
          </button>
        )}
      </div>

     

      {/* Marca */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#71717a" }}>
          Marca
        </label>
        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{ background: "#1a1a1a", border: "1px solid #262626", color: marca ? "#f5f5f5" : "#71717a" }}
        >
          <option value="">Todas las marcas</option>
          {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#71717a" }}>
          Tipo
        </label>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(tipo === t ? "" : t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: tipo === t ? "#dc2626" : "#1a1a1a",
                border: `1px solid ${tipo === t ? "#dc2626" : "#262626"}`,
                color: tipo === t ? "white" : "#a3a3a3",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cilindrada */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#71717a" }}>
          Cilindrada (cc)
        </label>
        <div className="flex flex-wrap gap-2">
          {CILINDRADAS.map((c) => (
            <button
              key={c}
              onClick={() => setCilindrada(cilindrada === c ? "" : c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: cilindrada === c ? "#dc2626" : "#1a1a1a",
                border: `1px solid ${cilindrada === c ? "#dc2626" : "#262626"}`,
                color: cilindrada === c ? "white" : "#a3a3a3",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Precio max */}
      
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
     
      <div className="max-w-screen-2xl mx-auto px-4 pt-24 pb-16">

        {/* Header pagina */}
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: "#f5f5f5" }}>
            <span style={{ color: "#dc2626" }}>Aspen</span> Motos 
          </h1>
          
        </div>

        <div className="flex gap-6">

          {/* Sidebar desktop */}
          <aside
            className="hidden lg:block flex-shrink-0 w-64 rounded-2xl p-5 self-start sticky top-24"
            style={{ background: "#111111", border: "1px solid #1e1e1e" }}
          >
            <SidebarContent />
          </aside>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">

            {/* Barra superior mobile */}
            <div className="flex items-center justify-between mb-5 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "#111111", border: "1px solid #1e1e1e", color: "#f5f5f5" }}
              >
                <FaFilter size={12} style={{ color: "#dc2626" }} />
                Filtros {hayFiltrosActivos && <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#dc2626" }} />}
              </button>
              
            </div>

            {/* Grid de motos */}
            {cargando ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#111111", border: "1px solid #1e1e1e" }}>
                    <div className="h-52" style={{ background: "#1a1a1a" }} />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="h-4 rounded w-3/4" style={{ background: "#1a1a1a" }} />
                      <div className="h-3 rounded w-1/2" style={{ background: "#1a1a1a" }} />
                      <div className="h-6 rounded w-1/3 mt-2" style={{ background: "#1a1a1a" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : vehiculos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#111111", border: "1px solid #1e1e1e" }}>
                  <svg className="w-8 h-8" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-bold mb-1" style={{ color: "#f5f5f5" }}>Sin resultados</p>
                <p className="text-sm mb-4" style={{ color: "#71717a" }}>No hay motos con los filtros seleccionados</p>
                <button
                  onClick={limpiarFiltros}
                  className="px-5 py-2 rounded-full text-sm font-semibold"
                  style={{ background: "#dc2626", color: "white" }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vehiculos.map((moto) => (
                  <Link
                    key={moto.id}
                    to={`/motos/${moto.id}`}
                    className="group rounded-2xl overflow-hidden block transition-all duration-300 hover:-translate-y-1"
                    style={{ background: "#111111", border: "1px solid #1e1e1e" }}
                  >
                    {/* Foto */}
                    <div className="relative overflow-hidden" style={{ height: "210px" }}>
                      <img
                        src={cloudinaryThumb(moto.imagenes?.[0], 600)}
                        alt={`${moto.marca} ${moto.modelo}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = "/placeholder.jpg" }}
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
                      {/* Badge cilindrada */}
                      {(moto.cilindrada) && (
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ background: "rgba(220,38,38,0.9)", color: "white", backdropFilter: "blur(4px)" }}
                        >
                          {moto.cilindrada}cc
                        </div>
                      )}
                      {/* Badge año */}
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: "rgba(0,0,0,0.7)", color: "#f5f5f5", backdropFilter: "blur(4px)" }}
                      >
                        {moto["año"] || moto.anio || moto.ano}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-black text-base mb-2 leading-tight" style={{ color: "#f5f5f5" }}>
                        {moto.marca} {moto.modelo}
                      </h3>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                        {moto.tipo && (
                          <span className="text-xs" style={{ color: "#71717a" }}>{moto.tipo}</span>
                        )}
                        {moto.cilindrada && (
                          <span className="text-xs" style={{ color: "#71717a" }}>{moto.cilindrada}cc</span>
                        )}
                      </div>

                      <div className="mb-3" style={{ height: "1px", background: "#1e1e1e" }} />

                      {/* Precio + boton */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: "#71717a" }}>Precio</p>
                          <p className="text-xl font-black" style={{ color: "#dc2626" }}>
                            {moto.moneda === "USD"
                              ? `U$D ${Number(moto.precio).toLocaleString("es-AR")}`
                              : `$ ${Number(moto.precio).toLocaleString("es-AR")}`}
                          </p>
                        </div>
                        <button
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                          style={{ background: "#1a1a1a", border: "1px solid #262626", color: "#f5f5f5" }}
                        >
                          Ver mas
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Paginacion */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => fetchVehiculos(pagina - 1)}
                  disabled={pagina === 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "#111111", border: "1px solid #1e1e1e", color: "#f5f5f5" }}
                >
                  <FaChevronLeft size={12} />
                </button>

                {Array.from({ length: totalPaginas }).map((_, i) => {
                  const num = i + 1
                  const activa = num === pagina
                  return (
                    <button
                      key={num}
                      onClick={() => fetchVehiculos(num)}
                      className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: activa ? "#dc2626" : "#111111",
                        border: `1px solid ${activa ? "#dc2626" : "#1e1e1e"}`,
                        color: activa ? "white" : "#a3a3a3",
                      }}
                    >
                      {num}
                    </button>
                  )
                })}

                <button
                  onClick={() => fetchVehiculos(pagina + 1)}
                  disabled={pagina === totalPaginas}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "#111111", border: "1px solid #1e1e1e", color: "#f5f5f5" }}
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer mobile filtros */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-full overflow-y-auto p-6"
            style={{ background: "#0a0a0a", borderLeft: "1px solid #1e1e1e" }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-base" style={{ color: "#f5f5f5" }}>Filtros</span>
              <button onClick={() => setSidebarOpen(false)} style={{ color: "#71717a" }}>
                <FaTimes size={18} />
              </button>
            </div>
            <SidebarContent />
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full mt-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: "#dc2626", color: "white" }}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/5493513232880?text=Hola! te escribo desde la web para consultar sobre una moto 0km."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
      >
        <FaWhatsapp size={28} color="white" />
      </a>

    </div>
  )
}

export default ViewMotos;