import { FaWhatsapp, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa"
import { FiMail } from "react-icons/fi"
import equipoaspen from "../assets/equipoaspen.jpg"

const Nosotros = () => {
  const sucursales = [
    { nombre: "Sucursal Pueyredon", direccion: "Av. Pueyredon 2550, Cordoba", tel: "+54 9 351 323 2880" },
    { nombre: "Sucursal Fuerza Aerea", direccion: "Av. Fuerza Aerea 3020, Cordoba", tel: "+54 9 351 323 2880" },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">

      {/* Hero */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src="/logonav.png" alt="Aspen Automotores" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Sobre <span>Nosotros</span>
          </h1>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6" />
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Somos una empresa cordobesa con mas de 10 años de experiencia en la compra, venta y financiacion de vehiculos usados y 0km.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Mision, Vision y Valores */}
        <div className="mb-20">

          {/* Mision y Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Mision */}
            <div
              className="rounded-2xl p-8 flex flex-col gap-4"
              style={{ background: "#171717", border: "1px solid #262626" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dc26261a" }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                    <line x1="12" y1="2" x2="12" y2="5"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                    <line x1="2" y1="12" x2="5" y2="12"/>
                    <line x1="19" y1="12" x2="22" y2="12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#dc2626" }}>Nuestra</p>
                  <h3 className="text-2xl font-black" style={{ color: "#f5f5f5" }}>Mision</h3>
                </div>
              </div>
              <div className="w-10 h-0.5" style={{ background: "#dc2626" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#a3a3a3" }}>
                Ayudarte a encontrar el auto ideal, con informacion clara, asesoramiento honesto y una experiencia de compra segura.
              </p>
            </div>

            {/* Vision */}
            <div
              className="rounded-2xl p-8 flex flex-col gap-4"
              style={{ background: "#171717", border: "1px solid #262626" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dc26261a" }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#dc2626" }}>Nuestra</p>
                  <h3 className="text-2xl font-black" style={{ color: "#f5f5f5" }}>Vision</h3>
                </div>
              </div>
              <div className="w-10 h-0.5" style={{ background: "#dc2626" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#a3a3a3" }}>
                Ser una concesionaria referente, reconocida por la transparencia, la calidad de nuestros vehiculos y la confianza que construimos con el cliente.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="rounded-2xl p-8" style={{ background: "#dc2626" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#ffffff22" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffffff99" }}>Nuestros</p>
                <h3 className="text-2xl font-black text-white">Valores</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Transparencia", "Confianza", "Compromiso", "Calidad", "Trabajo en Equipo", "Responsabilidad", "Empatia", "Respeto"].map((valor) => (
                <span
                  key={valor}
                  className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
                  style={{ background: "#ffffff22", color: "white" }}
                >
                  {valor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Google Reviews */}
        <div
          className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: "#171717", border: "1px solid #262626" }}
        >
          <div
            className="flex-shrink-0 rounded-xl p-6 flex flex-col items-start gap-1 w-full sm:w-64"
            style={{ background: "#ffffff" }}
          >
            <p className="text-base font-bold" style={{ color: "#111111" }}>Calificacion en Google</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-7 h-7" viewBox="0 0 24 24" fill="#FBBC04">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-3xl font-black" style={{ color: "#111111" }}>4,8</span>
            </div>
            <p className="text-sm mt-1" style={{ color: "#555555" }}>Basado en mas<br />de 400 resenas</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#dc2626">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#dc2626" }}>Excelencia Certificada</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black" style={{ color: "#f5f5f5" }}>Nuestra principal garantia</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#a3a3a3" }}>
              La satisfaccion y confiabilidad de nuestros clientes se ve reflejada en las resenas de Google.
              Cada comentario positivo nos impulsa a seguir ofreciendo el mejor servicio.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { numero: "10+", label: "Anos de experiencia" },
            { numero: "1000+", label: "Autos entregados" },
            { numero: "100+", label: "Vehiculos en stock" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
              style={{ background: "#171717", border: "1px solid #262626" }}
            >
              <span className="text-5xl font-black mb-2 leading-none" style={{ color: "#dc2626" }}>{stat.numero}</span>
              <span className="text-sm" style={{ color: "#a3a3a3" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Equipo */}
        <div className="mb-8">
          <div className="text-center mb-10 mt-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ width: "40px", height: "2px", background: "#dc2626" }} />
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#dc2626">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#dc2626" strokeWidth="2" fill="none"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ width: "40px", height: "2px", background: "#dc2626" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-balance" style={{ color: "#f5f5f5" }}>
              Gracias a Nuestro Gran Equipo
            </h2>
            <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "#a3a3a3" }}>
              El corazon de Aspen Automotores late con la pasion y dedicacion de cada uno de nuestros colaboradores
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #262626" }}>
              <img
                src={equipoaspen}
                alt="Equipo Aspen Automotores"
                className="w-full h-full object-cover"
                style={{ minHeight: "320px", maxHeight: "480px" }}
              />
            </div>

            <div className="flex flex-col gap-3">
              {[
                { texto: "En Aspen Automotores, queremos expresar nuestro mas sincero agradecimiento a todo nuestro equipo de trabajo. Gracias a su compromiso, pasion y esfuerzo diario, hemos logrado crecer y posicionarnos como una empresa confiable en el mundo de la venta de autos.", destacado: false },
                { texto: "Cada asesoramiento brindado, cada cliente satisfecho y cada vehiculo entregado es reflejo del trabajo en equipo, del profesionalismo y de la dedicacion que cada uno de ustedes aporta dia a dia.", destacado: false },
                { texto: "Estamos orgullosos de contar con personas que no solo comparten nuestros valores, sino que tambien hacen de esta empresa un lugar donde el servicio, la confianza y la excelencia marcan la diferencia.", destacado: false },
                { texto: "Gracias por ser parte de este camino. Nuestro crecimiento es el resultado de su esfuerzo. Sigamos avanzando juntos hacia nuevos logros!", destacado: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5 flex items-start gap-4"
                  style={{
                    background: item.destacado ? "#dc2626" : "#171717",
                    border: item.destacado ? "none" : "1px solid #262626",
                  }}
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke={item.destacado ? "white" : "#dc2626"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <p className="text-sm leading-relaxed" style={{ color: item.destacado ? "white" : "#a3a3a3", fontWeight: item.destacado ? "600" : "400" }}>
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sucursales y contacto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 mt-20">
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Nuestras sucursales</h2>
            <div className="flex flex-col gap-4">
              {sucursales.map((s) => (
                <div key={s.nombre} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-white font-bold mb-2">{s.nombre}</h3>
                  <div className="flex items-start gap-2 text-zinc-400 text-sm mb-1">
                    <FaMapMarkerAlt className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{s.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <FaPhone className="text-red-500 flex-shrink-0" />
                    <a href={`tel:${s.tel}`} className="hover:text-white transition-colors">{s.tel}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white mb-6">Contactanos</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <FaClock className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Horario de atencion</p>
                  <p className="text-zinc-400 text-sm">Lunes a Viernes: 9 a 13hs y 15 a 19hs</p>
                  <p className="text-zinc-400 text-sm">Sabados: 9:30 a 13hs</p>
                </div>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex flex-col gap-3">
                <a href="https://wa.me/5493513232880" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-semibold px-4 py-3 rounded-lg transition-colors text-sm">
                  <FaWhatsapp size={18} /> WhatsApp: +54 9 351 323 2880
                </a>
                <a href="https://instagram.com/aspenautomotores" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-3 rounded-lg transition-colors text-sm">
                  <FaInstagram size={18} /> @aspenautomotores
                </a>
                <a href="https://facebook.com/aspenautomotores" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-3 rounded-lg transition-colors text-sm">
                  <FaFacebookF size={18} /> Aspen Automotores
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="https://wa.me/5493513232880" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
        <FaWhatsapp className="text-white text-2xl" />
      </a>
    </div>
  )
}

export default Nosotros