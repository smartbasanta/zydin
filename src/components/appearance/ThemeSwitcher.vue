<script setup lang="ts">
import { type LucideIcon, CheckIcon, MonitorIcon, MoonIcon, SunIcon, ChevronDownIcon, PaletteIcon, LayoutTemplateIcon } from 'lucide-vue-next';
import { useTheme, Theme } from '@/composables/useTheme';
import Dropdown from '@/components/menu/Dropdown.vue'; // Using the unified Dropdown component

interface ThemeOption {
    value: Theme;
    label: string;
    icon: LucideIcon;
}

interface Props {
    variant?: 'simple' | 'dropdown' | 'segmented';
    showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'simple',
    showLabel: false,
});

const {
    currentTheme,
    currentPreset,
    setTheme,
    setPreset,
    toggleTheme,
    THEMES,
} = useTheme();

const themeOptions: ThemeOption[] = [
    { value: THEMES.LIGHT, label: 'Light', icon: SunIcon },
    { value: THEMES.DARK, label: 'Dark', icon: MoonIcon },
    { value: THEMES.SYSTEM, label: 'System', icon: MonitorIcon },
];

const presetOptions = [
    { key: 'biotech', name: 'Biotech' },
    { key: 'storytelling', name: 'Storytelling' },
    { key: 'pharmaceutical', name: 'Pharmaceutical' },
];

const getCurrentThemeIcon = () => {
    switch (currentTheme.value) {
        case THEMES.LIGHT: return SunIcon;
        case THEMES.DARK: return MoonIcon;
        case THEMES.SYSTEM: return MonitorIcon;
        default: return MonitorIcon;
    }
};
</script>

<template>
    <div class="relative flex items-center">
        
        <!-- Simple Toggle Variant -->
        <button
            v-if="variant === 'simple'"
            @click="toggleTheme"
            class="header-menu-trigger"
            title="Toggle Theme"
        >
            <component :is="getCurrentThemeIcon()" class="w-5 h-5" />
        </button>

        <!-- Segmented Control Variant -->
        <div v-else-if="variant === 'segmented'" class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
                v-for="option in themeOptions"
                :key="option.value"
                @click="setTheme(option.value)"
                class="p-1.5 rounded-md transition-all duration-200 flex items-center justify-center"
                :class="currentTheme === option.value 
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
                :title="option.label"
            >
                <component :is="option.icon" class="w-4 h-4" />
            </button>
        </div>

        <!-- Enhanced Dropdown Variant -->
        <Dropdown v-else-if="variant === 'dropdown'" placement="bottom-end" menuClass="menu-dropdown-panel w-64">
            <template #trigger="{ toggle }">
                <button
                    @click="toggle()"
                    class="header-menu-trigger"
                    :title="`Theme: ${currentTheme} | Preset: ${currentPreset}`"
                >
                    <component :is="getCurrentThemeIcon()" class="w-5 h-5" />
                </button>
            </template>

            <template #menu="{ close }">
                <div class="divide-y divide-border-color section-title">
                    
                    <!-- Mode Selection -->
                    <div class="p-2">
                        <div class="px-2 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                            <PaletteIcon class="w-3.5 h-3.5" /> Mode
                        </div>
                        <div class="space-y-1">
                            <button
                                v-for="option in themeOptions"
                                :key="option.value"
                                @click="setTheme(option.value); close(true)"
                                class="menu-dropdown-item"
                                :class="{ 'active': currentTheme === option.value }"
                            >
                                <component :is="option.icon" class="w-4 h-4" />
                                <span class="flex-1">{{ option.label }}</span>
                                <CheckIcon v-if="currentTheme === option.value" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Preset Selection -->
                    <div class="p-2">
                        <div class="px-2 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                            <LayoutTemplateIcon class="w-3.5 h-3.5" /> Theme Preset
                        </div>
                        <div class="space-y-1">
                            <button
                                v-for="preset in presetOptions"
                                :key="preset.key"
                                @click="setPreset(preset.key as any); close(true)"
                                class="menu-dropdown-item"
                                :class="{ 'active': currentPreset === preset.key }"
                            >
                                <span class="flex-1">{{ preset.name }}</span>
                                <CheckIcon v-if="currentPreset === preset.key" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </template>
        </Dropdown>

    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

</style>