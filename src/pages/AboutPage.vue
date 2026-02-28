<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <section class="about-page container prose-container">
    <header class="page-heading">
      <h1>{{ t('aboutTitle') }}</h1>
      <p>{{ t('aboutDescription') }}</p>
    </header>

    <section class="panel about-block">
      <h2>{{ t('aboutWho') }}</h2>
      <p>{{ t('aboutWhoText') }}</p>
    </section>

    <section class="panel about-block">
      <h2>{{ t('aboutStack') }}</h2>
      <p>{{ t('aboutStackText') }}</p>
    </section>

    <section class="panel about-block">
      <h2>{{ t('aboutContact') }}</h2>
      <p>
        Email: <a href="mailto:hello@example.com">hello@example.com</a><br />
        GitHub: <a href="https://github.com" target="_blank" rel="noreferrer">github.com</a>
      </p>
    </section>
  </section>
</template>
