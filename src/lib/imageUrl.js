const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const resolveImageUrl = (path, fallback = "/placeholder.jpg") => {
  if (!path) return fallback
  if (path.startsWith("blob:")) return path
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const clean = path.startsWith("/") ? path : `/${path}`
  return `${API_URL}${clean}`
}

/**
 * Formatea el precio de un vehiculo.
 * Si precio es 0, null, undefined o vacio, devuelve "Consultar precio con un asesor".
 */
export const formatPrecio = (precio, moneda) => {
  const num = Math.floor(Number(precio))
  if (!precio || num === 0) return "Consultar con un asesor"
  const formatted = num.toLocaleString("es-AR")
  return moneda === "USD" ? `USD ${formatted}` : `$ ${formatted}`
}


export const cloudinaryThumb = (url, width = 600) => {
  if (!url) return "/placeholder.jpg"
  if (url.includes("res.cloudinary.com")) {
    return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`)
  }
  return resolveImageUrl(url)
}