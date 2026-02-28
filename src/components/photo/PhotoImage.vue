<script setup lang="ts">
import { computed } from 'vue'
import { resolvePhoto } from '../../lib/photos'

interface Props {
  name: string
  alt?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
}

const props = withDefaults(defineProps<Props>(), {
  alt: undefined,
  loading: 'lazy',
  decoding: 'async',
})

const photo = computed(() => resolvePhoto(props.name))
const resolvedAlt = computed(() => props.alt ?? photo.value?.title ?? photo.value?.stem ?? props.name)
</script>

<template>
  <img
    v-if="photo"
    :src="photo.src"
    :alt="resolvedAlt"
    :width="photo.width"
    :height="photo.height"
    :loading="props.loading"
    :decoding="props.decoding"
  />
  <span v-else class="photo-missing">Photo not found: {{ props.name }}</span>
</template>

<style scoped>
.photo-missing {
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
