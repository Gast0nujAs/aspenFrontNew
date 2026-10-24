
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "../api/axios"
import { HiArrowLeft, HiUpload, HiX, HiPlus } from "react-icons/hi"
import { cloudinaryThumb } from "../lib/imageUrl"
import { compressImages } from "../lib/compressImage"

export default function AdminVehiculoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = !!id

  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [vehiculoOriginal, setVehiculoOriginal] = useState(null)
  const [formData, setFormData] = useState({
    categoria: "auto",
    marca: "",
    modelo: "",
    anio: "",
    precio: "",
    moneda: "USD",
    transmision: "Manual",
    kilometros: "",
    combustible: "Nafta",
    sucursal: "Patrimonios",
    estado: "Usado",
    equipamiento: "",
    seguridad: "",
    destacados: "",
    tipo: "",
    cilindrada: "",
  })
  const [imagenes, setImagenes] = useState([])
  const [imagenesPreview, setImagenesPreview] = useState([])
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [imperfecciones, setImperfecciones] = useState([])

  useEffect(() => {
    if (esEdicion) {
      cargarVehiculo()
    }
  }, [id])

  const cargarVehiculo = async () => {
    try {
      // Intentar como auto; si no existe, buscar como moto
      let vehiculo
      try {
        const response = await axios.get(`/api/cars/${id}`)
        vehiculo = response.data
      } catch {
        const responseMoto = await axios.get(`/api/motos/${id}`)
        vehiculo = responseMoto.data
      }
      setVehiculoOriginal(vehiculo)
      console.log("[v0] vehiculo.equipamiento raw:", vehiculo.equipamiento)
      console.log("[v0] vehiculo.seguridad raw:", vehiculo.seguridad)
      console.log("[v0] vehiculo.destacados raw:", vehiculo.destacados)

      setFormData({
        categoria: vehiculo.categoria || "auto",
        marca: vehiculo.marca || "",
        modelo: vehiculo.modelo || "",
        anio: vehiculo.año || vehiculo.anio || "",
        precio: vehiculo.precio || "",
        moneda: vehiculo.moneda || "USD",
        transmision: vehiculo.transmision || "Manual",
        kilometros: vehiculo.kilometros || "",
        combustible: vehiculo.combustible || "Nafta",
        tipo: vehiculo.tipo || "",
        cilindrada: vehiculo.cilindrada || "",
        sucursal: vehiculo.sucursal || "Patrimonios",
        estado: vehiculo.estado || "Usado",
        equipamiento: Array.isArray(vehiculo.equipamiento)
          ? vehiculo.equipamiento.map((e) => (typeof e === "string" ? e : e.nombre)).filter(Boolean).join(", ")
          : typeof vehiculo.equipamiento === "string" ? vehiculo.equipamiento : "",
        seguridad: Array.isArray(vehiculo.seguridad)
          ? vehiculo.seguridad.map((s) => (typeof s === "string" ? s : s.nombre)).filter(Boolean).join(", ")
          : typeof vehiculo.seguridad === "string" ? vehiculo.seguridad : "",
        destacados: Array.isArray(vehiculo.destacados)
          ? vehiculo.destacados.map((d) => (typeof d === "string" ? d : d.nombre)).filter(Boolean).join(", ")
          : typeof vehiculo.destacados === "string" ? vehiculo.destacados : "",
      })

      setImagenesPreview(vehiculo.imagenes || [])
      // Cargar imperfecciones existentes
      if (vehiculo.imperfecciones?.length > 0) {
        setImperfecciones(
          vehiculo.imperfecciones.map((imp) => ({
            titulo: imp.titulo,
            imagenesFiles: [],
            imagenesPreview: imp.imagenes?.map((i) => i.url) || [],
            imagenesExistentes: imp.imagenes?.map((i) => i.url) || [],
          }))
        )
      }
    } catch (error) {
      console.error("Error cargando vehículo:", error)
      alert("Error al cargar el vehículo")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

 const handleImagenesChange = async (e) => {
  const files = await compressImages(e.target.files)
  e.target.value = ""
  setImagenes((prev) => [...prev, ...files])
  const newPreviews = files.map((file) => URL.createObjectURL(file))
  setImagenesPreview((prev) => [...prev, ...newPreviews])
}

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    // Reordenar previews
    const newPreviews = [...imagenesPreview]
    const draggedPreview = newPreviews[draggedIndex]
    newPreviews.splice(draggedIndex, 1)
    newPreviews.splice(dropIndex, 0, draggedPreview)
    setImagenesPreview(newPreviews)

    // Reordenar archivos
    if (imagenes.length > 0) {
      const newImagenes = [...imagenes]
      const draggedImagen = newImagenes[draggedIndex]
      newImagenes.splice(draggedIndex, 1)
      newImagenes.splice(dropIndex, 0, draggedImagen)
      setImagenes(newImagenes)
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }
  const agregarImperfeccion = () => {
    setImperfecciones((prev) => [
      ...prev,
      { titulo: "", imagenesFiles: [], imagenesPreview: [], imagenesExistentes: [] },
    ])
  }

  const eliminarImperfeccion = (idx) => {
    setImperfecciones((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleImperfeccionTitulo = (idx, valor) => {
    setImperfecciones((prev) =>
      prev.map((imp, i) => (i === idx ? { ...imp, titulo: valor } : imp))
    )
  }

 const handleImperfeccionImagenes = async (idx, files) => {
  const nuevosFiles = await compressImages(files, 1600)
  const nuevasPreviews = nuevosFiles.map((f) => URL.createObjectURL(f))
  setImperfecciones((prev) =>
    prev.map((imp, i) =>
      i === idx
        ? { ...imp, imagenesFiles: [...imp.imagenesFiles, ...nuevosFiles], imagenesPreview: [...imp.imagenesPreview, ...nuevasPreviews] }
        : imp
    )
  )
}

  const handleRemoveImperfeccionImagen = (impIdx, imgIdx) => {
    setImperfecciones((prev) =>
      prev.map((imp, i) => {
        if (i !== impIdx) return imp
        const newPreview = imp.imagenesPreview.filter((_, j) => j !== imgIdx)
        const newFiles = imp.imagenesFiles.filter((_, j) => j !== imgIdx)
        const newExistentes = imp.imagenesExistentes.filter((url) =>
          newPreview.includes(url)
        )
        return { ...imp, imagenesPreview: newPreview, imagenesFiles: newFiles, imagenesExistentes: newExistentes }
      })
    )
  }


  const handleRemoveImage = (index) => {
    setImagenesPreview((prev) => prev.filter((_, i) => i !== index))
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }



 const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })

      formDataToSend.append("año", formData.anio)

      const imagenesExistentes = imagenesPreview.filter((p) => !p.startsWith("blob:"))
      formDataToSend.append("imagenesExistentes", JSON.stringify(imagenesExistentes))

      imagenes.forEach((imagen) => {
        formDataToSend.append("imagenes", imagen)
      })

      const imperfeccionesData = imperfecciones.map((imp) => ({
        titulo: imp.titulo,
        imagenes: imp.imagenesExistentes,
      }))
      formDataToSend.append("imperfecciones", JSON.stringify(imperfeccionesData))

      imperfecciones.forEach((imp, idx) => {
        imp.imagenesFiles.forEach((file) => {
          formDataToSend.append(`imagenes_imperfecciones_${idx}`, file)
        })
      })

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      }

      if (esEdicion) {
        await axios.put(`/api/admin/cars/${id}`, formDataToSend, config)
        alert("Vehículo actualizado exitosamente")
      } else {
        await axios.post("/api/admin/cars", formDataToSend, config)
        alert("Vehículo creado exitosamente")
      }

      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Error guardando vehículo:", error)
      alert(error.response?.data?.error || "Error al guardar el vehículo")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }


  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">{esEdicion ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}</h1>
          <div className="h-1 w-24 bg-red-600 mt-2"></div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Información Básica */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Categoría *</label>
              <div className="flex gap-3">
                {["auto", "moto"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, categoria: cat }))}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold capitalize transition-colors border ${formData.categoria === cat
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                      }`}
                  >
                    {cat === "auto" ? "Auto" : "Moto"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Marca *</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Modelo *</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Año *</label>
                <input
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Moneda</label>
                <select
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Kilometraje</label>
                <input
                  type="number"
                  name="kilometros"
                  value={formData.kilometros}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Transmisión</label>
                <select
                  name="transmision"
                  value={formData.transmision}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatica">Automática</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Combustible</label>
                <select
                  name="combustible"
                  value={formData.combustible}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Nafta">Nafta</option>
                  <option value="Diesel">Diesel</option>
                  <option value="GNC">GNC</option>
                  <option value="Electrico">Eléctrico</option>
                  <option value="Hibrido">Híbrido</option>
                </select>
              </div>
              {formData.categoria === "moto" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de moto</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Calle">Calle / Naked</option>
                      <option value="Touring">Touring</option>
                      <option value="Deportiva">Deportiva</option>
                      <option value="Enduro/Cross">Enduro / Cross</option>
                      <option value="Cuatriciclo">Cuatriciclo</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Cilindrada (cc)</label>
                    <input
                      type="number"
                      name="cilindrada"
                      value={formData.cilindrada}
                      onChange={handleInputChange}
                      placeholder="Ej: 150"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sucursal</label>
                <input
                  type="text"
                  name="sucursal"
                  value={formData.sucursal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Características</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Equipamiento (separado por comas)
                </label>
                <textarea
                  name="equipamiento"
                  value={formData.equipamiento}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Aire Acondicionado, Bluetooth, Cierre Centralizado"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Seguridad (separado por comas)</label>
                <textarea
                  name="seguridad"
                  value={formData.seguridad}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="ABS, Airbags, Control de Estabilidad"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Destacados (separado por comas)</label>
                <textarea
                  name="destacados"
                  value={formData.destacados}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Poco kilometraje, Único dueño, Service oficial"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Imágenes</h2>
            <p className="text-sm text-gray-400 mb-4">
              Arrastra las imágenes para cambiar su orden. La primera imagen será la principal.
            </p>

            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              <HiUpload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="text-red-600 hover:text-red-500 font-semibold">Seleccionar imágenes</span>
                <input type="file" multiple accept="image/*" onChange={handleImagenesChange} className="hidden" />
              </label>
              <p className="text-gray-500 text-sm mt-2">PNG, JPG, WEBP hasta 10MB cada una</p>
            </div>

            {imagenesPreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {imagenesPreview.map((preview, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group cursor-move transition-all duration-200 ${draggedIndex === index ? "opacity-50 scale-95" : ""
                      } ${dragOverIndex === index && draggedIndex !== index ? "ring-2 ring-red-600 scale-105" : ""}`}
                  >
                    <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                      {index + 1}
                    </div>

                    {index === 0 && (
                      <div className="absolute top-2 left-10 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                        Principal
                      </div>
                    )}

                    <img
                      src={cloudinaryThumb(preview, 300)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-700"
                      onError={(e) => { e.target.src = "/placeholder.jpg" }}
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <HiX className="w-4 h-4" />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Imperfecciones</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Agregá detalles de imperfecciones con fotos para mayor transparencia.
                </p>
              </div>
              <button
                type="button"
                onClick={agregarImperfeccion}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <HiPlus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            {imperfecciones.length === 0 && (
              <div
                className="rounded-xl p-8 text-center"
                style={{ background: "#111", border: "1px dashed #333" }}
              >
                <p className="text-sm text-gray-500">
                  No hay imperfecciones cargadas. Hace clic en "Agregar" para sumar una.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {imperfecciones.map((imp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-5"
                  style={{ background: "#111", border: "1px solid #262626" }}
                >
                  {/* Cabecera */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={imp.titulo}
                      onChange={(e) => handleImperfeccionTitulo(idx, e.target.value)}
                      placeholder="Descripcion de la imperfeccion (ej: Rayón en puerta delantera)"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImperfeccion(idx)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-600/10 transition-colors"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Upload fotos de imperfeccion */}
                  <label className="flex items-center gap-2 cursor-pointer w-fit mb-3">
                    <div className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded-lg transition-colors">
                      <HiUpload className="w-4 h-4" />
                      Subir fotos
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImperfeccionImagenes(idx, e.target.files)}
                    />
                  </label>

                  {/* Previews fotos imperfeccion */}
                  {imp.imagenesPreview.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {imp.imagenesPreview.map((prev, imgIdx) => (
                        <div key={imgIdx} className="relative group">
                          <img
                            src={cloudinaryThumb(prev, 300)}
                            alt={`imperfeccion ${idx + 1} foto ${imgIdx + 1}`}
                            className="w-24 h-20 object-cover rounded-lg"
                            style={{ border: "1px solid #333" }}
                            onError={(e) => { e.target.src = "/placeholder.jpg" }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImperfeccionImagen(idx, imgIdx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
                {/* Barra de progreso */}
          {loading && (
            <div className="mb-6" role="status" aria-live="polite">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">
                  {uploadProgress < 100
                    ? "Subiendo fotos..."
                    : "Procesando fotos en el servidor, no cierres esta página..."}
                </span>
                <span className="text-white font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-red-600 transition-all duration-300 ${uploadProgress === 100 ? "animate-pulse" : ""}`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : esEdicion ? "Actualizar Vehículo" : "Crear Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
