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

const mixColor = (base: string, amount: number, target: string): string => {
    return `color-mix(in srgb, ${base} ${amount}%, ${target})`
}

const applyComponentTokens = (mode: Theme, config: ThemePreset): void => {
    const root = document.documentElement
    const { colors, shadows } = config
    const set = (token: string, value: string) => root.style.setProperty(token, value)
    const primaryStrong = colors.primary[700] ?? colors.primary[600]
    const secondaryStrong = colors.secondary[500] ?? primaryStrong
    const baseSurface = colors.gray[0]
    const neutralBorder = colors.gray[200] ?? colors.gray[300]

    // Section surfaces
    set('--section-bg', colors.gray[50])
    set('--section-title-color', colors.primary[800] ?? colors.primary[700])
    set('--section-description-color', colors.gray[500])

    // Buttons - primary
    set('--btn-primary-bg', colors.primary[600])
    set('--btn-primary-text', '#ffffff')
    set('--btn-primary-border', colors.primary[700])
    set('--btn-primary-hover-bg', colors.primary[700])
    set('--btn-primary-hover-border', colors.primary[800] ?? colors.primary[700])

    // Buttons - secondary
    set('--btn-secondary-bg', colors.gray[0])
    set('--btn-secondary-text', colors.gray[700])
    set('--btn-secondary-border', colors.gray[300])
    set('--btn-secondary-border-b', colors.gray[400])
    set('--btn-secondary-hover-bg', colors.gray[50])

    // Buttons - status
    set('--btn-danger-bg', colors.error)
    set('--btn-danger-text', '#ffffff')
    set('--btn-danger-border', mixColor(colors.error, 85, colors.gray[900]))
    set('--btn-danger-hover-bg', mixColor(colors.error, 90, colors.gray[50]))
    set('--btn-danger-hover-border', mixColor(colors.error, 90, colors.gray[900]))

    set('--btn-success-bg', colors.success)
    set('--btn-success-text', '#ffffff')
    set('--btn-success-border', mixColor(colors.success, 85, colors.gray[900]))
    set('--btn-success-hover-bg', mixColor(colors.success, 90, colors.gray[50]))
    set('--btn-success-hover-border', mixColor(colors.success, 90, colors.gray[900]))

    // Buttons - glass
    set('--btn-glass-bg', mixColor(colors.gray[0], 60, 'transparent'))
    set('--btn-glass-border', mixColor(colors.gray[200], 60, 'transparent'))
    set('--btn-glass-text', colors.gray[800])
    set('--btn-glass-hover-border', mixColor(colors.primary[400], 90, 'transparent'))

    // Cards
    set('--card-bg', colors.gray[0])
    set('--card-border', colors.gray[200])
    set('--card-shadow', shadows.lg)
    set('--card-backdrop-bg', mixColor(colors.gray[0], 60, 'transparent'))
    set('--card-backdrop-border', mixColor(colors.gray[0], 20, 'transparent'))

    // Inputs
    set('--input-bg', colors.gray[0])
    set('--input-border', colors.gray[300])
    set('--input-text', colors.gray[900])
    set('--input-placeholder', colors.gray[400])
    set('--input-focus-ring', colors.info)
    set('--input-focus-border', colors.info)
    set('--input-label', colors.gray[700])

    // Header & footer
    set('--header-surface', mixColor(baseSurface, 88, 'transparent'))
    set('--header-border', mixColor(primaryStrong, 25, neutralBorder))
    set('--header-link', mixColor(colors.gray[900], 90, 'transparent'))
    set('--header-link-hover', secondaryStrong)

    set('--footer-surface', config.gradients.hero)
    set('--footer-border', mixColor(secondaryStrong, 25, baseSurface))
    set('--footer-text', 'rgba(255, 255, 255, 0.9)')
    set('--footer-heading', '#ffffff')
    set('--footer-link', 'rgba(255, 255, 255, 0.85)')
    set('--footer-link-hover', '#ffffff')

    // Panels / dropdowns
    set('--panel-surface', mixColor(baseSurface, 95, 'rgba(255, 255, 255, 0.9)'))
    set('--panel-border', mixColor(neutralBorder, 80, 'transparent'))
    set('--panel-shadow', '0 30px 55px -35px rgba(15, 23, 42, 0.35)')

    if (mode === Theme.DARK) {
        const deepSurface = colors.gray[1100] ?? colors.gray[900]
        const accentGlow = colors.primary[900] ?? colors.primary[800] ?? deepSurface

        set('--section-bg', mixColor(deepSurface, 78, accentGlow))
        set('--section-title-color', colors.secondary[50] ?? colors.gray[50])
        set('--section-description-color', mixColor(colors.gray[400], 85, 'transparent'))

        set('--btn-secondary-bg', colors.gray[800])
        set('--btn-secondary-text', colors.gray[200])
        set('--btn-secondary-border', colors.gray[700])
        set('--btn-secondary-border-b', colors.gray[600])
        set('--btn-secondary-hover-bg', colors.gray[700])

        set('--btn-glass-bg', mixColor(colors.gray[900], 50, 'transparent'))
        set('--btn-glass-border', mixColor(colors.gray[600], 60, 'transparent'))
        set('--btn-glass-text', colors.gray[200])

        set('--card-bg', mixColor(colors.gray[900], 85, 'rgba(8, 12, 20, 0.85)'))
        set('--card-border', mixColor(colors.gray[700], 75, 'transparent'))
        set('--card-shadow', '0 22px 50px -30px rgba(0, 0, 0, 0.7)')
        set('--card-backdrop-bg', mixColor(colors.gray[900], 60, 'rgba(8, 13, 23, 0.8)'))
        set('--card-backdrop-border', colors.gray[700])

        set('--input-bg', colors.gray[800])
        set('--input-border', colors.gray[700])
        set('--input-text', colors.gray[100])
        set('--input-placeholder', colors.gray[500])
        set('--input-label', colors.gray[300])

        set('--header-surface', mixColor(colors.gray[900], 75, 'transparent'))
        set('--header-border', mixColor(primaryStrong, 35, colors.gray[800] ?? neutralBorder))
        set('--header-link', colors.gray[50])
        set('--header-link-hover', colors.secondary[300] ?? colors.primary[300])

        set('--footer-border', mixColor(colors.gray[50], 25, colors.gray[900]))

        set('--panel-surface', mixColor(colors.gray[900], 90, 'rgba(12, 20, 32, 0.95)'))
        set('--panel-border', mixColor(primaryStrong, 30, colors.gray[800] ?? neutralBorder))
        set('--panel-shadow', '0 35px 65px -35px rgba(0, 0, 0, 0.8)')
    }
}

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

    applyComponentTokens(theme, themeConfig)

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
