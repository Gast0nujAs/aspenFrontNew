import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Squash as Hamburger } from "hamburger-react"
import { FiChevronDown } from "react-icons/fi"
import { motion } from "framer-motion"
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [catalogoOpen, setCatalogoOpen] = useState(false)
  const [catalogoMobileOpen, setCatalogoMobileOpen] = useState(false)
  const timeoutRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setCatalogoOpen(false)
    setCatalogoMobileOpen(false)
  }, [location])

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setCatalogoOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setCatalogoOpen(false), 200)
  }

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/vende-tu-auto", label: "Vendé tu auto" },
    { to: "/financiacion", label: "Financiación" },
    { to: "/nosotros", label: "Nosotros" },

  ]

  const irAUbicacion = () => {
    if (location.pathname === "/") {
      // Ya estamos en home, scrollear directo
      const el = document.getElementById("ubicacion")
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } else {
      // Ir al home y luego scrollear
      navigate("/")
      setTimeout(() => {
        const el = document.getElementById("ubicacion")
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }, 400)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-zinc-950/95 backdrop-blur-sm shadow-lg shadow-black/50" : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logonav.png" alt="Aspen Automotores" className="h-17 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-md font-semibold transition-colors ${location.pathname === "/" ? "text-red-500" : "text-white hover:text-red-400"
                }`}
            >
              Inicio
            </Link>

            {/* Catalogo dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 text-md font-semibold text-white hover:text-red-400 transition-colors">
                Catálogo
                <FiChevronDown
                  className={`transition-transform duration-200 ${catalogoOpen ? "rotate-180" : ""}`}
                />
              </button>
              {catalogoOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/motos"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-red-600 transition-colors"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Motos
                  </Link>
                  <Link
                    to="/usados"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-red-600 transition-colors"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Usados
                  </Link>
                  <div className="h-px bg-zinc-800" />
                  <Link
                    to="/nuevos"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-red-600 transition-colors"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    0km
                  </Link>
                </div>
              )}
            </div>

            {links.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-md font-semibold transition-colors ${location.pathname === link.to ? "text-red-500" : "text-white hover:text-red-400"
                  }`}
              >
                {link.label}
              </Link>
            ))}


            <a
              onClick={irAUbicacion}
              className="text-white text-md font-bold px-1  rounded-lg transition-colors hover:text-red-400 cursor-pointer"
            >
              Ubicación
            </a>
          </div>






          {/* Mobile hamburger */}
          <div className="md:hidden text-white">
            <Hamburger toggled={isOpen} toggle={setIsOpen} size={22} color="#fff" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 flex flex-col gap-2">
          <Link to="/" className="text-white font-semibold py-3 border-b border-zinc-800">Inicio</Link>

          <div>
            <button
              onClick={() => setCatalogoMobileOpen(!catalogoMobileOpen)}
              className="w-full flex items-center justify-between text-white font-semibold py-3 border-b border-zinc-800"
            >
              Catálogo
              <FiChevronDown className={`transition-transform ${catalogoMobileOpen ? "rotate-180" : ""}`} />
            </button>
            {catalogoMobileOpen && (
              <div className="pl-4 flex flex-col gap-1 mt-1">
                <Link to="/motos" className="text-zinc-300 py-2 hover:text-red-400 transition-colors">Motos</Link>

                <Link to="/usados" className="text-zinc-300 py-2 hover:text-red-400 transition-colors">Usados</Link>
                <Link to="/nuevos" className="text-zinc-300 py-2 hover:text-red-400 transition-colors">0km</Link>
              </div>
            )}
          </div>

          {links.slice(1).map((link) => (
            <Link key={link.to} to={link.to} className="text-white font-semibold py-3 border-b border-zinc-800">
              {link.label}
            </Link>
          ))}

          <button>
          </button>

          <a
            onClick={irAUbicacion}
            className="text-white text-lg font-bold   rounded-lg transition-colors hover:text-red-400 cursor-pointer"
          >
            Ubicación
          </a>
        </div>
      )}
    </nav>
  )
}

export default NavBar