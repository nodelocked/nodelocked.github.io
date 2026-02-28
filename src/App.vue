<script setup lang="ts">
import SiteFooter from './components/layout/SiteFooter.vue'
import SiteHeader from './components/layout/SiteHeader.vue'
</script>

<template>
  <div class="site-shell">
    <SiteHeader />

    <main class="site-main" aria-live="polite">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <SiteFooter />
  </div>
</template>
