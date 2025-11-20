<script setup lang="ts">
    import {
        type LucideIcon, CheckIcon, MonitorIcon, MoonIcon, SunIcon
    } from 'lucide-vue-next'
    import { useTheme, Theme } from '@/composables/useTheme'
    import { useDropdown } from '@/composables/useDropdown'

    interface ThemeOption {
        value: Theme
        label: string
        icon: LucideIcon
    }

    const { currentTheme, setTheme, THEMES } = useTheme()

    const {
        isOpen: showDropdown,
        toggle: toggleDropdown,
        close: closeDropdown,
        dropdownRef,
        triggerRef,
        onKeyDown
    } = useDropdown()

    const themeOptions: ThemeOption[] = [
        { value: THEMES.LIGHT, label: 'Light', icon: SunIcon },
        { value: THEMES.DARK, label: 'Dark', icon: MoonIcon },
        { value: THEMES.SYSTEM, label: 'System', icon: MonitorIcon },
    ]

    const selectTheme = (theme: Theme): void => {
        setTheme(theme)
        closeDropdown()
    }
</script>

<template>
    <div class="relative" @keydown="onKeyDown">
        <!-- Trigger Button -->
        <button
            ref="triggerRef"
            @click="toggleDropdown()"
            class="header-menu-trigger hover:bg-white/10 focus:bg-white/10 transition-colors"
            :class="{ 'active': showDropdown }"
            aria-label="Toggle theme menu"
            aria-haspopup="true"
            :aria-expanded="showDropdown"
        >
            <SunIcon v-if="currentTheme === 'light'" class="w-5 h-5 text-white" />
            <MoonIcon v-else-if="currentTheme === 'dark'" class="w-5 h-5 text-white" />
            <MonitorIcon v-else class="w-5 h-5 text-white" />
        </button>

        <!-- Dropdown Panel -->
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
                class="menu-dropdown-panel"
                role="menu"
                tabindex="-1"
            >
                <div class="p-1" role="none">
                    <button
                        v-for="option in themeOptions"
                        :key="option.value"
                        @click="selectTheme(option.value)"
                        class="menu-dropdown-item rounded-lg"
                        :class="{ 'active': currentTheme === option.value }"
                        role="menuitem"
                        data-dropdown-item="true"
                    >
                        <component :is="option.icon" class="w-5 h-5" />
                        <span class="flex-1">{{ option.label }}</span>
                        <CheckIcon v-if="currentTheme === option.value" class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>