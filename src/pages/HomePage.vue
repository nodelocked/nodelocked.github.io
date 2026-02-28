<script setup lang="ts">
import { computed } from 'vue'
import PostCard from '../components/blog/PostCard.vue'
import { useLocale } from '../composables/useLocale'
import { usePosts } from '../lib/posts'

const { publishedPosts } = usePosts()
const { t } = useLocale()
const recentPosts = computed(() => publishedPosts.value.slice(0, 5))
</script>

<template>
  <section class="home-page container">
    <section class="hero-block">
      <p class="hero-kicker">{{ t('homeKicker') }}</p>
      <h1>{{ t('homeTitle') }}</h1>
      <p class="hero-text">{{ t('homeDescription') }}</p>
    </section>

    <section class="panel">
      <div class="section-head">
        <h2>{{ t('homeRecentPosts') }}</h2>
        <RouterLink to="/posts">{{ t('homeViewAll') }}</RouterLink>
      </div>

      <div class="post-stack">
        <PostCard
          v-for="(post, index) in recentPosts"
          :key="post.slug"
          :post="post"
          :delay="index * 40"
        />
      </div>
    </section>
  </section>
</template>
