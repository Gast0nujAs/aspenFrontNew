import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhone, FaFileAlt, FaUsers, FaExchangeAlt, FaClock, FaBuilding } from "react-icons/fa"
import { FiArrowRight } from "react-icons/fi"
import VehiculosHome from "../components/VehiculosHome"
import MapaSucursales from "../components/MapaSucursales"
import imgTramite from "../assets/tramite.jpg"
import imgEquipo from "../assets/nuevaequipo.jpg"
import imgEntrega from "../assets/entrega.jpeg"
import imgGarantia from "../assets/garantia.jpg"

const heroImages = [
  { src: "/fondoruta.jpg", sucursal: "Sucursal Av. Fuerza Aerea" },
  { src: "/fondoduar.jpg", sucursal: "Sucursal Av. Duarte Quiros" },
  { src: "/fondo.jpg", sucursal: "Sucursal Av. Pueyredon" },
]

function WhatsAppTooltip() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center">
      {/* Solapa tooltip */}
      <div
        className="flex items-center mr-3 transition-all duration-500 overflow-hidden"
        style={{
          maxWidth: visible ? "260px" : "0px",
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-sm font-medium whitespace-nowrap"
          style={{
            background: "#fff",
            color: "#111",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <span className="font-Montserrat font-semibold">¡Hola! Estamos para ayudarte.</span>
          {/* triangulito apuntando a la derecha */}
          <span
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderLeft: "8px solid #fff",
            }}
          />
          {/* boton cerrar */}
          <button
            onClick={() => setVisible(false)}
            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Boton WhatsApp */}
      <a
        href="https://wa.me/5493513232880?text=Hola! te escribo desde la web para saber sobre..."
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 flex-shrink-0"
        style={{ background: "#25d366" }}
        aria-label="Contactar por WhatsApp"
        onClick={() => setVisible(false)}
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}
const sucursales = [
  {
    id: 0,
    nombre: "Sucursal 1",
    direccion: "Av. Pueyrredon 2550",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.5!2d-64.1950!3d-31.4135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28f9f4cb5b3%3A0x1f8b0fc0b7f7e1c0!2sAv.%20Pueyrred%C3%B3n%202550%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1234567890",
  },
  {
    id: 1,
    nombre: "Sucursal 2",
    direccion: "Av. Fuerza Aerea 3020",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.1!2d-64.2200!3d-31.4280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a1f1f1f1f1f1%3A0x1f8b0fc0b7f7e1c1!2sAv.%20Fuerza%20A%C3%A9rea%203020%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1234567891",
  },
  
]

const servicios = [
  {
    numero: "01",
    titulo: "Facilitamos tus tramites",
    descripcion: "Una vez que compres tu nuevo vehiculo, despreocupate de los tramites: se encarga Aspen.",
    icono: "📋",
  },
  {
    numero: "02",
    titulo: "Atencion personalizada",
    descripcion: "Nuestros asesores te brindaran un servicio calido y profesional.",
    icono: "👥",
  },
  {
    numero: "03",
    titulo: "Recibimos tu usado",
    descripcion: "Recibimos tu usado al mejor precio del mercado y con la mejor financiacion.",
    icono: "🔄",
    destacado: true,
  },
  {
    numero: "04",
    titulo: "Garantia",
    descripcion: "Garantia que te acompana: 3 meses asegurados para la caja y el motor de tu vehiculo.",
    icono: "✅",
  },
]

