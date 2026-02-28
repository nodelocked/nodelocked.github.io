export interface PhotoSidecar {
  text?: string
  blurhash?: string
  date?: string
  width?: number
  height?: number
}

export interface PhotoAsset {
  id: string
  filename: string
  stem: string
  src: string
  title?: string
  blurhash?: string
  date?: string
  width?: number
  height?: number
  aspectRatio?: number
}
