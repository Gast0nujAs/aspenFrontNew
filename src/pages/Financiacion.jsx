import { FaWhatsapp, FaCircle } from "react-icons/fa"
import { FiInfo } from "react-icons/fi"
import bancor from "../assets/bancor.webp"
import nacion from "../assets/nacion.png"
import supervielle from "../assets/supervielle.png"
import santander from "../assets/santander.png"
import mg from "../assets/mg.jpg"


/* ---- datos de bancos ---- */
const personales = [
  {
    nombre: "Bancor",
    logo: bancor,
    logoBg: "#ffffff",
    tipo: "Tasa UVA o Fija",
    bullets: [
      { label: "Financia hasta el", valor: "100%", color: "white" },
      { label: "Tasa UVA", valor: "22% TNA", color: "red" },
      { label: "Tasa Fija", valor: "42% TNA", color: "red" },
      { label: "Todos los modelos", valor: null, color: "white" },
    ],
  },
  {
    nombre: "Banco Nación",
    logo: nacion,
    logoBg: "#ffffff",
    tipo: "Tasa Fija",
    bullets: [
      { label: "Financia hasta el", valor: "100%", color: "white" },
      { label: "Tasa fija", valor: "38% TNA", color: "red" },
      { label: "2016 en adelante", valor: null, color: "white" },
    ],
  },
]

const prendarios = [
  {
    nombre: "Supervielle",
    logo: supervielle,
    logoBg: "#ffffff",
    tipo: "Fija o UVA",
    bullets: [
      { label: "Financia hasta el", valor: "50%", color: "white" },
      { label: "Tasa Fija o UVA", valor: null, color: "neutral" },
      { label: "2012 en adelante", valor: null, color: "white" },
    ],
  },
  {
    nombre: "Santander",
    logo: santander,
    logoBg: "#ffffff",
    tipo: "Fija o UVA",
    bullets: [
      { label: "Financia hasta el", valor: "80%", color: "white" },
      { label: "Tasa fija o UVA", valor: null, color: "neutral" },
      { label: "2016 en adelante", valor: null, color: "white" },
    ],
  },
  {
    nombre: "MG Group",
    logo: mg,
    logoBg: "#f3f0ff",
    tipo: "Fija o Uva",
    bullets: [
      { label: "Financia hasta el", valor: "50%", color: "white" },
      { label: "Tasa Fija o Uva", valor: null, color: "neutral" },
      { label: "2005 en adelante", valor: null, color: "white" },
    ],
  },
]

/* ---- card individual ---- */
const BancoCard = ({ banco }) => (
  <div
    className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
    style={{ border: "1px solid #222", background: "#111" }}
  >
    {/* Logo area */}
    <div
      className="flex items-center justify-center"
      style={{ background: banco.logoBg, minHeight: "100px", padding: "20px 32px" }}
    >
      {banco.logo ? (
        <img src={banco.logo} alt={banco.nombre} className="max-h-14 w-auto object-contain" />
      ) : banco.logoText ? (
        <div className="text-center leading-tight">
          <span
            className="font-black"
            style={{
              color: banco.logoText.color,
              fontSize: banco.logoText.linea2 ? "1.6rem" : "1.8rem",
              letterSpacing: "-0.02em",
              display: "block",
            }}
          >
            {banco.logoText.linea1}
          </span>
          {banco.logoText.linea2 && (
            <span
              className="font-black"
              style={{ color: banco.logoText.color, fontSize: "1.8rem", display: "block" }}
            >
              {banco.logoText.linea2}
            </span>
          )}
        </div>
      ) : null}
    </div>

    {/* Info area */}
    <div className="flex flex-col gap-3 p-5" style={{ background: "#111" }}>
      {/* Nombre + badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          <FaCircle style={{ color: "#dc2626", fontSize: "8px" }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "#f5f5f5" }}>{banco.nombre}</p>
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5"
            style={{ background: "rgba(220,38,38,0.12)", color: "#f87171" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#dc2626" }}
            />
            {banco.tipo}
          </span>
        </div>
      </div>

      {/* Bullets */}
      <ul className="flex flex-col gap-1.5 mt-1">
        {banco.bullets.map((b, i) => (
          <li key={i} className="flex items-baseline gap-2 text-sm">
            <span style={{ color: "#dc2626", flexShrink: 0 }}>•</span>
            <span style={{ color: "#a3a3a3" }}>
              {b.label}{" "}
              {b.valor && (
                <span
                  style={{
                    color: b.color === "red" ? "#f87171" : b.color === "white" ? "#f5f5f5" : "#a3a3a3",
                    fontWeight: b.color !== "neutral" ? "700" : "400",
                  }}
                >
                  {b.valor}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

/* ---- separador de sección ---- */
const SeccionTitulo = ({ titulo }) => (
  <div className="flex items-center gap-4 my-8">
    <div className="flex-1 h-px" style={{ background: "#222" }} />
    <h2 className="text-lg font-bold px-2 whitespace-nowrap" style={{ color: "#f5f5f5" }}>
      {titulo}
    </h2>
    <div className="flex-1 h-px" style={{ background: "#222" }} />
  </div>
)

/* ---- componente principal ---- */
const Financiacion = () => (
  <div
    className="min-h-screen w-full py-20 px-4"
    style={{ background: "#000000", marginTop: "90px" }}
  >
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "#f5f5f5" }}>
          Nuestra Financiación
        </h1>
        <div style={{ width: "60px", height: "3px", background: "#dc2626", margin: "0 auto 16px" }} />
        <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#dc2626" }}>
          Trabajamos con Bancos de primera línea para ofrecerte las mejores financiaciones y así llevarte el
          auto que quieras de la forma más conveniente para vos.
        </p>
      </div>

      {/* Creditos Personales */}
      <SeccionTitulo titulo="Creditos Personales" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {personales.map((b) => (
          <BancoCard key={b.nombre} banco={b} />
        ))}
      </div>

      {/* Creditos Prendarios */}
      <SeccionTitulo titulo="Creditos Prendarios" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {prendarios.map((b) => (
          <BancoCard key={b.nombre} banco={b} />
        ))}
      </div>

      {/* Proceso de Gestión */}
      <div
        className="rounded-xl p-6 md:p-8 mt-10 text-center"
        style={{ background: "#111", border: "1px solid #222" }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <FiInfo style={{ color: "#dc2626", fontSize: "18px" }} />
          <h3 className="font-bold text-base" style={{ color: "#f5f5f5" }}>Proceso de Gestión</h3>
        </div>
        <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: "#a3a3a3" }}>
          Todo se gestiona directamente desde la agencia y una vez aprobado el crédito se entrega el vehículo.{" "}
          <strong style={{ color: "#f5f5f5" }}>
            Aproximadamente demora entre 3 a 5 días hábiles
          </strong>{" "}
          para la aprobación del crédito.{" "}
          <a
            href="https://wa.me/5493513232880?text=Hola! Quiero consultar sobre financiacion."
            target="_blank"
            rel="noreferrer"
            style={{ color: "#dc2626", fontWeight: "600" }}
          >
            Consultanos para más información y brindarte el mejor asesoramiento!
          </a>
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <a
            href="https://wa.me/5493513232880?text=Hola! Quiero consultar sobre financiacion."
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
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-colors"
            style={{ background: "#1a1a1a", color: "#f5f5f5", border: "1px solid #333" }}
          >
            Llamar ahora
          </a>
        </div>
      </div>

    </div>
  </div>
)

export default Financiacion