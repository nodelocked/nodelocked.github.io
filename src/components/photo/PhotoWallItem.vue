<script setup lang="ts">
import { computed, ref } from 'vue'
import { blurhashToDataUrl } from '../../lib/blurhash'
import type { PhotoAsset } from '../../types/photo'

interface Props {
  photo: PhotoAsset
  dateLocale: string
}

const props = defineProps<Props>()

const loaded = ref(false)

const previewDataUrl = computed(() => {
  if (!props.photo.blurhash) {
    return ''
  }

  return blurhashToDataUrl(props.photo.blurhash, 32, 32)
})

const frameStyle = computed(() => {
  if (!props.photo.aspectRatio) {
    return {}
  }

  return {
    aspectRatio: String(props.photo.aspectRatio),
  }
})

const title = computed(() => props.photo.title ?? props.photo.stem)

const formattedDate = computed(() => {
  if (!props.photo.date) {
    return ''
  }

  return new Intl.DateTimeFormat(props.dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(props.photo.date))
})

function onLoad() {
  loaded.value = true
}
</script>

<template>
  <figure class="photo-tile">
    <a class="photo-frame" :href="props.photo.src" target="_blank" rel="noreferrer" :style="frameStyle">
      <div
        v-if="previewDataUrl"
        class="photo-placeholder"
        :style="{ backgroundImage: `url(${previewDataUrl})`, opacity: loaded ? 0 : 1 }"
      ></div>
      <img
        :src="props.photo.src"
        :alt="title"
        :width="props.photo.width"
        :height="props.photo.height"
        loading="lazy"
        decoding="async"
        :class="{ loaded }"
        @load="onLoad"
      />
    </a>

    <figcaption>
      <span class="photo-title">{{ title }}</span>
      <time v-if="formattedDate" :datetime="props.photo.date">{{ formattedDate }}</time>
    </figcaption>
  </figure>
</template>
