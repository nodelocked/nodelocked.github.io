import { computed } from 'vue'
import type { PhotoAsset, PhotoSidecar } from '../types/photo'

const photoModules = import.meta.glob('../../photos/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const sidecarModules = import.meta.glob('../../photos/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, PhotoSidecar>

function getFileName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1] ?? path
}

function getStem(fileName: string): string {
  return fileName.replace(/\.[^.]+$/i, '')
}

function toNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return undefined
  }

  return value
}

function toDateValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

function toSortValue(date?: string): number {
  if (!date) {
    return 0
  }

  const timestamp = new Date(date).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function normalizeLookup(input: string): string {
  return decodeURIComponent(input.trim())
    .replace(/^photo:/i, '')
    .replace(/^\/photos\//i, '')
}

const photosSource: PhotoAsset[] = Object.entries(photoModules)
  .map(([photoPath, src]) => {
    const filename = getFileName(photoPath)
    const stem = getStem(filename)
    const sidecarPath = photoPath.replace(/\.[^.]+$/i, '.json')
    const sidecar = sidecarModules[sidecarPath] ?? {}

    const width = toNumber(sidecar.width)
    const height = toNumber(sidecar.height)

    return {
      id: stem,
      filename,
      stem,
      src,
      title: typeof sidecar.text === 'string' ? sidecar.text : undefined,
      blurhash: typeof sidecar.blurhash === 'string' ? sidecar.blurhash : undefined,
      date: toDateValue(sidecar.date),
      width,
      height,
      aspectRatio: width && height ? width / height : undefined,
    }
  })
  .sort((a, b) => {
    const dateDiff = toSortValue(b.date) - toSortValue(a.date)

    if (dateDiff !== 0) {
      return dateDiff
    }

    return b.filename.localeCompare(a.filename)
  })

const photoByFilename = new Map<string, PhotoAsset>()
const photoByStem = new Map<string, PhotoAsset>()

for (const photo of photosSource) {
  photoByFilename.set(photo.filename.toLowerCase(), photo)
  photoByStem.set(photo.stem.toLowerCase(), photo)
}

export function resolvePhoto(input: string): PhotoAsset | undefined {
  const normalized = normalizeLookup(input)
  const fileName = getFileName(normalized).toLowerCase()
  const stem = getStem(fileName)

  return photoByFilename.get(fileName) ?? photoByStem.get(stem)
}

export function resolvePhotoSource(input: string): string | undefined {
  return resolvePhoto(input)?.src
}

export function usePhotos() {
  const photos = computed(() => photosSource)

  function getPhotoByName(name: string): PhotoAsset | undefined {
    return resolvePhoto(name)
  }

  return {
    photos,
    getPhotoByName,
  }
}
