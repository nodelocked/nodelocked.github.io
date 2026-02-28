<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>{{ t('footerBuiltWith') }}</p>
      <p>© {{ new Date().getFullYear() }} Nodelocked</p>
    </div>
  </footer>
</template>