const Inicio = () => {
  const [heroIndex, setHeroIndex] = useState(0)
  const [sucursalActiva, setSucursalActiva] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-zinc-950 min-h-screen">

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
          >
            <img
              src={img.src}
              alt={img.sucursal}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-4 md:mx-auto  md:px-4 sm:px-6 lg:px-8 w-full ">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Más de 10 años de experiencia</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-6xl font-black text-white leading-tight mb-6 uppercase ">
            Tu proximo<br />
            <span className="">auto te espera</span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 max-w-md">
            {["Recibimos tu usado", "Financiacion hasta el 100%", "Gestion de tramites incluida", "Atencion personalizada"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <FaCheckCircle className="text-red-500 flex-shrink-0" />
                <span className="text-white text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/usados"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Ver catalogo completo
            </Link>
            <a
              href="https://wa.me/5493513232880"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Contactar asesor
            </a>
          </div>
        </div>

        {/* Indicadores hero */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "w-8 bg-red-500" : "w-2 bg-white/40"
                }`}
            />
          ))}
        </div>
      </section>

      {/* DESTACADOS */}

      {/* SERVICIOS */}
      <section className="py-20 px-4" style={{ background: "#000000" }}>
        <div className="max-w-7xl mx-auto">

          {/* Titulo */}
          <div className="text-center mb-14 ">
            <h2
              className="text-3xl md:text-4xl  font-bold text-white mb-4 uppercase tracking-tight"
              style={{ color: "#f5f5f5" }}
            >
              Nos encargamos de todo el proceso<br />de tu compra
            </h2>
            <div style={{ height: "3px", margin: "0 auto 16px" }} className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-red-900 to-transparent shadow-[0_0_8px_rgba(255,0,0,0.25)]" />
            <p style={{ color: "#a3a3a3", fontSize: "15px" }}>
              Experiencia completa y sin complicaciones. Disfrutá de nuestro servicio integral.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                numero: "01",
                foto: imgTramite,
                icono: <FaFileAlt />,
                titulo: "Facilitamos tus trámites",
                descripcion: "Una vez que compres tu nuevo vehículo, despreocupate de los trámites: se encarga Aspen.",
                destacado: false,
              },
              {
                numero: "02",
                foto: imgEquipo,
                icono: <FaUsers />,
                titulo: "Atención personalizada",
                descripcion: "Nuestros asesores te brindarán un servicio cálido y profesional.",
                destacado: false,
              },
              {
                numero: "03",
                foto: imgEntrega,
                icono: <FaExchangeAlt />,
                titulo: "Recibimos tu usado",
                descripcion: "Recibimos tu usado al mejor precio del mercado y con la mejor financiación.",
                destacado: true,
              },
              {
                numero: "04",
                foto: imgGarantia,
                icono: <FaClock />,
                titulo: "Garantía",
                descripcion: "Garantía que te acompaña: 3 meses asegurados para la caja y el motor de tu vehículo.",
                destacado: false,
              },
            ].map((s) => (
              <div
                key={s.numero}
                className="flex flex-col rounded-2xl overflow-hidden"
                style={{ border: "1px solid #1e293b", background: "#0f172a" }}
              >
                {/* Foto con badge numero e icono */}
                <div className="relative" style={{ height: "200px" }}>
                  <img
                    src={s.foto}
                    alt={s.titulo}
                    className="w-full h-[290px] object-cover"
                    style={{ display: "block" }}
                    onError={(e) => { e.target.style.display = "none" }}
                  />
                  {/* Overlay degradado abajo */}
                  <div
                    className="absolute inset-0 "

                  />
                  {/* Badge numero - arriba derecha */}
                  <div
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
                    style={{ background: "#dc2626", color: "white" }}
                  >
                    {s.numero}
                  </div>
                  {/* Icono - abajo izquierda */}
                  <div
                    className="absolute top-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center text-base"
                    style={{ background: "#1e293b", color: "#dc2626" }}
                  >
                    {s.icono}
                  </div>
                </div>

                {/* Contenido texto */}
                <div className="flex flex-col gap-2 p-5 pt-30">
                  <h3
                    className="font-bold text-base leading-snug"
                    style={{ color: s.destacado ? "#ffffffff" : "#f5f5f5" }}
                  >
                    {s.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                    {s.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <p className="mb-5 text-sm" style={{ color: "#a3a3a3" }}>
              ¿Tenés dudas sobre nuestros servicios?
            </p>
            <a
              href="https://wa.me/5493513232880?text=Hola! Quiero consultar sobre sus servicios."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base transition-colors hover:bg-red-700"
              style={{ background: "#dc2626", color: "white" }}
            >
              Contactanos ahora
            </a>
          </div>
        </div>
      </section>
      <VehiculosHome />

      {/* SUCURSALES */}
      <section id="ubicacion" className="py-20 px-4" style={{ background: "#000000" }}>
        <div className="max-w-7xl mx-auto">

          {/* Titulo */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 uppercase tracking-tight" style={{ color: "#f5f5f5" }}>
              Nuestras <span style={{ color: "#ddddddff" }}>Sucursales</span>
            </h2>
            <div style={{ height: "3px", margin: "0 auto 16px" }} className="h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-red-900 to-transparent shadow-[0_0_8px_rgba(255,0,0,0.25)]" />
            <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "#a3a3a3" }}>
              Visitanos en cualquiera de nuestras tres ubicaciones en Córdoba. Estamos para
              atenderte y ayudarte a encontrar tu vehículo ideal.
            </p>
          </div>

          {/* Mapa con botones superpuestos */}
          <div
            className="relative w-full rounded-xl overflow-hidden mb-5"
            style={{ border: "1px solid #262626", height: "420px" }}
          >
            {/* iframe mapa */}
            <MapaSucursales
              sucursales={sucursales}
              sucursalActiva={sucursalActiva}
              setSucursalActiva={setSucursalActiva}
            />

            {/* Botones superpuestos - izquierda */}
            <div className="absolute top-4 left-4 flex flex-col gap-2" style={{ zIndex: 10 }}>
              {sucursales.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSucursalActiva(s.id)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all"
                  style={{
                    background: sucursalActiva === s.id ? "#dc2626" : "#1a1a1a",
                    color: "white",
                    border: sucursalActiva === s.id ? "none" : "1px solid #333",
                    minWidth: "200px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  <FaMapMarkerAlt
                    style={{ color: sucursalActiva === s.id ? "white" : "#dc2626", flexShrink: 0 }}
                    size={14}
                  />
                  {s.direccion}
                </button>
              ))}
            </div>
          </div>

          {/* Cards sucursales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {sucursales.map((s) => (
              <button
                key={s.id}
                onClick={() => setSucursalActiva(s.id)}
                className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                style={{
                  background: "#111111",
                  border: sucursalActiva === s.id ? "1px solid #dc2626" : "1px solid #262626",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#1e1e1e" }}
                >
                  <FaBuilding style={{ color: "#dc2626" }} size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#f5f5f5" }}>{s.nombre}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a3a3a3" }}>{s.direccion}</p>
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "#111111", border: "1px solid #262626" }}
          >
            <p className="font-black text-xl mb-2" style={{ color: "#f5f5f5" }}>¿Querés visitarnos?</p>
            <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: "#dc2626" }}>
              Nuestros asesores están listos para ayudarte. Vení a conocer nuestros vehículos y encontrá el que estás buscando.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5493513232880?text=Hola! Quiero visitarlos."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-colors hover:bg-red-700"
                style={{ background: "#dc2626", color: "white" }}
              >
                <FaWhatsapp size={16} />
                Contactar por WhatsApp
              </a>
              <a
                href="tel:+5493513232880"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-colors hover:bg-zinc-700"
                style={{ background: "#1e1e1e", color: "#f5f5f5", border: "1px solid #333" }}
              >
                <FaPhone size={14} />
                Llamar ahora
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Botones flotantes */}
      <div className="fixed bottom-6 right-8 z-50 flex flex-col gap-5 mb-20">
        <a
          href="https://www.instagram.com/aspenautomotores"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ background: "linear-gradient(135deg, #e1306c, #833ab4)", boxShadow: "0 4px 15px rgba(225,48,108,0.4)" }}
          aria-label="Seguinos en Instagram"
        >
          <FaInstagram className="text-white text-2xl" />
        </a>
       
          <WhatsAppTooltip />
        
      </div>
    </div>
  )
}

export default Inicio