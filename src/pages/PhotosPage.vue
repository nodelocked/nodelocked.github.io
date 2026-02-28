<script setup lang="ts">
import PhotoWallItem from '../components/photo/PhotoWallItem.vue'
import { useLocale } from '../composables/useLocale'
import { usePhotos } from '../lib/photos'

const { t, dateLocale } = useLocale()
const { photos } = usePhotos()
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
      />
    </section>

    <section v-else class="panel photos-empty">
      <p>{{ t('photosEmpty') }}</p>
    </section>
  </section>
</template>
