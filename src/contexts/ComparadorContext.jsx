import { createContext, useContext, useState } from "react"

const ComparadorContext = createContext()

export const useComparador = () => {
  const context = useContext(ComparadorContext)
  if (!context) {
    throw new Error("useComparador debe usarse dentro de ComparadorProvider")
  }
  return context
}

const MAX = 2

export const ComparadorProvider = ({ children }) => {
  // Cada item: { ...vehiculo, ruta } para poder reconstruir el link de detalle
  const [seleccionados, setSeleccionados] = useState([])

  const estaSeleccionado = (id) => seleccionados.some((v) => v.id === id)

  const toggleVehiculo = (vehiculo, ruta = "usados") => {
    setSeleccionados((prev) => {
      // Si ya esta, lo quito
      if (prev.some((v) => v.id === vehiculo.id)) {
        return prev.filter((v) => v.id !== vehiculo.id)
      }
      // Si esta lleno, ignoro (la UI avisa)
      if (prev.length >= MAX) return prev
      return [...prev, { ...vehiculo, ruta }]
    })
  }

  const quitarVehiculo = (id) => {
    setSeleccionados((prev) => prev.filter((v) => v.id !== id))
  }

  const limpiar = () => setSeleccionados([])

  const lleno = seleccionados.length >= MAX

  return (
    <ComparadorContext.Provider
      value={{
        seleccionados,
        estaSeleccionado,
        toggleVehiculo,
        quitarVehiculo,
        limpiar,
        lleno,
        max: MAX,
      }}
    >
      {children}
    </ComparadorContext.Provider>
  )
}