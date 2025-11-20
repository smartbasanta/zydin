<script setup lang="ts">
    import {
        type LucideIcon, CheckIcon, MonitorIcon, MoonIcon, SunIcon, ChevronDownIcon
    } from 'lucide-vue-next'
    import { useTheme, Theme } from '@/composables/useTheme'
    import { useDropdown } from '@/composables/useDropdown'
import ThemeMenu from '../menu/ThemeMenu.vue'

    interface ThemeOption {
        value: Theme
        label: string
        description: string
        icon: LucideIcon
        iconClass: string
    }

    interface Props {
        variant?: 'simple' | 'dropdown' | 'segmented'
        showLabel?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        variant: 'simple',
        showLabel: false,
    })

    const {
        currentTheme,
        currentPreset,
        actualTheme,
        setTheme,
        setPreset,
        toggleTheme,
        THEMES,
        THEME_PRESETS
    } = useTheme()

    const {
        isOpen: showDropdown,
        toggle: toggleDropdown,
        close: closeDropdown,
        dropdownRef,
        triggerRef,
        onKeyDown
    } = useDropdown()

    const themeOptions: ThemeOption[] = [
        {
            value: THEMES.LIGHT,
            label: 'Light',
            description: 'Light theme',
            icon: SunIcon,
            iconClass: 'text-gray-700 dark:text-gray-300',
        },
        {
            value: THEMES.DARK,
            label: 'Dark',
            description: 'Dark theme',
            icon: MoonIcon,
            iconClass: 'text-gray-700 dark:text-gray-300',
        },
        {
            value: THEMES.SYSTEM,
            label: 'System',
            description: 'Follow system preference',
            icon: MonitorIcon,
            iconClass: 'text-gray-700 dark:text-gray-300',
        },
    ]

    const presetOptions = [
        { key: 'biotech', name: 'Biotech', description: 'Professional biotech theme' },
        { key: 'storytelling', name: 'Storytelling', description: 'Modern storytelling theme' },
        { key: 'pharmaceutical', name: 'Pharmaceutical', description: 'Professional pharmaceutical theme' },
    ]

    const getCurrentThemeLabel = (): string => {
        const option = themeOptions.find(opt => opt.value === currentTheme.value)
        return option ? option.label : 'Theme'
    }

    const getButtonTitle = (): string => {
        const themeNames: Record<string, string> = {
            [THEMES.LIGHT]: 'Light theme',
            [THEMES.DARK]: 'Dark theme',
            [THEMES.SYSTEM]: 'System theme',
        }
        return `Current: ${themeNames[currentTheme.value]} - Click to change`
    }

    const selectTheme = (theme: Theme): void => {
        setTheme(theme)
        closeDropdown()
    }

    const selectPreset = (preset: string): void => {
        setPreset(preset as any)
        closeDropdown()
    }
</script>

<template>
    <div class="relative">
        <button
            v-if="variant === 'simple'"
            @click="toggleTheme"
            class="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-1000 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:focus:ring-blue-600/80"
            :title="getButtonTitle()"
        >
            <SunIcon v-if="currentTheme === 'light'" class="w-5 h-5 text-primary-50" />
            <MoonIcon v-else-if="currentTheme === 'dark'" class="w-5 h-5 text-primary-50" />
            <MonitorIcon v-else class="w-5 h-5 text-primary-50" />
        </button>

        <div v-else-if="variant === 'segmented'" class="flex bg-gray-100/50 dark:bg-gray-600/40 rounded-lg p-1">
            <button
                v-for="option in themeOptions"
                :key="option.value"
                @click="setTheme(option.value)"
                class="cursor-pointer flex items-center justify-center p-2 rounded-md transition-all"
                :class="currentTheme === option.value
                ? 'bg-white dark:bg-gray-600/30 shadow-sm'
                : 'hover:bg-gray-50 dark:hover:bg-gray-599/30'"
                :title="option.label"
            >
                <component
                    :is="option.icon"
                    class="w-4 h-4"
                    :class="[
                        option.iconClass,
                        {
                        '!text-gray-1200 dark:!text-gray-100': currentTheme === option.value
                        }
                    ]"
                />
            </button>
        </div>

        <!-- Enhanced dropdown with both theme and preset selection -->
        <div v-else-if="variant === 'dropdown'" class="relative">
            <button
                ref="triggerRef"
                @click="toggleDropdown()"
                class="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-1000 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:focus:ring-blue-600/80"
                :title="`Current: ${getCurrentThemeLabel()} - ${currentPreset} theme - Click to change`"
            >
                <SunIcon v-if="currentTheme === 'light'" class="w-5 h-5 text-primary-50" />
                <MoonIcon v-else-if="currentTheme === 'dark'" class="w-5 h-5 text-primary-50" />
                <MonitorIcon v-else class="w-5 h-5 text-primary-50" />
            </button>

            <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div
                    v-if="showDropdown"
                    ref="dropdownRef"
                    class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    @keydown="onKeyDown"
                >
                    <!-- Theme Selection -->
                    <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Theme</h3>
                        <div class="space-y-1">
                            <button
                                v-for="option in themeOptions"
                                :key="option.value"
                                @click="selectTheme(option.value)"
                                class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': currentTheme === option.value }"
                            >
                                <component :is="option.icon" class="w-4 h-4" :class="option.iconClass" />
                                <span class="flex-1 text-left">{{ option.label }}</span>
                                <CheckIcon v-if="currentTheme === option.value" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                        </div>
                    </div>

                    <!-- Preset Selection -->
                    <div class="p-3">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Theme Preset</h3>
                        <div class="space-y-1">
                            <button
                                v-for="preset in presetOptions"
                                :key="preset.key"
                                @click="selectPreset(preset.key)"
                                class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': currentPreset === preset.key }"
                            >
                                <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                     :class="{ 'border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400': currentPreset === preset.key }">
                                </div>
                                <div class="flex-1 text-left">
                                    <div class="font-medium">{{ preset.name }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.description }}</div>
                                </div>
                                <CheckIcon v-if="currentPreset === preset.key" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <ThemeMenu v-else />
    </div>
</template>