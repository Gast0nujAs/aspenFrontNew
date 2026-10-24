import { useEffect, useState, useCallback, useRef} from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { FaWhatsapp, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import api from "../api/axios"
import { cloudinaryThumb } from "../lib/imageUrl"
import { b } from "framer-motion/client"
import { useComparador } from "../contexts/ComparadorContext"

const MARCAS = ["Toyota", "Ford", "Chevrolet", "Volkswagen", "Renault", "Peugeot", "Fiat", "Honda", "Nissan", "Hyundai", "Kia", "Citroen", "Suzuki"].sort((a, b) => a.localeCompare(b));
const TRANSMISIONES = ["Manual", "Automatica"].sort((a, b) => a.localeCompare(b));
const COMBUSTIBLES = ["Nafta", "Diesel", "GNC", "Hibrido", "Electrico"].sort((a, b) => a.localeCompare(b));
const PRECIO_MAX_TOPE = 60000000
const KM_MAX_TOPE = 300000


export const ViewUsados = () => {
  const navigate = useNavigate()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const { estaSeleccionado, toggleVehiculo, lleno } = useComparador()
  const filtrosRef = useRef(null)
  const [vehiculos, setVehiculos] = useState([])
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalVehiculos, setTotalVehiculos] = useState(0)
   // La pagina es derivada de la URL — unica fuente de verdad
  const pagina = parseInt(searchParams.get("page")) || 1

  const irAPagina = (page) => {
    
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set("page", String(page))
      return p
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const [cargando, setCargando] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  

  // Filtros
  const [marca, setMarca] = useState("")
  const [transmision, setTransmision] = useState("")
  const [combustible, setCombustible] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [precioMax, setPrecioMax] = useState(PRECIO_MAX_TOPE)
  const [kmMax, setKmMax] = useState(KM_MAX_TOPE)
  const [orden, setOrden] = useState("")




  const fetchVehiculos = useCallback(async (page = 1) => {
   
    setCargando(true)
    try {
      const params = new URLSearchParams({ page, limit: 9 })
      if (marca) params.set("marca", marca)
      if (transmision) params.set("transmision", transmision)
      if (combustible) params.set("combustible", combustible)
      if (precioMax < PRECIO_MAX_TOPE) params.set("precioMax", precioMax)
      if (kmMax < KM_MAX_TOPE) params.set("kilometrosMax", kmMax)
      if (orden) params.set("orden", orden)
      if (busqueda) params.set("busqueda", busqueda)

      const res = await api.get(`/api/usados?${params.toString()}`)
      
      setVehiculos(res.data.data || [])
      setTotalPaginas(res.data.totalPages || 0)
      setTotalVehiculos(res.data.total || res.data.data?.length || 0)
     
    } catch {
      setVehiculos([])
    } finally {
      setCargando(false)
    }
  }, [ busqueda, marca, transmision, combustible, precioMax, kmMax, orden])

  useEffect(() => {
    fetchVehiculos(pagina)
  }, [fetchVehiculos, pagina])

  // Debounce para la busqueda por texto

  // Resto de filtros sin debounce
  useEffect(() => {
      const actual = JSON.stringify({ busqueda, marca, transmision, combustible, precioMax, kmMax, orden })
    if (filtrosRef.current === null) {
      filtrosRef.current = actual
      return
    }
    if (filtrosRef.current !== actual) {
      filtrosRef.current = actual
      if (pagina !== 1) {
        setSearchParams((prev) => {
          const p = new URLSearchParams(prev)
          p.set("page", "1")
          return p
        }, { replace: true })
      }
    }
  }, [busqueda, marca, transmision, combustible, precioMax, kmMax, orden, pagina, setSearchParams])
  const limpiarFiltros = () => {
    setMarca("")
    setTransmision("")
    setCombustible("")
    setPrecioMax(PRECIO_MAX_TOPE)
    setKmMax(KM_MAX_TOPE)
    setOrden("")
    setBusqueda("")
  }
  useEffect(() => {
 
}, [searchParams])

  const hayFiltrosActivos = busqueda || marca || transmision || combustible || precioMax < PRECIO_MAX_TOPE || kmMax < KM_MAX_TOPE

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Header sidebar */}
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

      {/* Transmision */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#71717a" }}>
          Transmision
        </label>
        <div className="flex gap-2">
          {TRANSMISIONES.map((t) => (
            <button
              key={t}
              onClick={() => setTransmision(transmision === t ? "" : t)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: transmision === t ? "#dc2626" : "#1a1a1a",
                border: `1px solid ${transmision === t ? "#dc2626" : "#262626"}`,
                color: transmision === t ? "white" : "#a3a3a3",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Combustible */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#71717a" }}>
          Combustible
        </label>
        <div className="flex flex-wrap gap-2">
          {COMBUSTIBLES.map((c) => (
            <button
              key={c}
              onClick={() => setCombustible(combustible === c ? "" : c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: combustible === c ? "#dc2626" : "#1a1a1a",
                border: `1px solid ${combustible === c ? "#dc2626" : "#262626"}`,
                color: combustible === c ? "white" : "#a3a3a3",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {/* Precio max slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#71717a" }}>
            Precio maximo
          </label>
          <span className="text-xs font-bold" style={{ color: precioMax < PRECIO_MAX_TOPE ? "#dc2626" : "#71717a" }}>
            {precioMax < PRECIO_MAX_TOPE
              ? `$ ${Number(precioMax).toLocaleString("es-AR")}`
              : "Sin limite"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={PRECIO_MAX_TOPE}
          step={1000}
          value={precioMax}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
          className="w-full h-1.5 rounded-full outline-none cursor-pointer accent-red-600"
          style={{ background: `linear-gradient(to right, #dc2626 ${(precioMax / PRECIO_MAX_TOPE) * 100}%, #262626 ${(precioMax / PRECIO_MAX_TOPE) * 100}%)` }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "#3f3f3f" }}>$ 0</span>
          <span className="text-xs" style={{ color: "#3f3f3f" }}>$ 60.000.000</span>
        </div>
      </div>

      {/* Km max slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#71717a" }}>
            Kilometraje maximo
          </label>
          <span className="text-xs font-bold" style={{ color: kmMax < KM_MAX_TOPE ? "#dc2626" : "#71717a" }}>
            {kmMax < KM_MAX_TOPE
              ? `${Number(kmMax).toLocaleString("es-AR")} km`
              : "Sin limite"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={KM_MAX_TOPE}
          step={5000}
          value={kmMax}
          onChange={(e) => setKmMax(Number(e.target.value))}
          className="w-full h-1.5 rounded-full outline-none cursor-pointer accent-red-600"
          style={{ background: `linear-gradient(to right, #dc2626 ${(kmMax / KM_MAX_TOPE) * 100}%, #262626 ${(kmMax / KM_MAX_TOPE) * 100}%)` }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "#3f3f3f" }}>0 km</span>
          <span className="text-xs" style={{ color: "#3f3f3f" }}>250.000 km</span>
        </div>
      </div>

    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <NavBar />

      <div className="max-w-screen-2xl mx-auto px-4 pt-24 pb-16">

        {/* Header pagina */}
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: "#f5f5f5" }}>
            Autos <span style={{ color: "#dc2626" }}>Usados</span>
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
            {/* Barra de busqueda */}
            <div className="relative mb-5">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none" stroke="#71717a" viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por marca o modelo..."
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#111111",
                  border: `1px solid ${busqueda ? "#dc2626" : "#1e1e1e"}`,
                  color: "#f5f5f5",
                }}
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                >
                  <FaTimes size={12} style={{ color: "#71717a" }} />
                </button>
              )}
            </div>


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

            {/* Grid de autos */}
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
                <p className="text-sm mb-4" style={{ color: "#71717a" }}>No hay vehiculos con los filtros seleccionados</p>
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
                {vehiculos.map((auto) => (
                  <Link
                    key={auto.id}
                    to={`/usados/${auto.id}`}
                    className="group rounded-2xl overflow-hidden block transition-all duration-300 "
                    style={{ background: "#111111", border: "1px solid #1e1e1e" }}
                  >
                    {/* Foto */}
                    <div className="relative overflow-hidden" style={{ height: "210px" }}>
                      <img
                        src={cloudinaryThumb(auto.imagenes?.[0], 600)}
                        alt={`${auto.marca} ${auto.modelo}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = "/placeholder.jpg" }}
                      />
                      {/* Overlay degradado */}
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
                      {/* Badge año */}
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: "rgba(0,0,0,0.7)", color: "#f5f5f5", backdropFilter: "blur(4px)" }}
                      >
                        {auto.año}
                      </div>
                      {/* Badge sucursal */}
                       {/* Boton comparar */}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleVehiculo(auto, "usados") }}
                        disabled={lleno && !estaSeleccionado(auto.id)}
                        className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: estaSeleccionado(auto.id) ? "rgba(220,38,38,0.9)" : "rgba(0,0,0,0.75)",
                          color: "white",
                          border: estaSeleccionado(auto.id) ? "1px solid #dc2626" : "1px solid rgba(255,255,255,0.15)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {estaSeleccionado(auto.id) ? (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Comparando
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            Comparar
                          </>
                        )}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-black text-base mb-2 leading-tight" style={{ color: "#f5f5f5" }}>
                        {auto.marca} {auto.modelo}
                      </h3>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                        {auto.kilometros != null && (
                          <span className="text-xs flex items-center gap-1" style={{ color: "#71717a" }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {Number(auto.kilometros).toLocaleString("es-AR")} km
                          </span>
                        )}
                        {auto.transmision && (
                          <span className="text-xs" style={{ color: "#71717a" }}>{auto.transmision}</span>
                        )}
                        {auto.combustible && (
                          <span className="text-xs" style={{ color: "#71717a" }}>{auto.combustible}</span>
                        )}
                      </div>

                      {/* Separador */}
                      <div className="mb-3" style={{ height: "1px", background: "#1e1e1e" }} />

                      {/* Precio + boton */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: "#71717a" }}>Precio</p>
                          <p className="text-xl font-black" style={{ color: "#dc2626" }}>
                            {auto.moneda === "USD"
                              ? `U$D ${Number(auto.precio).toLocaleString("es-AR")}`
                              : `$ ${Number(auto.precio).toLocaleString("es-AR")}`}
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
                  onClick={() => irAPagina(pagina - 1)}
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
                      onClick={() => irAPagina(num)}
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
                  onClick={() => irAPagina(pagina + 1)}
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
        href="https://wa.me/5493513232880?text=Hola! te escribo desde la web para consultar sobre un auto."
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

export default ViewUsados
