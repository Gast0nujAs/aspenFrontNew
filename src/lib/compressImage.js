/**
 * Redimensiona y comprime una imagen en el navegador antes de subirla.
 * Una foto de celular de 4-8 MB queda en ~300-500 KB sin pérdida visible.
 */

const TIMEOUT_MS = 8000

export const compressImage = (file, maxWidth = 1920, quality = 0.8) =>
  new Promise((resolve) => {
    if (!file || !file.type?.startsWith("image/") || file.type === "image/gif") return resolve(file)

    let done = false
    const finish = (result) => {
      if (done) return
      done = true
      clearTimeout(timer)
      URL.revokeObjectURL(objectUrl)
      resolve(result)
    }
    const objectUrl = URL.createObjectURL(file)
    const timer = setTimeout(() => finish(file), TIMEOUT_MS)
    const img = new Image()
     img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) return finish(file)
            const name = file.name.replace(/\.\w+$/, "") + ".jpg"
            finish(new File([blob], name, { type: "image/jpeg" }))
          },
          "image/jpeg",
          quality,
        )
      } catch {
        finish(file)
      }
    }

    img.onerror = () => finish(file)
    img.src = objectUrl
  })

export const compressImages = async (files, maxWidth, quality) => {
  const list = Array.from(files || [])
  try {
    return await Promise.all(list.map((f) => compressImage(f, maxWidth, quality)))
  } catch {
    return list
  }
}