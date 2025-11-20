<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { themePresets } from '@/config/themes';
import { MonitorIcon, SunIcon, MoonIcon, PaletteIcon } from 'lucide-vue-next';

const { currentTheme, currentPreset, setTheme, setPreset, THEMES, THEME_PRESETS } = useTheme();

const isOpen = ref(false);
const showThemeSelector = ref(false);

const themeOptions = [
  { value: THEMES.LIGHT, label: 'Light', icon: SunIcon },
  { value: THEMES.DARK, label: 'Dark', icon: MoonIcon },
  { value: THEMES.SYSTEM, label: 'System', icon: MonitorIcon },
];

const currentThemeOption = computed(() => {
  return themeOptions.find(option => option.value === currentTheme.value);
});

const currentPresetInfo = computed(() => {
  return THEME_PRESETS[currentPreset.value];
});

const selectTheme = (theme: typeof THEMES[keyof typeof THEMES]) => {
  setTheme(theme);
  isOpen.value = false;
};

const selectPreset = (preset: keyof typeof THEME_PRESETS) => {
  setPreset(preset);
  showThemeSelector.value = false;
  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) {
    showThemeSelector.value = false;
  }
};

const showPresetSelector = () => {
  showThemeSelector.value = true;
};

const backToThemeSelector = () => {
  showThemeSelector.value = false;
};
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="header-menu-trigger"
      :class="{ 'active': isOpen }"
      aria-label="Toggle theme menu"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <component :is="currentThemeOption?.icon" class="w-5 h-5" />
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
        v-if="isOpen"
        class="menu-dropdown-panel"
        role="menu"
        tabindex="-1"
      >
        <div class="p-1" role="none">
          <!-- Theme Selector -->
          <div v-if="!showThemeSelector">
            <div class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
              Theme
            </div>
            <button
              v-for="option in themeOptions"
              :key="option.value"
              @click="selectTheme(option.value)"
              class="menu-dropdown-item rounded-lg"
              :class="{ 'active': currentTheme === option.value }"
              role="menuitem"
            >
              <component :is="option.icon" class="w-5 h-5" />
              <span class="flex-1">{{ option.label }}</span>
              <div v-if="currentTheme === option.value" class="w-2 h-2 bg-current rounded-full"></div>
            </button>

            <div class="border-t border-gray-200 dark:border-gray-700 mt-1">
              <div class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                Style
              </div>
              <button
                @click="showPresetSelector"
                class="menu-dropdown-item rounded-lg"
                role="menuitem"
              >
                <PaletteIcon class="w-5 h-5" />
                <span class="flex-1">{{ currentPresetInfo.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ currentPresetInfo.description }}</span>
              </button>
            </div>
          </div>

          <!-- Preset Selector -->
          <div v-else>
            <div class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <button @click="backToThemeSelector" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                ←
              </button>
              Choose Style
            </div>
            <button
              v-for="(preset, key) in THEME_PRESETS"
              :key="key"
              @click="selectPreset(key)"
              class="menu-dropdown-item rounded-lg"
              :class="{ 'active': currentPreset === key }"
              role="menuitem"
            >
              <div class="flex-1 text-left">
                <div class="font-medium">{{ preset.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.description }}</div>
              </div>
              <div v-if="currentPreset === key" class="w-2 h-2 bg-current rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
