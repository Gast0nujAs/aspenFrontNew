import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../api/axios"
import { HiPlus, HiPencil, HiTrash, HiLogout, HiSearch, HiEye } from "react-icons/hi"
import { cloudinaryThumb } from "../lib/imageUrl"

export default function AdminDashboard() {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    cargarVehiculos()
  }, [])

  const cargarVehiculos = async () => {
    try {
      const [resCars, resMotos] = await Promise.all([
        api.get("/api/cars?limit=1000"),
        api.get("/api/motos?limit=1000"),
      ])
     const extraer = (res) => res.data.vehiculos || res.data.data || res.data
      const autos = extraer(resCars)
      const motos = extraer(resMotos)

      const todos = [...(Array.isArray(autos) ? autos : []), ...(Array.isArray(motos) ? motos : [])]
      setVehiculos(todos)
      setLoading(false)
    } catch (error) {
      console.error("Error cargando vehículos:", error)
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este vehículo?")) return

    try {
      // Intentar DELETE primero, si falla (403 en hosting) usar POST alternativo
      try {
        await api.delete(`/api/admin/cars/${id}`)
      } catch (deleteError) {
        if (deleteError.response?.status === 403 || deleteError.response?.status === 405) {
          await api.post(`/api/admin/cars/${id}/delete`)
        } else {
          throw deleteError
        }
      }
      alert("Vehículo eliminado exitosamente")
      cargarVehiculos()
    } catch (error) {
      alert("Error al eliminar vehículo")
      console.error(error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const vehiculosFiltrados = Array.isArray(vehiculos)
    ? vehiculos.filter(
        (v) =>
          v.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.modelo?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
              <p className="text-sm text-gray-400">Bienvenido, {user?.nombre}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <HiLogout className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <button
            onClick={() => navigate("/admin/vehiculos/nuevo")}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            Agregar Nuevo Vehículo
          </button>

          {/* Búsqueda */}
          <div className="relative w-full sm:w-96">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">Total Vehículos</p>
            <p className="text-3xl font-bold text-white mt-2">{vehiculos.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">Resultados</p>
            <p className="text-3xl font-bold text-white mt-2">{vehiculosFiltrados.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">Usuario Activo</p>
            <p className="text-xl font-bold text-white mt-2">{user?.username}</p>
          </div>
        </div>

        {/* Tabla de vehículos */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Kilometraje
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      Cargando vehículos...
                    </td>
                  </tr>
                ) : vehiculosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No se encontraron vehículos
                    </td>
                  </tr>
                ) : (
                  vehiculosFiltrados.map((vehiculo) => (
                    <tr key={vehiculo.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cloudinaryThumb(vehiculo.imagenes?.[0], 120)}
                            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => { e.target.src = "/placeholder.jpg" }}
                          />
                          <div>
                            <p className="text-white font-semibold">
                              {vehiculo.marca} {vehiculo.modelo}
                            </p>
                            <p className="text-gray-400 text-sm">{vehiculo.transmision}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{vehiculo.año || vehiculo.anio}</td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {vehiculo.moneda === "USD" ? "U$D" : "$"} {vehiculo.precio?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{vehiculo.kilometros} km</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            vehiculo.estado === "Nuevo"
                              ? "bg-green-900/20 text-green-500 border border-green-600"
                              : "bg-blue-900/20 text-blue-500 border border-blue-600"
                          }`}
                        >
                          {vehiculo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/usados/${vehiculo.id}`)}
                            className="p-2 text-blue-500 hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Ver"
                          >
                            <HiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/vehiculos/editar/${vehiculo.id}`)}
                            className="p-2 text-yellow-500 hover:bg-yellow-900/20 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <HiPencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEliminar(vehiculo.id)}
                            className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


