import { computed, ref } from 'vue'
import { messages, type Locale, type MessageKey } from '../i18n/messages'

const STORAGE_KEY = 'site-locale'
const locale = ref<Locale>('en')
let initialized = false

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'zh'
}

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'en'
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

function applyLocale(nextLocale: Locale): void {
  document.documentElement.lang = nextLocale
}

function initializeLocale(): void {
  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true

  const stored = window.localStorage.getItem(STORAGE_KEY)
  locale.value = isLocale(stored) ? stored : detectLocale()
  applyLocale(locale.value)
}

export function useLocale() {
  initializeLocale()

  const dateLocale = computed(() => (locale.value === 'zh' ? 'zh-CN' : 'en-US'))

  function t(key: MessageKey): string {
    return messages[locale.value][key]
  }

  function setLocale(nextLocale: Locale): void {
    locale.value = nextLocale
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    applyLocale(nextLocale)
  }

  return {
    locale,
    dateLocale,
    t,
    setLocale,
  }
}
