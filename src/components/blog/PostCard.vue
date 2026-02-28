<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useLocale } from '../../composables/useLocale'
import type { PostMeta } from '../../types/post'

interface Props {
  post: PostMeta
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
})
const { dateLocale, t } = useLocale()

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(dateLocale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>

<template>
  <article class="post-card" :style="{ '--delay': `${props.delay}ms` }">
    <header class="post-card-header">
      <h3>
        <RouterLink :to="`/posts/${props.post.slug}`">{{ props.post.title }}</RouterLink>
      </h3>
      <time :datetime="props.post.date">{{ formatDate(props.post.date) }}</time>
    </header>

    <p>{{ props.post.summary }}</p>

    <ul v-if="props.post.tags.length > 0" class="tag-list" :aria-label="t('tagsLabel')">
      <li v-for="tag in props.post.tags" :key="tag">#{{ tag }}</li>
    </ul>
  </article>
</template>
