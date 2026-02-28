# nodelocked.github.io

A Vue 3 + Vite personal site with blog, bilingual UI, and a photo wall.

## Development

```bash
pnpm install
pnpm dev
```

## Photo pipeline

1. Put original images into `./photos` (project root).
2. Run:

```bash
pnpm photos
```

What `pnpm photos` does:

- normalizes file names to `p-<timestamp>-<index>.<ext>`
- compresses and rotates images based on EXIF
- writes/updates sidecar JSON metadata (`text`, `date`, `width`, `height`, `blurhash`)
- cleans orphan JSON files

Pre-commit hook is configured to run `pnpm photos` automatically before each commit.

## Reuse photos across the site

### In Markdown posts

Use the `photo:` source protocol:

```md
![A sunset](photo:p-2026-02-28-11-23-30-120-1.jpg)
```

The post renderer resolves this to the optimized photo asset URL automatically.

### In Vue components

Use `PhotoImage`:

```vue
<script setup lang="ts">
import PhotoImage from '../components/photo/PhotoImage.vue'
</script>

<template>
  <PhotoImage name="p-2026-02-28-11-23-30-120-1.jpg" alt="A sunset" />
</template>
```

Or use `usePhotos`/`resolvePhoto` from `src/lib/photos.ts` for custom logic.

## Build

```bash
pnpm build
pnpm preview
```
