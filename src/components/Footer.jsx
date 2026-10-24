import { Link } from "react-router-dom"
import { FaInstagram, FaFacebookF, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa"
import logoFooter from "../assets/logofooter.png"

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + descripcion */}
          <div className="flex flex-col gap-4">
            <img src={logoFooter} alt="Aspen Automotores" className="h-30 w-30" />
            <p className="text-zinc-400 text-sm leading-relaxed">
              Mas de 10 años de trayectoria garantizando calidad y confianza en cada venta.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://instagram.com/aspenautomotores"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <FaInstagram className="text-white text-sm" />
              </a>
              <a
                href="https://facebook.com/aspenautomotores"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <FaFacebookF className="text-white text-sm" />
              </a>
            </div>
          </div>

          {/* Navegacion */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Navegacion</h3>
            <Link to="/" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Inicio</Link>
            <Link to="/usados" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Busca tu usado</Link>
            <Link to="/nuevos" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Vehiculos 0km</Link>
            <Link to="/financiacion" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Nuestra financiacion</Link>
            <Link to="/nosotros" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Contactate con nosotros</Link>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Contacto</h3>
            <a
              href="https://wa.me/5493513232880"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm transition-colors"
            >
              <FaWhatsapp className="text-red-500 flex-shrink-0" />
              +54 9 351 323 2880
            </a>
            <div className="flex items-start gap-2 text-zinc-400 text-sm">
              <FaClock className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p>Lunes a Viernes</p>
                <p>9 a 13hs y 15 a 19hs</p>
                <p>Sabados: 9:30 a 13hs</p>
              </div>
            </div>
          </div>

          {/* Sucursales */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Sucursales</h3>
            <div className="flex items-start gap-2 text-zinc-400 text-sm">
              <FaMapMarkerAlt className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>Av. Pueyredon 2550</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-400 text-sm">
              <FaMapMarkerAlt className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>Av. Fuerza Aerea 3020</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800 py-5 text-center mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center text-center justify-between gap-2">
          <p className="text-zinc-500 text-xs">
            &copy; 2025 Aspen Automotores. Todos los derechos reservados.
          </p>
          
        </div>
      </div>
    </footer>
  )
}

export default Footer