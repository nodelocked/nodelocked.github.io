import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { encode as blurhashEncode } from 'blurhash'
import ExifReader from 'exifreader'
import fg from 'fast-glob'
import sharp from 'sharp'

const folder = fileURLToPath(new URL('../photos', import.meta.url))
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']

async function listImages() {
  return (await fg('**/*.{jpg,png,jpeg}', {
    caseSensitiveMatch: false,
    absolute: true,
    cwd: folder,
  })).sort((a, b) => a.localeCompare(b))
}

function normalizeExt(ext) {
  const normalized = ext.toLowerCase()
  if (normalized === '.jpeg') {
    return '.jpg'
  }
  return normalized
}

function sanitizeTitle(value) {
  if (!value) return undefined

  if (Array.isArray(value)) {
    return String(value[0] ?? '').trim() || undefined
  }

  if (typeof value === 'object') {
    if ('description' in value && typeof value.description === 'string') {
      return value.description.trim() || undefined
    }

    if ('value' in value) {
      return sanitizeTitle(value.value)
    }
  }

  return String(value).trim() || undefined
}

function normalizeDateString(value) {
  if (!value) return ''

  const source = Array.isArray(value) ? String(value[0] ?? '') : String(value)

  return source.replace(/:/g, (char, index) => {
    if (index < 10) {
      return '-'
    }

    return char
  })
}

function parseDateFromName(filename) {
  const match = filename.match(
    /^p-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{3})-\d+\.[a-z]+$/i,
  )

  if (!match) {
    return undefined
  }

  const [, year, month, day, hour, minute, second, milli] = match
  const parsed = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.${milli}Z`)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed
}

async function getPhotoDate(filepath, exif) {
  let dateRaw = exif.DateTimeOriginal?.value || exif.DateTime?.value || exif.DateCreated?.value

  if (!dateRaw) {
    const stat = await fs.stat(filepath)
    dateRaw = stat.birthtime || stat.mtime
  }

  const normalized = normalizeDateString(dateRaw)
  let date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    date = new Date()
  }

  return date
}

async function compressImage(buffer, ext) {
  const pipeline = sharp(buffer).rotate()

  if (ext === '.png') {
    return pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        quality: 82,
      })
      .toBuffer()
  }

  return pipeline
    .jpeg({
      quality: 82,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
    })
    .toBuffer()
}

function getUniqueOutputPath(base, ext) {
  let index = 1
  let output = path.join(folder, `${base}${index}${ext}`.toLowerCase())

  while (existsSync(output)) {
    index += 1
    output = path.join(folder, `${base}${index}${ext}`.toLowerCase())
  }

  return output
}

async function readJson(filepath) {
  if (!existsSync(filepath)) {
    return {}
  }

  try {
    return JSON.parse(await fs.readFile(filepath, 'utf-8'))
  } catch {
    return {}
  }
}

async function writeJson(filepath, data) {
  await fs.writeFile(filepath, `${JSON.stringify(data, null, 2)}\n`)
}

function sidecarPath(filepath) {
  return filepath.replace(/\.[^.]+$/, '.json')
}

async function ensureSidecar(filepath, patch) {
  const target = sidecarPath(filepath)
  const current = await readJson(target)
  const next = { ...current, ...patch }
  await writeJson(target, next)
}

await fs.mkdir(folder, { recursive: true })

let files = await listImages()
let processed = 0
let renamed = 0
let skipped = 0

for (const filepath of files) {
  const filename = path.basename(filepath)

  if (filename.startsWith('p-')) {
    continue
  }

  const ext = normalizeExt(path.extname(filename))
  const buffer = await fs.readFile(filepath)
  let exif = {}
  try {
    exif = await Promise.resolve(ExifReader.load(buffer))
  } catch {
    exif = {}
  }

  const title = sanitizeTitle(exif.ImageDescription)
  const date = await getPhotoDate(filepath, exif)

  if (Date.now() - date.getTime() < 1000 * 60 * 60) {
    console.warn(`[photos] Date of ${filename} is too recent, skip for now.`)
    skipped += 1
    continue
  }

  const base = `p-${date.toISOString().replace(/[:.a-z]+/gi, '-')}`
  const outputPath = getUniqueOutputPath(base, ext)

  const compressed = await compressImage(buffer, ext)
  const outputBuffer = compressed.length <= buffer.length ? compressed : buffer

  await fs.writeFile(outputPath, outputBuffer)
  await fs.unlink(filepath)

  const metadata = await sharp(outputBuffer).metadata()
  await ensureSidecar(outputPath, {
    text: title,
    date: date.toISOString(),
    width: metadata.width,
    height: metadata.height,
  })

  processed += 1
  renamed += 1
}

files = await listImages()
let hashed = 0

for (const filepath of files) {
  const filename = path.basename(filepath)

  if (!filename.startsWith('p-')) {
    continue
  }

  const configFile = sidecarPath(filepath)
  const config = await readJson(configFile)

  const buffer = await fs.readFile(filepath)
  const image = sharp(buffer)
  const meta = await image.metadata()

  if (!config.width && meta.width) {
    config.width = meta.width
  }

  if (!config.height && meta.height) {
    config.height = meta.height
  }

  if (!config.date) {
    const parsed = parseDateFromName(filename)
    config.date = parsed
      ? parsed.toISOString()
      : new Date(await fs.stat(filepath).then((stat) => stat.mtime)).toISOString()
  }

  if (!config.blurhash) {
    const { data, info } = await image
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'cover' })
      .toBuffer({ resolveWithObject: true })

    config.blurhash = blurhashEncode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
    hashed += 1
  }

  await writeJson(configFile, config)
}

for (const jsonFile of await fg('**/*.json', {
  caseSensitiveMatch: false,
  absolute: true,
  cwd: folder,
})) {
  const stem = jsonFile.replace(/\.json$/i, '')
  const hasImage = IMAGE_EXTENSIONS.some((ext) => existsSync(`${stem}${ext}`))

  if (!hasImage) {
    await fs.unlink(jsonFile)
  }
}

console.log(
  `[photos] done. processed=${processed}, renamed=${renamed}, blurhash=${hashed}, skipped=${skipped}`,
)
