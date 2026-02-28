<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'
import { usePosts } from '../lib/posts'

const route = useRoute()
const { getPostBySlug } = usePosts()
const { dateLocale, t } = useLocale()

const post = computed(() => {
  const slug = String(route.params.slug ?? '')
  return getPostBySlug(slug)
})

watchEffect(() => {
  document.title = post.value
    ? `${post.value.title} | Nodelocked`
    : `${t('postNotFoundTitle')} | Nodelocked`
})

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(dateLocale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
</script>

<template>
  <article v-if="post" class="post-detail container prose-container">
    <RouterLink class="back-link" to="/posts">← {{ t('postBackToPosts') }}</RouterLink>

    <header class="post-header">
      <h1>{{ post.title }}</h1>
      <p class="post-meta">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </p>
      <ul v-if="post.tags.length > 0" class="tag-list" :aria-label="t('tagsLabel')">
        <li v-for="tag in post.tags" :key="tag">#{{ tag }}</li>
      </ul>
    </header>

    <section class="markdown-body" v-html="post.html"></section>
  </article>

  <section v-else class="container empty-state">
    <h1>{{ t('postNotFoundTitle') }}</h1>
    <p>{{ t('postNotFoundDescription') }}</p>
    <RouterLink to="/posts">{{ t('postGoAll') }}</RouterLink>
  </section>
</template>
