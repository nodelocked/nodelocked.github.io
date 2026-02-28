<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PhotoWallItem from '../components/photo/PhotoWallItem.vue'
import { useLocale } from '../composables/useLocale'
import { usePhotos } from '../lib/photos'

const { t, dateLocale } = useLocale()
const { photos } = usePhotos()
const expandedPhotoId = ref<string | null>(null)

const expandedPhoto = computed(() =>
  photos.value.find((photo) => photo.id === expandedPhotoId.value),
)

function togglePhoto(photoId: string): void {
  expandedPhotoId.value = expandedPhotoId.value === photoId ? null : photoId
}

function closeExpanded(): void {
  expandedPhotoId.value = null
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeExpanded()
  }
}

watch(expandedPhotoId, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <section class="photos-page container">
    <header class="page-heading">
      <h1>{{ t('photosTitle') }}</h1>
      <p>{{ t('photosDescription') }}</p>
    </header>

    <section v-if="photos.length > 0" class="photos-grid" aria-live="polite">
      <PhotoWallItem
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
        :date-locale="dateLocale"
        :is-expanded="expandedPhotoId === photo.id"
        @toggle="togglePhoto(photo.id)"
      />
    </section>

    <section v-else class="panel photos-empty">
      <p>{{ t('photosEmpty') }}</p>
    </section>

    <section
      v-if="expandedPhoto"
      class="photo-lightbox"
      role="dialog"
      aria-modal="true"
      @click="closeExpanded"
    >
      <img
        :src="expandedPhoto.src"
        :alt="expandedPhoto.title ?? expandedPhoto.stem"
        :width="expandedPhoto.width"
        :height="expandedPhoto.height"
        @click="closeExpanded"
      />
    </section>
  </section>
</template>
