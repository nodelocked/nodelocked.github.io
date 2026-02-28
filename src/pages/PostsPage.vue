<script setup lang="ts">
import { computed, ref } from 'vue'
import PostCard from '../components/blog/PostCard.vue'
import { useLocale } from '../composables/useLocale'
import { usePosts } from '../lib/posts'

const { publishedPosts, getPostsByTag } = usePosts()
const { t } = useLocale()
const allTagValue = '__all__'

const activeTag = ref(allTagValue)

const tags = computed(() => {
  const uniqueTags = new Set<string>()

  for (const post of publishedPosts.value) {
    for (const tag of post.tags) {
      uniqueTags.add(tag)
    }
  }

  return [allTagValue, ...Array.from(uniqueTags)]
})

const visiblePosts = computed(() => {
  if (activeTag.value === allTagValue) {
    return publishedPosts.value
  }

  return getPostsByTag(activeTag.value)
})

function getTagLabel(tag: string): string {
  return tag === allTagValue ? t('postsAll') : tag
}
</script>

<template>
  <section class="posts-page container">
    <header class="page-heading">
      <h1>{{ t('postsTitle') }}</h1>
      <p>{{ t('postsDescription') }}</p>
    </header>

    <section class="panel">
      <div class="filter-bar" role="group" :aria-label="t('postsFilterLabel')">
        <button
          v-for="tag in tags"
          :key="tag"
          :class="{ active: activeTag === tag }"
          class="tag-filter"
          type="button"
          @click="activeTag = tag"
        >
          {{ getTagLabel(tag) }}
        </button>
      </div>

      <div class="post-stack">
        <PostCard v-for="post in visiblePosts" :key="post.slug" :post="post" />
      </div>
    </section>
  </section>
</template>
