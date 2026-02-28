<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Locale } from '../../i18n/messages'
import { useTheme, type ThemeMode } from '../../composables/useTheme'
import { useLocale } from '../../composables/useLocale'

const { mode, setMode } = useTheme()
const { locale, setLocale, t } = useLocale()

const themeModes: ThemeMode[] = ['light', 'dark', 'system']
const locales: Locale[] = ['zh', 'en']

function getThemeLabel(themeMode: ThemeMode): string {
  if (themeMode === 'light') {
    return t('themeLight')
  }

  if (themeMode === 'dark') {
    return t('themeDark')
  }

  return t('themeSystem')
}
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink class="brand" to="/">Nodelocked</RouterLink>

      <nav class="nav-links" :aria-label="t('navPrimaryLabel')">
        <RouterLink to="/">{{ t('navHome') }}</RouterLink>
        <RouterLink to="/posts">{{ t('navPosts') }}</RouterLink>
        <RouterLink to="/photos">{{ t('navPhotos') }}</RouterLink>
        <RouterLink to="/about">{{ t('navAbout') }}</RouterLink>
      </nav>

      <div class="header-controls">
        <div class="lang-switch" role="group" :aria-label="t('languageLabel')">
          <button
            v-for="lang in locales"
            :key="lang"
            :aria-pressed="locale === lang"
            :class="{ active: locale === lang }"
            class="lang-button"
            type="button"
            @click="setLocale(lang)"
          >
            {{ lang.toUpperCase() }}
          </button>
        </div>

        <div class="theme-switch" role="group" :aria-label="t('themeLabel')">
          <button
            v-for="themeMode in themeModes"
            :key="themeMode"
            :aria-pressed="mode === themeMode"
            :class="{ active: mode === themeMode }"
            class="theme-button"
            type="button"
            @click="setMode(themeMode)"
          >
            {{ getThemeLabel(themeMode) }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
