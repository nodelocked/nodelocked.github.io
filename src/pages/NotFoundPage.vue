<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <section class="container empty-state">
    <p class="hero-kicker">404</p>
    <h1>{{ t('notFoundTitle') }}</h1>
    <p>{{ t('notFoundDescription') }}</p>
    <RouterLink to="/">{{ t('notFoundBackHome') }}</RouterLink>
  </section>
</template>
