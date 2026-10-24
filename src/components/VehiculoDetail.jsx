import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { cloudinaryThumb , formatPrecio as formatPrecioHelper} from "../lib/imageUrl"
import { FaWhatsapp, FaPhone, FaChevronLeft, FaChevronRight, FaTimes, FaMapMarkerAlt, FaRegCalendarAlt, FaTachometerAlt, FaCog, FaGasPump, FaCarSide, FaBuilding } from "react-icons/fa"

const WHATSAPP = "5493513232880"

const Spec = ({ label, value }) => {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>{value}</span>
    </div>
  )
}

const SpecRow = ({ icon: Icon, label, value }) => {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
      <span className="flex items-center gap-3 text-sm" style={{ color: "#a3a3a3" }}>
        <Icon size={15} style={{ color: "#dc2626" }} />
        {label}
      </span>
      <span className="text-sm font-bold text-right" style={{ color: "#f5f5f5" }}>{value}</span>
    </div>
  )
}

const Tag = ({ children }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
    style={{ background: "#1e1e1e", color: "#a3a3a3", border: "1px solid #2a2a2a" }}
  >
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    {children}
  </span>
)

const VehiculoDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isNuevos = location.pathname.includes("/nuevos")
  const isMotos = location.pathname.includes("/motos")

  const [auto, setAuto] = useState(null)
  const [imagenPrincipal, setImagenPrincipal] = useState("")
  const [imagenIndex, setImagenIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [similares, setSimilares] = useState([])
  const [copiado, setCopiado] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", telefono: "", email: "", mensaje: "" })
  const [formEstado, setFormEstado] = useState(null)
  // CAMBIO 1: el estado ahora guarda { imagenes: [...], index: 0 } en lugar de solo una URL
  const [imagenImperfeccion, setImagenImperfeccion] = useState(null)

  useEffect(() => {
    const fetchAuto = async () => {
      try {
        const endpoint = isMotos ? `/api/motos/${id}` : isNuevos ? `/api/nuevos/${id}` : `/api/cars/${id}`
        const response = await api.get(endpoint)
        const data = response.data
        setAuto(data)
        setImagenPrincipal(data.imagenes?.[0] || "")
        setImagenIndex(0)

        if (data.marca) {
          try {
            const endpointLista = isMotos ? `/api/motos` : isNuevos ? `/api/nuevos` : `/api/usados`
            const resSimilares = await api.get(`${endpointLista}?marca=${encodeURIComponent(data.marca)}&limit=10`)
            const lista = resSimilares.data?.data || resSimilares.data || []
            setSimilares(
              lista
                .filter((v) => String(v.id) !== String(id) && v.imagenes?.length > 0)
                .slice(0, 8)
            )
          } catch {
            setSimilares([])
          }
        }
      } catch (error) {
        console.error("Error fetching auto:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAuto()
  }, [id, isNuevos, isMotos])

  const handleThumbnail = (img, idx) => {
    setImagenPrincipal(img)
    setImagenIndex(idx)
  }

  const navegarFoto = (dir) => {
    const total = auto?.imagenes?.length || 0
    if (total <= 1) return
    let next = imagenIndex + dir
    if (next < 0) next = total - 1
    if (next >= total) next = 0
    setImagenIndex(next)
    setImagenPrincipal(auto.imagenes[next])
  }

  const openModal = (idx) => {
    setImagenIndex(idx)
    setIsModalOpen(true)
  }

  const formatPrecio = (precio, moneda) => formatPrecioHelper(precio, moneda)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#dc2626", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#a3a3a3" }}>Cargando vehiculo...</p>
        </div>
      </div>
    )
  }

  if (!auto) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
        <p style={{ color: "#a3a3a3" }}>Vehiculo no encontrado.</p>
      </div>
    )
  }

  const anio = auto["año"] || auto["anio"] || auto["ano"] || ""
  const kms = auto.kilometros ? Number(auto.kilometros) : null

  const whatsappMsg = encodeURIComponent(
    `Hola! Vi el ${auto.marca} ${auto.modelo} ${anio} en la web y me interesa mas informacion.`
  )
  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormEstado("enviando")
    try {
      await api.post("/api/consultas", {
        ...formData,
        vehiculo: `${auto.marca} ${auto.modelo} (ID: ${auto.id})`,
        url: window.location.href,
      })
      setFormEstado("ok")
      setFormData({ nombre: "", telefono: "", email: "", mensaje: "" })
    } catch {
      setFormEstado("error")
    }
  }

  const handleCompartir = async () => {
    const url = window.location.href
    const titulo = `${auto.marca} ${auto.modelo} - Aspen Automotores`
    const texto = `Mira este ${auto.marca} ${auto.modelo} en Aspen Automotores`
    if (navigator.share) {
      try { await navigator.share({ title: titulo, text: texto, url }) } catch { }
    } else {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <>
      <div className="min-h-screen pt-20 overflow-x-hidden" style={{ background: "#000000" }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-80"
            style={{ color: "#a3a3a3" }}
          >
            <FaChevronLeft size={12} />
            Volver al listado
          </button>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

            {/* Columna izquierda — galeria (3/5) */}
            <div className="lg:col-span-3 flex flex-col gap-4">

              {/* Foto principal */}
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ background: "#111111", border: "1px solid #1e1e1e", aspectRatio: "16/10" }}
                onClick={() => openModal(imagenIndex)}
              >
                <img
                  src={cloudinaryThumb(imagenPrincipal, 1200)}
                  alt={`${auto.marca} ${auto.modelo}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = "/placeholder.jpg" }}
                />
                {auto.imagenes?.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); navegarFoto(-1) }}
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center z-10 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.6)", color: "white", backdropFilter: "blur(4px)" }}
                      aria-label="Foto anterior"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navegarFoto(1) }}
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center z-10 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.6)", color: "white", backdropFilter: "blur(4px)" }}
                      aria-label="Foto siguiente"
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </>
                )}
                <div
                  className="absolute bottom-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.7)", color: "#f5f5f5", backdropFilter: "blur(4px)" }}
                >
                  {imagenIndex + 1} / {auto.imagenes?.length || 1}
                </div>
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>

              {/* Thumbnails */}
              {auto.imagenes?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {auto.imagenes.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnail(img, idx)}
                      className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        width: "72px",
                        height: "56px",
                        border: imagenPrincipal === img ? "2px solid #dc2626" : "2px solid #1e1e1e",
                        opacity: imagenPrincipal === img ? 1 : 0.5,
                      }}
                    >
                      <img
                        src={cloudinaryThumb(img, 200)}
                        alt={`foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/placeholder.jpg" }}
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Columna derecha — info y CTA (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              <div
                className="rounded-2xl p-6"
                style={{ background: "#111111", border: "1px solid #1e1e1e" }}
              >
                <div className="flex items-center gap-2 mb-3"></div>
                <h1 className="text-2xl md:text-3xl font-black leading-tight text-balance" style={{ color: "#f5f5f5" }}>
                  {auto.marca} {auto.modelo}
                </h1>

                <div className="my-5" style={{ borderTop: "1px solid #1e1e1e" }} />

                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#dc2626" }}>
                  Ficha Tecnica
                </p>
                <div className="flex flex-col">
                  <SpecRow icon={FaRegCalendarAlt} label="Año" value={anio} />
                  <SpecRow icon={FaTachometerAlt} label="Kilometros" value={kms ? `${kms.toLocaleString("es-AR")} km` : null} />
                  <SpecRow icon={FaCog} label="Transmision" value={auto.transmision} />
                  <SpecRow icon={FaGasPump} label="Combustible" value={auto.combustible} />
                </div>

                <div
                  className="rounded-xl p-4 mt-5"
                  style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
                >
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>Precio</p>
                  <p className="text-md md:text-lg font-black" style={{ color: "#dc2626" }}>
                    {formatPrecio(auto.precio, auto.moneda)}
                  </p>
                  {(auto.precio && Number(auto.precio) !== 0) && (
                    <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
                      Precio de lista. Consulta por financiacion disponible.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 px-3">
                  <p className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>
                    Compartir vehiculo
                  </p>
                  <div className="relative">
                    <button
                      onClick={handleCompartir}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-zinc-700"
                      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#a3a3a3" }}
                      title="Compartir"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                    {copiado && (
                      <span
                        className="absolute -top-8 right-0 text-xs px-2 py-1 rounded-lg whitespace-nowrap"
                        style={{ background: "#1a1a1a", color: "#f5f5f5", border: "1px solid #2a2a2a" }}
                      >
                        Link copiado!
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors hover:bg-red-700 mt-4"
                  style={{ background: "#dc2626", color: "white" }}
                >
                  <FaWhatsapp size={16} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Caracteristicas */}
          {(auto.equipamiento?.length > 0 || auto.seguridad?.length > 0 || auto.destacados?.length > 0) && (
            <div
              className="rounded-2xl p-6 mt-8 flex flex-col gap-6"
              style={{ background: "#111111", border: "1px solid #1e1e1e" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#dc2626" }}>
                Caracteristicas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {auto.equipamiento?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6b7280" }}>
                      Equipamiento
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {auto.equipamiento.map((item, i) => <Tag key={i}>{item}</Tag>)}
                    </div>
                  </div>
                )}
                {auto.seguridad?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6b7280" }}>
                      Seguridad
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {auto.seguridad.map((item, i) => <Tag key={i}>{item}</Tag>)}
                    </div>
                  </div>
                )}
                {auto.destacados?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6b7280" }}>
                      Destacados
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {auto.destacados.map((item, i) => <Tag key={i}>{item}</Tag>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Imperfecciones */}
        {auto.imperfecciones?.length > 0 && (
          <div className="mt-4 mx-auto px-4 py-8 max-w-7xl overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ background: "#dc2626" }} />
              <h2 className="text-xl font-black" style={{ color: "#f5f5f5" }}>
                Imperfecciones
              </h2>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "#1e1e1e", color: "#a3a3a3", border: "1px solid #2a2a2a" }}
              >
                {auto.imperfecciones.length} detalle{auto.imperfecciones.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="imperfecciones-swiper relative">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: ".imp-prev",
                  nextEl: ".imp-next",
                }}
                spaceBetween={16}
                slidesPerView={1.05}
                breakpoints={{
                  640: { slidesPerView: 2.5 },
                  1024: { slidesPerView: 3.2 },
                }}
                className="!pb-2"
              >
                {auto.imperfecciones.map((imp, idx) => (
                  <SwiperSlide key={idx} className="h-auto">
                    <div
                      className="rounded-2xl overflow-hidden h-full flex flex-col"
                      style={{ background: "#111111", border: "1px solid #1e1e1e" }}
                    >
                      <div className="relative" style={{ aspectRatio: "16/10" }}>
                        {imp.imagenes?.length > 0 ? (
                          <img
                            src={cloudinaryThumb(imp.imagenes[0].url, 600)}
                            alt={imp.titulo}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onError={(e) => { e.target.src = "/placeholder.jpg" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: "#0a0a0a" }}>
                            <span className="text-xs" style={{ color: "#4b5563" }}>Sin foto</span>
                          </div>
                        )}

                        {/* Badge numerado */}
                        <span
                          className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ background: "#dc2626", color: "white" }}
                        >
                          {idx + 1}
                        </span>

                        {/* Contador de fotos */}
                        {imp.imagenes?.length > 1 && (
                          <span
                            className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                            style={{ background: "rgba(0,0,0,0.7)", color: "#f5f5f5" }}
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                            {imp.imagenes.length}
                          </span>
                        )}

                        {/* CAMBIO 2: overlay abre el modal con TODAS las fotos de esta imperfección */}
                        <div
                          className="absolute inset-0 cursor-zoom-in"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }}
                          onClick={() =>
                            imp.imagenes?.length > 0 &&
                            setImagenImperfeccion({
                              imagenes: imp.imagenes.map(i => cloudinaryThumb(i.url, 1000)),
                              index: 0
                            })
                          }
                        />
                      </div>

                      {/* Mini galeria de fotos extra */}
                      {imp.imagenes?.length > 1 && (
                        <div className="flex gap-2 px-4 pt-4">
                          {imp.imagenes.slice(1, 4).map((img, i) => (
                            <div
                              key={i}
                              className="rounded-lg overflow-hidden flex-1 cursor-zoom-in"
                              style={{ aspectRatio: "1", maxWidth: "60px" }}
                              onClick={() =>
                                setImagenImperfeccion({
                                  imagenes: imp.imagenes.map(im => cloudinaryThumb(im.url, 1000)),

                                  index: i + 1
                                })
                              }
                            >
                              <img
                                src={cloudinaryThumb(img.url, 150)}
                                alt={`${imp.titulo} extra ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "/placeholder.jpg" }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Titulo */}
                      <div className="flex items-start gap-2 p-4 mt-auto">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <p className="text-sm font-semibold leading-snug" style={{ color: "#f5f5f5" }}>{imp.titulo}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/* CAMBIO 3: modal UNA sola vez, fuera del loop, después de la sección de imperfecciones */}
        {imagenImperfeccion && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setImagenImperfeccion(null)}
          >
            {/* Cerrar */}
            <button
              onClick={() => setImagenImperfeccion(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "white" }}
            >
              <FaTimes size={18} />
            </button>

            {/* Contador */}
            {imagenImperfeccion.imagenes.length > 1 && (
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-semibold px-4 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                {imagenImperfeccion.index + 1} / {imagenImperfeccion.imagenes.length}
              </div>
            )}

            {/* Imagen */}
            <img
              src={imagenImperfeccion.imagenes[imagenImperfeccion.index]}
              alt="Imperfección"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Flechas si hay más de una foto */}
            {imagenImperfeccion.imagenes.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setImagenImperfeccion(prev => ({
                      ...prev,
                      index: prev.index === 0 ? prev.imagenes.length - 1 : prev.index - 1
                    }))
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                >
                  <FaChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setImagenImperfeccion(prev => ({
                      ...prev,
                      index: prev.index === prev.imagenes.length - 1 ? 0 : prev.index + 1
                    }))
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                >
                  <FaChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Formulario de consulta */}
        <div className="mt-10 mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: "#dc2626" }} />
            <h2 className="text-xl font-black" style={{ color: "#f5f5f5" }}>Consultar por este vehiculo</h2>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "#111111", border: "1px solid #1e1e1e" }}
          >
            {formEstado === "ok" ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "#dc26261a", border: "1px solid #dc262640" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-lg font-bold" style={{ color: "#f5f5f5" }}>Consulta enviada!</p>
                <p className="text-sm text-center" style={{ color: "#a3a3a3" }}>
                  Un asesor se va a comunicar con vos a la brevedad.
                </p>
                <button
                  onClick={() => setFormEstado(null)}
                  className="text-xs mt-2 underline underline-offset-2"
                  style={{ color: "#6b7280" }}
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleFormChange}
                      required
                      placeholder="Tu nombre completo"
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                      style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                      onFocus={e => e.target.style.borderColor = "#dc2626"}
                      onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleFormChange}
                      required
                      placeholder="Ej: 351 123 4567"
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                      style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                      onFocus={e => e.target.style.borderColor = "#dc2626"}
                      onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="tucorreo@email.com"
                    className="px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                    style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                    onFocus={e => e.target.style.borderColor = "#dc2626"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                    Mensaje
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Contanos que necesitas saber sobre este vehiculo..."
                    className="px-4 py-3 rounded-xl text-sm outline-none transition-colors resize-none"
                    style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                    onFocus={e => e.target.style.borderColor = "#dc2626"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </div>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className="text-xs" style={{ color: "#6b7280" }}>Consulta sobre:</span>
                  <span className="text-xs font-semibold" style={{ color: "#f5f5f5" }}>
                    {auto.marca} {auto.modelo} {auto["año"] || auto["anio"] || ""}
                  </span>
                </div>

                {formEstado === "error" && (
                  <p className="text-xs text-center" style={{ color: "#ef4444" }}>
                    Hubo un error al enviar. Intenta de nuevo o contactanos por WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formEstado === "enviando"}
                  className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-opacity"
                  style={{
                    background: formEstado === "enviando" ? "#7f1d1d" : "#dc2626",
                    color: "white",
                    opacity: formEstado === "enviando" ? 0.7 : 1,
                  }}
                >
                  {formEstado === "enviando" ? "Enviando..." : "Enviar consulta"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Autos similares */}
        {similares.length > 0 && (
          <div className="mt-10 pb-12 px-3 md:px-4 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ background: "#dc2626" }} />
              <h2 className="text-lg md:text-xl font-black" style={{ color: "#f5f5f5" }}>
                También podrian interesarte
              </h2>
            </div>

            <Swiper
              spaceBetween={18}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.0 },
                1024: { slidesPerView: 3.0 },
                1280: { slidesPerView: 4.2 },
              }}
              className="!overflow-visible"
            >
              {similares.map((v) => {
                const anioV = v["año"] || v["anio"] || v["ano"] || ""
                const rutaV = isMotos ? `/motos/${v.id}` : isNuevos ? `/nuevos/${v.id}` : `/usados/${v.id}`
                return (
                  <SwiperSlide key={v.id}>
                    <div
                      className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                      style={{ background: "#111111", border: "1px solid #1e1e1e" }}
                      onClick={() => navigate(rutaV)}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                        <img
                          src={cloudinaryThumb(v.imagenes?.[0], 600)}
                          alt={`${v.marca} ${v.modelo}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.target.src = "/placeholder.jpg" }}
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                        <span
                          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full uppercase"
                          style={{ background: "#dc2626", color: "white" }}
                        >
                          {isMotos ? "Moto" : isNuevos ? "0 km" : "Usado"}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-bold truncate" style={{ color: "#f5f5f5" }}>
                          {v.marca} {v.modelo}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{anioV}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-sm font-black" style={{ color: "#dc2626" }}>
                            {v.moneda === "USD"
                              ? `USD ${Number(v.precio).toLocaleString("es-AR")}`
                              : `$ ${Number(v.precio).toLocaleString("es-AR")}`}
                          </p>
                          <span className="text-xs" style={{ color: "#6b7280" }}>
                            {v.kilometros ? `${Number(v.kilometros).toLocaleString("es-AR")} km` : "0 km"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}

      </div>

      {/* Modal galeria fullscreen */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.96)" }}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "white" }}
          >
            <FaTimes size={18} />
          </button>

          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-semibold px-4 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
          >
            {imagenIndex + 1} / {auto.imagenes?.length}
          </div>

          <div className="relative w-full max-w-5xl px-4 md:px-16">
            <Swiper
              initialSlide={imagenIndex}
              onSlideChange={(swiper) => setImagenIndex(swiper.activeIndex)}
              navigation={{
                nextEl: ".modal-next",
                prevEl: ".modal-prev",
              }}
              modules={[Navigation]}
            >
              {auto.imagenes.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="flex items-center justify-center" style={{ minHeight: "50vh" }}>
                    <img
                      src={cloudinaryThumb(img, 1200)}
                      alt={`${auto.marca} ${auto.modelo} - ${index + 1}`}
                      className="object-contain w-full mx-auto"
                      style={{ maxHeight: "85vh" }}
                      onError={(e) => { e.target.src = "/placeholder.jpg" }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {auto.imagenes?.length > 1 && (
              <>
                <button className="modal-prev absolute left-1 md:left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-colors hover:bg-white/10" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
                  <FaChevronLeft size={16} />
                </button>
                <button className="modal-next absolute right-1 md:right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-colors hover:bg-white/10" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
                  <FaChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default VehiculoDetail