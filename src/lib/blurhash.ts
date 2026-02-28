import { decode as blurhashDecode } from 'blurhash'

const cache = new Map<string, string>()

function toDataUrl(hash: string, width: number, height: number): string {
  if (typeof document === 'undefined') {
    return ''
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    return ''
  }

  const pixels = blurhashDecode(hash, width, height)
  const imageData = context.createImageData(width, height)
  imageData.data.set(pixels)
  context.putImageData(imageData, 0, 0)

  return canvas.toDataURL()
}

export function blurhashToDataUrl(hash: string, width = 32, height = 32): string {
  const key = `${hash}-${width}-${height}`
  const cached = cache.get(key)

  if (cached) {
    return cached
  }

  const dataUrl = toDataUrl(hash, width, height)
  if (dataUrl) {
    cache.set(key, dataUrl)
  }

  return dataUrl
}
