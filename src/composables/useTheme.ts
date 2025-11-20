import { ref, computed, watch, onMounted } from 'vue'
import { themePresets, type ThemePreset, type ThemePresetKey } from '@/config/themes'

const THEME_KEY: string = 'zydinBiotech_theme'
const THEME_PRESET_KEY: string = 'zydinBiotech_theme_preset'

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system',
}

interface ThemeInfo {
    current: string
    actual: string
    isDark: boolean
    isLight: boolean
    isSystem: boolean
    preset: ThemePresetKey
    themeConfig: ThemePreset
}

const currentTheme = ref<Theme>(Theme.SYSTEM)
const currentPreset = ref<ThemePresetKey>('biotech')
const systemPrefersDark = ref<boolean>(false)

const actualTheme = computed<Theme>(() => {
    if (currentTheme.value === Theme.SYSTEM) {
        return systemPrefersDark.value ? Theme.DARK : Theme.LIGHT
    }
    return currentTheme.value
})

const currentThemeConfig = computed<ThemePreset>(() => {
    return themePresets[currentPreset.value]
})

const applyTheme = (theme: Theme, preset: ThemePresetKey): void => {
    const html = document.documentElement
    const themeConfig = themePresets[preset]

    // Apply dark/light class
    if (theme === Theme.DARK) {
        html.classList.add('dark')
    } else {
        html.classList.remove('dark')
    }

    // Apply theme preset class
    // Remove all theme classes first
    Object.keys(themePresets).forEach(presetKey => {
        html.classList.remove(`theme-${presetKey}`)
    })
    // Add current theme class
    html.classList.add(`theme-${preset}`)

    // Update CSS custom properties
    const root = document.documentElement
    const colors = themeConfig.colors

    // Primary colors
    Object.entries(colors.primary).forEach(([key, value]) => {
        root.style.setProperty(`--color-primary-${key}`, value)
    })

    // Secondary colors
    Object.entries(colors.secondary).forEach(([key, value]) => {
        root.style.setProperty(`--color-secondary-${key}`, value)
    })

    // Accent colors
    Object.entries(colors.accent).forEach(([key, value]) => {
        root.style.setProperty(`--color-accent-${key}`, value)
    })

    // Gray colors
    Object.entries(colors.gray).forEach(([key, value]) => {
        root.style.setProperty(`--color-gray-${key}`, value)
    })

    // Semantic colors
    root.style.setProperty('--color-success', colors.success)
    root.style.setProperty('--color-warning', colors.warning)
    root.style.setProperty('--color-error', colors.error)
    root.style.setProperty('--color-info', colors.info)

    // Gradients
    Object.entries(themeConfig.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--gradient-${key}`, value)
    })

    // Typography
    Object.entries(themeConfig.typography.fontFamily).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, value)
    })

    // Spacing
    Object.entries(themeConfig.spacing.container).forEach(([key, value]) => {
        root.style.setProperty(`--container-${key}`, value)
    })

    // Shadows
    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value)
    })

    // Border radius
    Object.entries(themeConfig.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value)
    })

    // Animations
    Object.entries(themeConfig.animations.duration).forEach(([key, value]) => {
        root.style.setProperty(`--duration-${key}`, value)
    })
    Object.entries(themeConfig.animations.easing).forEach(([key, value]) => {
        root.style.setProperty(`--easing-${key}`, value)
    })

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
        const themeColor = theme === Theme.DARK ? colors.gray[900] : colors.primary[50]
        metaThemeColor.setAttribute('content', themeColor)
    }
}

const saveTheme = (theme: Theme): void => {
    try {
        localStorage.setItem(THEME_KEY, theme)
    } catch (error) {
        console.warn('Failed to save theme preference:', error)
    }
}

const savePreset = (preset: ThemePresetKey): void => {
    try {
        localStorage.setItem(THEME_PRESET_KEY, preset)
    } catch (error) {
        console.warn('Failed to save theme preset preference:', error)
    }
}

const loadTheme = (): Theme => {
    try {
        const saved = localStorage.getItem(THEME_KEY)
        if (saved && Object.values(Theme).includes(saved as Theme)) {
            return saved as Theme
        }
    } catch (error) {
        console.warn('Failed to load theme preference:', error)
    }
    return Theme.SYSTEM
}

const loadPreset = (): ThemePresetKey => {
    try {
        const saved = localStorage.getItem(THEME_PRESET_KEY)
        if (saved && saved in themePresets) {
            return saved as ThemePresetKey
        }
    } catch (error) {
        console.warn('Failed to load theme preset preference:', error)
    }
    return 'biotech'
}

const initSystemThemeListener = (): (() => void) => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        systemPrefersDark.value = mediaQuery.matches

        const handleChange = (e: MediaQueryListEvent): void => {
            systemPrefersDark.value = e.matches
        }

        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }
    return () => {}
}

export function useTheme() {
    const setTheme = (theme: Theme): void => {
        if (Object.values(Theme).includes(theme)) {
            currentTheme.value = theme
            saveTheme(theme)
        }
    }

    const setPreset = (preset: ThemePresetKey): void => {
        if (preset in themePresets) {
            currentPreset.value = preset
            savePreset(preset)
        }
    }

    const toggleTheme = (): void => {
        const themes = [Theme.LIGHT, Theme.DARK, Theme.SYSTEM]
        const currentIndex = themes.indexOf(currentTheme.value)
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
    }

    const setLightTheme = (): void => setTheme(Theme.LIGHT)
    const setDarkTheme = (): void => setTheme(Theme.DARK)
    const setSystemTheme = (): void => setTheme(Theme.SYSTEM)

    // Get theme info
    const getThemeInfo = (): ThemeInfo => ({
        current: currentTheme.value,
        actual: actualTheme.value,
        isDark: actualTheme.value === Theme.DARK,
        isLight: actualTheme.value === Theme.LIGHT,
        isSystem: currentTheme.value === Theme.SYSTEM,
        preset: currentPreset.value,
        themeConfig: currentThemeConfig.value,
    })

    const initTheme = (): (() => void) => {
        currentTheme.value = loadTheme()
        currentPreset.value = loadPreset()

        const cleanup = initSystemThemeListener()

        applyTheme(actualTheme.value, currentPreset.value)

        const stopWatcher = watch([actualTheme, currentPreset], ([newTheme, newPreset]) => {
            applyTheme(newTheme, newPreset)
        }, { immediate: true })

        return () => {
            cleanup()
            stopWatcher()
        }
    }

    return {
        // State
        currentTheme: computed(() => currentTheme.value),
        currentPreset: computed(() => currentPreset.value),
        actualTheme,
        systemPrefersDark: computed(() => systemPrefersDark.value),
        themeConfig: currentThemeConfig,

        // Actions
        setTheme,
        setPreset,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        setSystemTheme,

        // Utils
        getThemeInfo,
        initTheme,

        // Constants
        THEMES: Theme,
        THEME_PRESETS: themePresets,
    }
}
