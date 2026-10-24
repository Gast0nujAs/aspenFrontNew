import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import api from "../api/axios"
import "swiper/css"
import "swiper/css/navigation"
import { Navigation } from "swiper/modules"
import { useNavigate } from "react-router-dom"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { cloudinaryThumb , formatPrecio} from "../lib/imageUrl"

const VehiculosHome = () => {
  const [vehiculos, setVehiculos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get("/api/cars")
      .then((response) => {
        const vehiculosData = response.data.data || response.data || []
        const vehiculosOrdenados = Array.isArray(vehiculosData)
          ? vehiculosData
            .filter((v) => {
              const imgs = Array.isArray(v.imagenes)
                ? v.imagenes
                : typeof v.imagenes === "string"
                  ? (() => { try { return JSON.parse(v.imagenes) } catch { return [] } })()
                  : []
              return imgs.some((img) => img && img.includes("res.cloudinary.com"))
            })
            .sort((a, b) => b.id - a.id)
          : []
        setVehiculos(vehiculosOrdenados)
      })
      .catch((error) => console.error("Error cargando vehículos:", error))
  }, [])

  return (
    <div className="relative px-4 md:px-8 lg:px-16 py-16 md:py-24 bg-black">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-block">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">
            Destacados de la Semana
          </h2>
          <div className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        </div>
        <p className="text-gray-400 mt-4 text-sm md:text-base max-w-2xl mx-auto">
          Descubrí nuestra selección premium de vehículos con las mejores condiciones del mercado
        </p>
      </div>

      <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10">
        <button className="bg-gray-900 border border-gray-800 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-red-600 hover:border-red-600 transition-all duration-300 swiper-button-prev-custom cursor-pointer group">
          <HiChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10">
        <button className="bg-gray-900 border border-gray-800 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-red-600 hover:border-red-600 transition-all duration-300 swiper-button-next-custom cursor-pointer group">
          <HiChevronRight size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <Swiper
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        spaceBetween={20}
        modules={[Navigation]}
        className="mySwiper w-full px-2 md:px-8"
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 3 },
          1660: { slidesPerView: 4 },
        }}
      >
        {Array.isArray(vehiculos) &&
          vehiculos.map((vehiculo) => {
            const imagenes = Array.isArray(vehiculo.imagenes)
              ? vehiculo.imagenes
              : typeof vehiculo.imagenes === "string"
                ? (() => { try { return JSON.parse(vehiculo.imagenes) } catch { return [] } })()
                : []
            const portada = imagenes[0] || null
            const anio = vehiculo["año"] || vehiculo["anio"] || vehiculo["ano"] || ""
            const ruta = vehiculo.tipo === "nuevo" ? `/nuevos/${vehiculo.id}` : `/usados/${vehiculo.id}`

            return (
              <SwiperSlide key={vehiculo.id}>
                <div
                  className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-red-600 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-2"
                  onClick={() => navigate(ruta)}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                      Destacado
                    </span>
                  </div>

                  <div className="relative h-56 md:h-64 overflow-hidden bg-gray-800">
                    <img
                      src={cloudinaryThumb(portada, 600)}
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "/placeholder.jpg" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  </div>

                  <div className="p-5 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors duration-300">
                      {vehiculo.marca} {vehiculo.modelo}
                    </h3>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{anio}</span>
                        <span className="text-gray-700">•</span>
                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm">{vehiculo.kilometros ? `${Number(vehiculo.kilometros).toLocaleString("es-AR")} km` : "0 km"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm">{vehiculo.combustible}</span>
                        <span className="text-gray-700">•</span>
                        <span className="text-sm">{vehiculo.transmision}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 my-4"></div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Precio</p>
                        <p className="text-md md:text-lg font-bold text-white group-hover:text-red-500 transition-colors duration-300">
                         {formatPrecio(vehiculo.precio, vehiculo.moneda)}
                        </p>
                      </div>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors duration-300 group-hover:scale-105">
                        Ver mas
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
      </Swiper>

      <div className="text-center mt-12 md:mt-16">
        <button
          onClick={() => navigate("/usados")}
          className="bg-transparent cursor-pointer border-2 border-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm md:text-base uppercase tracking-wide group"
        >
          Ver Todos los Vehículos
          <svg
            className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default VehiculosHome