import { useState, useCallback, useEffect, useRef } from "react"
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api"

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a3a3a3" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#333333" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#737373" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1f2e1f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a3a3a" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1b2a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4a5a6a" }] },
]

const containerStyle = { width: "100%", height: "100%" }

// Coordenadas hardcodeadas — no requieren Geocoding API
const COORDS = {
  0: { lat: -31.419546013036243, lng: -64.21912198206631 }, // Av. Pueyrredon 2550
  1: { lat: -31.431115492145203, lng: -64.22923121677704 }, // Av. Fuerza Aerea 3020
}

const MapaSucursales = ({ sucursales, sucursalActiva, setSucursalActiva }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-aspen",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
  })

  const mapRef = useRef(null)
  const [infoAbierta, setInfoAbierta] = useState(sucursalActiva)

  const onLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  // Centra el mapa y abre el popup cuando cambia la sucursal activa desde los botones
  useEffect(() => {
    if (!mapRef.current) return
    const pos = COORDS[sucursalActiva]
    if (pos) {
      mapRef.current.panTo(pos)
      mapRef.current.setZoom(15)
      setInfoAbierta(sucursalActiva)
    }
  }, [sucursalActiva])

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400 text-sm">
        No se pudo cargar el mapa. Verifica la API key.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400 text-sm">
        Cargando mapa...
      </div>
    )
  }

  const sucursalSel = sucursales.find((s) => s.id === infoAbierta)

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={COORDS[sucursalActiva] || COORDS[0]}
      zoom={15}
      onLoad={onLoad}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
        gestureHandling: "cooperative",
      }}
    >
      {sucursales.map((s) => {
        const pos = COORDS[s.id]
        if (!pos) return null
        const esActiva = s.id === sucursalActiva
        return (
          <MarkerF
            key={s.id}
            position={pos}
            onClick={() => {
              setSucursalActiva(s.id)
              setInfoAbierta(s.id)
            }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: esActiva ? 12 : 9,
              fillColor: "#dc2626",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: esActiva ? 3 : 2,
            }}
          />
        )
      })}

    
    </GoogleMap>
  )
}

export default MapaSucursales
