import { useState } from "react"
import api from "../api/axios"

const PASOS = ["Vehiculo", "Estado", "Fotos", "Contacto"]

const initialData = {
  // Vehiculo
  marca: "",
  modelo: "",
  anio: "",
  version: "",
  kilometros: "",
  combustible: "",
  transmision: "",
  // Estado
  estadoGeneral: "",
  unicoDueno: "",
  tieneDeuda: "",
  serviceAlDia: "",
  observaciones: "",
  // Contacto
  nombre: "",
  telefono: "",
  email: "",
  horarioContacto: "",
  ideaPrecio: "",
}

// Estilos reutilizables
const inputBase = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
const inputStyle = { background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f5f5" }
const labelClass = "text-xs font-semibold uppercase tracking-widest mb-1.5 block"
const labelStyle = { color: "#6b7280" }

const Campo = ({ label, name, value, onChange, type = "text", placeholder, required, options }) => (
  <div className="flex flex-col">
    <label className={labelClass} style={labelStyle}>
      {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={inputBase}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
      >
        <option value="">Seleccionar...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputBase}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
      />
    )}
  </div>
)

const Opciones = ({ label, name, value, onChange, opciones }) => (
  <div className="flex flex-col">
    <label className={labelClass} style={labelStyle}>
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {opciones.map((op) => (
        <button
          key={op}
          type="button"
          onClick={() => onChange({ target: { name, value: op } })}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            background: value === op ? "#dc2626" : "#0a0a0a",
            border: `1px solid ${value === op ? "#dc2626" : "#2a2a2a"}`,
            color: value === op ? "white" : "#a3a3a3",
          }}
        >
          {op}
        </button>
      ))}
    </div>
  </div>
)

 const VendeTuAuto = () => {
  const [paso, setPaso] = useState(0)
  const [data, setData] = useState(initialData)
  const [fotos, setFotos] = useState([])
  const [estado, setEstado] = useState(null) // "enviando" | "ok" | "error"
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrores((prev) => ({ ...prev, [e.target.name]: false }))
  }

  const handleFotos = (e) => {
    const nuevas = Array.from(e.target.files)
    setFotos((prev) => [...prev, ...nuevas].slice(0, 8)) // max 8
  }

  const quitarFoto = (idx) => {
    setFotos((prev) => prev.filter((_, i) => i !== idx))
  }

  // Validacion por paso
  const validarPaso = () => {
    const nuevosErrores = {}
    if (paso === 0) {
      if (!data.marca) nuevosErrores.marca = true
      if (!data.modelo) nuevosErrores.modelo = true
      if (!data.anio) nuevosErrores.anio = true
      if (!data.kilometros) nuevosErrores.kilometros = true
    }
    if (paso === 3) {
      if (!data.nombre) nuevosErrores.nombre = true
      if (!data.telefono) nuevosErrores.telefono = true
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const siguiente = () => {
    if (!validarPaso()) return
    setPaso((p) => Math.min(p + 1, PASOS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const anterior = () => {
    setPaso((p) => Math.max(p - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validarPaso()) return
    setEstado("enviando")

    // Lead normalizado — estructura lista para mapear al CRM
    const lead = {
      origen: "web_vende_tu_auto",
      fuente: "Sitio Web - Vende tu auto",
      url: window.location.href,
      fecha: new Date().toISOString(),
      contacto: {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        horarioContacto: data.horarioContacto,
        ideaPrecio: data.ideaPrecio || null, 
      },
      vehiculo: {
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
        version: data.version,
        kilometros: data.kilometros,
        combustible: data.combustible,
        transmision: data.transmision,
        estadoGeneral: data.estadoGeneral,
        unicoDueno: data.unicoDueno,
        tieneDeuda: data.tieneDeuda,
        serviceAlDia: data.serviceAlDia,
        observaciones: data.observaciones,
      },
    }

    try {
      // Si hay fotos -> multipart; el backend sube a Cloudinary y arma el lead final
      const formData = new FormData()
      formData.append("lead", JSON.stringify(lead))
      fotos.forEach((file) => formData.append("fotos", file))

      await api.post("/api/cotizaciones", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setEstado("ok")
    } catch {
      setEstado("error")
    }
  }

  const resetForm = () => {
    setData(initialData)
    setFotos([])
    setPaso(0)
    setEstado(null)
    setErrores({})
  }

  return (
    <>
      <main className="min-h-screen bg-black pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#1e1e1e", color: "#dc2626", border: "1px solid #2a2a2a" }}
            >
              Cotizacion sin compromiso
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-balance" style={{ color: "#f5f5f5" }}>
              Vende tu <span style={{ color: "#dc2626" }}>auto</span>
            </h1>
            <p className="text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed" style={{ color: "#a3a3a3" }}>
             Sigué los pasos para obtener tu cotización al instante. 
            </p>
          </div>

          {estado === "ok" ? (
            <div
              className="rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center"
              style={{ background: "#111111", border: "1px solid #1e1e1e" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "#dc26261a", border: "1px solid #dc262640" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-black" style={{ color: "#f5f5f5" }}>
                Recibimos tu cotizacion!
              </h2>
              <p className="text-sm max-w-md" style={{ color: "#a3a3a3" }}>
                Un asesor de Aspen Automotores va a revisar los datos de tu {data.marca} {data.modelo} y se va a
                comunicar con vos a la brevedad.
              </p>
              <button
                onClick={resetForm}
                className="mt-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
                style={{ background: "#dc2626", color: "white" }}
              >
                Cotizar otro vehiculo
              </button>
            </div>
          ) : (
            <div className="rounded-2xl p-6 md:p-8" style={{ background: "#111111", border: "1px solid #1e1e1e" }}>
              {/* Barra de progreso */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  {PASOS.map((nombre, i) => (
                    <div key={nombre} className="flex flex-col items-center flex-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        style={{
                          background: i <= paso ? "#dc2626" : "#1a1a1a",
                          color: i <= paso ? "white" : "#6b7280",
                          border: `1px solid ${i <= paso ? "#dc2626" : "#2a2a2a"}`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <span
                        className="text-xs mt-2 hidden sm:block"
                        style={{ color: i <= paso ? "#f5f5f5" : "#6b7280" }}
                      >
                        {nombre}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-full h-1 rounded-full" style={{ background: "#1a1a1a" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ background: "#dc2626", width: `${((paso + 1) / PASOS.length) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* PASO 1 — Vehiculo */}
                {paso === 0 && (
                  <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold" style={{ color: "#f5f5f5" }}>
                      Datos del vehiculo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Campo label="Marca" name="marca" value={data.marca} onChange={handleChange} placeholder="Ej: Volkswagen" required />
                        {errores.marca && <span className="text-xs mt-1 block" style={{ color: "#ef4444" }}>Campo requerido</span>}
                      </div>
                      <div>
                        <Campo label="Modelo" name="modelo" value={data.modelo} onChange={handleChange} placeholder="Ej: Gol Trend" required />
                        {errores.modelo && <span className="text-xs mt-1 block" style={{ color: "#ef4444" }}>Campo requerido</span>}
                      </div>
                      <div>
                        <Campo label="Año" name="anio" value={data.anio} onChange={handleChange} type="number" placeholder="Ej: 2018" required />
                        {errores.anio && <span className="text-xs mt-1 block" style={{ color: "#ef4444" }}>Campo requerido</span>}
                      </div>
                      <div>
                        <Campo label="Kilometros" name="kilometros" value={data.kilometros} onChange={handleChange} type="number" placeholder="Ej: 65000" required />
                        {errores.kilometros && <span className="text-xs mt-1 block" style={{ color: "#ef4444" }}>Campo requerido</span>}
                      </div>
                      <Campo label="Version" name="version" value={data.version} onChange={handleChange} placeholder="Ej: 1.6 Comfortline" />
                      <Campo label="Combustible" name="combustible" value={data.combustible} onChange={handleChange} options={["Nafta", "Diesel", "GNC", "Hibrido", "Electrico"]} />
                    </div>
                    <Campo label="Transmision" name="transmision" value={data.transmision} onChange={handleChange} options={["Manual", "Automatica"]} />
                  </div>
                )}

                {/* PASO 2 — Estado */}
                {paso === 1 && (
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-bold" style={{ color: "#f5f5f5" }}>
                      Estado del vehiculo
                    </h3>
                    <Opciones label="Estado general" name="estadoGeneral" value={data.estadoGeneral} onChange={handleChange} opciones={["Excelente", "Muy bueno", "Bueno", "Regular"]} />
                    <Opciones label="Sos el unico dueño?" name="unicoDueno" value={data.unicoDueno} onChange={handleChange} opciones={["Si", "No"]} />
                    <Opciones label="Tiene deuda o prenda?" name="tieneDeuda" value={data.tieneDeuda} onChange={handleChange} opciones={["No", "Si"]} />
                    <Opciones label="Service al dia?" name="serviceAlDia" value={data.serviceAlDia} onChange={handleChange} opciones={["Si", "No"]} />
                    <div className="flex flex-col">
                      <label className={labelClass} style={labelStyle}>
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        value={data.observaciones}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Detalles, accesorios, golpes, lo que quieras aclarar..."
                        className={`${inputBase} resize-none`}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                      />
                    </div>
                  </div>
                )}

                {/* PASO 3 — Fotos */}
                {paso === 2 && (
                  <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold" style={{ color: "#f5f5f5" }}>
                      Fotos del vehiculo <span className="text-sm font-normal" style={{ color: "#6b7280" }}>(opcional)</span>
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#a3a3a3" }}>
                      Sumar fotos nos ayuda a darte una tasacion mas precisa. Podes subir hasta 8 imagenes.
                    </p>

                    <label
                      className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                      style={{ background: "#0a0a0a", border: "2px dashed #2a2a2a" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: "#f5f5f5" }}>
                        Toca para agregar fotos
                      </span>
                      <span className="text-xs" style={{ color: "#6b7280" }}>
                        JPG, PNG — hasta 8 imagenes
                      </span>
                      <input type="file" accept="image/*" multiple onChange={handleFotos} className="hidden" />
                    </label>

                    {fotos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {fotos.map((file, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
                            <img src={URL.createObjectURL(file) || "/placeholder.svg"} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => quitarFoto(idx)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 4 — Contacto */}
                {paso === 3 && (
                  <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold" style={{ color: "#f5f5f5" }}>
                      Tus datos de contacto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Campo label="Nombre completo" name="nombre" value={data.nombre} onChange={handleChange} placeholder="Tu nombre" required />
                        {errores.nombre && <span className="text-xs mt-1 block" style={{ color: "#ef4444" }}>Campo requerido</span>}
                      </div>
                      <div>
                        <Campo label="Telefono" name="telefono" value={data.telefono} onChange={handleChange} type="tel" placeholder="Ej: 351 123 4567" required />
                        {errores.telefono && <span className="text-xs mt-1 block" style={{ color: "#ef4444" }}>Campo requerido</span>}
                      </div>
                    </div>
                    <Campo label="Email" name="email" value={data.email} onChange={handleChange} type="email" placeholder="tucorreo@email.com" />
                    <Campo label="Horario preferido de contacto" name="horarioContacto" value={data.horarioContacto} onChange={handleChange} options={["Mañana", "Tarde", "Noche", "Cualquier horario"]} />
                    <div className="flex flex-col">
                      <label className={labelClass} style={labelStyle}>
                        Idea de precio <span className="normal-case tracking-normal font-normal" style={{ color: "#6b7280" }}>(opcional)</span>
                      </label>
                      <input
                        type="text"
                        name="ideaPrecio"
                        value={data.ideaPrecio}
                        onChange={handleChange}
                        placeholder="Ej: $10.000.000"
                        className={inputBase}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                      />
                      <span className="text-xs mt-1.5" style={{ color: "#6b7280" }}>
                        Cuanto esperarias recibir por tu auto aproximadamente?
                      </span>
                    </div>
                    {/* Resumen */}
                    <div className="rounded-xl p-4 mt-2" style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#dc2626" }}>
                        Resumen
                      </p>
                      <p className="text-sm" style={{ color: "#f5f5f5" }}>
                        {data.marca} {data.modelo} {data.anio} {data.version && `— ${data.version}`}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                        {data.kilometros && `${Number(data.kilometros).toLocaleString("es-AR")} km`}
                        {data.combustible && ` · ${data.combustible}`}
                        {data.transmision && ` · ${data.transmision}`}
                        {fotos.length > 0 && ` · ${fotos.length} foto(s)`}
                      </p>
                      {data.ideaPrecio && (
                        <p className="text-xs mt-1.5" style={{ color: "#a3a3a3" }}>
                          Idea de precio: <span style={{ color: "#f5f5f5" }}>{data.ideaPrecio}</span>
                        </p>
                      )}
                    </div>

                    {estado === "error" && (
                      <p className="text-sm text-center" style={{ color: "#ef4444" }}>
                        Hubo un error al enviar. Intenta de nuevo en unos minutos.
                      </p>
                    )}
                  </div>
                )}

                {/* Navegacion */}
                <div className="flex items-center justify-between gap-3 mt-8">
                  {paso > 0 ? (
                    <button
                      type="button"
                      onClick={anterior}
                      className="px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
                      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                    >
                      Atras
                    </button>
                  ) : (
                    <span />
                  )}

                  {paso < PASOS.length - 1 ? (
                    <button
                      type="button"
                      onClick={siguiente}
                      className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
                      style={{ background: "#dc2626", color: "white" }}
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={estado === "enviando"}
                      className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
                      style={{ background: estado === "enviando" ? "#7f1d1d" : "#dc2626", color: "white", opacity: estado === "enviando" ? 0.7 : 1 }}
                    >
                      {estado === "enviando" ? "Enviando..." : "Enviar cotizacion"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default VendeTuAuto