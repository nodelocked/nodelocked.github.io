import { computed, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'site-theme-mode'
const modes: ThemeMode[] = ['light', 'dark', 'system']
const mode = ref<ThemeMode>('system')
const systemPrefersDark = ref(false)
let initialized = false

function isThemeMode(value: string | null): value is ThemeMode {
  return value !== null && modes.includes(value as ThemeMode)
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

function resolveTheme(currentMode: ThemeMode): 'light' | 'dark' {
  if (currentMode === 'system') {
    return systemPrefersDark.value ? 'dark' : 'light'
  }

  return currentMode
}

function initializeTheme(): void {
  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = media.matches

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isThemeMode(stored)) {
    mode.value = stored
  }

  applyTheme(resolveTheme(mode.value))

  media.addEventListener('change', (event) => {
    systemPrefersDark.value = event.matches

    if (mode.value === 'system') {
      applyTheme(resolveTheme('system'))
    }
  })
}

export function useTheme() {
  initializeTheme()

  const resolvedMode = computed(() => resolveTheme(mode.value))

  function setMode(nextMode: ThemeMode): void {
    mode.value = nextMode
    window.localStorage.setItem(STORAGE_KEY, nextMode)
    applyTheme(resolveTheme(nextMode))
  }

  return {
    mode,
    resolvedMode,
    setMode,
  }
}
