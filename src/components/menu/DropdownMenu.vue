<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ChevronDownIcon, CheckIcon } from 'lucide-vue-next';
import { useDropdown } from '@/composables/useDropdown';

import type { DropdownParent } from '@/types/dropdownLinkRelated';

defineProps<{
    item: DropdownParent;
}>();
const route = useRoute();


const { isOpen, toggle, close, dropdownRef, triggerRef, onKeyDown } = useDropdown();
let isTouchEvent = false;

const handleTouchStart = () => {
    isTouchEvent = true;
};

const handleMouseEnter = () => {
    // If a touch event was just registered, ignore this emulated mouseenter event.
    if (isTouchEvent) {
        isTouchEvent = false; // Reset the flag
        return;
    }
    // For genuine mouse hover, open the dropdown.
    isOpen.value = true;
};

const handleMouseLeave = () => {
    close(false);
};
</script>

<template>
    <div class="relative py-2 font-bold section-title" @touchstart="handleTouchStart" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @keydown="onKeyDown">
        <RouterLink v-if="!item.children" :to="item.path" class="nav-link" exact-active-class="nav-link-active">
            {{ item.name }}
        </RouterLink>

        <button v-else ref="triggerRef" @click="toggle();" class="nav-link flex items-center gap-1"
            :class="{ 'nav-link-active': item.children?.some(child => route.path === child.path) }" aria-haspopup="true"
            :aria-expanded="isOpen">
            <span>{{ item.name }}</span>
            <ChevronDownIcon class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }" />
        </button>

        <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="item.children && isOpen" ref="dropdownRef"
                class="menu-dropdown-panel nav-menu-panel"
                role="menu" tabindex="-1">
                <div class="p-1">
                    <RouterLink v-for="child in item.children" :key="child.name" :to="child.path" custom v-slot="{ isActive, isExactActive, navigate }">
                        <a @click="navigate(); close(true)"
                            class="menu-dropdown-item rounded-lg"
                            :class="{ 'active': isExactActive }"
                            role="menuitem" data-dropdown-item="true">
                            <span class="flex-1">{{ child.name }}</span>
                            <CheckIcon v-if="isExactActive" class="w-4 h-4" />
                        </a>
                    </RouterLink>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.nav-link {
    @apply transition-all duration-300 hover:scale-105 active:scale-95;
    @apply px-3 py-2 rounded-lg;
    @apply border border-transparent;
    @apply font-medium;
    
    /* Theme-aware colors using CSS custom properties */
    background-color: transparent;
    border-color: transparent;
    color: var(--color-gray-700, #374151);
    
    /* Hover states */
    &:hover {
        background-color: color-mix(in srgb, var(--color-primary-50, #eff6ff) 60%, transparent);
        border-color: color-mix(in srgb, var(--color-primary-200, #bfdbfe) 70%, transparent);
        color: var(--color-primary-700, #1d4ed8);
        box-shadow: 0 1px 3px 0 color-mix(in srgb, var(--color-primary-200, #bfdbfe) 30%, transparent);
        transform: translateY(-1px);
    }
    
    /* Dark theme overrides */
    .dark & {
        color: var(--color-gray-300, #d1d5db);
        
        &:hover {
            background-color: color-mix(in srgb, var(--color-primary-900, #1e3a8a) 20%, transparent);
            border-color: color-mix(in srgb, var(--color-primary-700, #1d4ed8) 60%, transparent);
            color: var(--color-primary-400, #60a5fa);
            box-shadow: 0 1px 3px 0 color-mix(in srgb, var(--color-primary-800, #1e40af) 40%, transparent);
        }
    }
}

.nav-link-active {
    /* Theme-aware active state */
    background-color: color-mix(in srgb, var(--color-primary-100, #dbeafe) 80%, transparent);
    border-color: var(--color-primary-300, #93c5fd);
    color: var(--color-primary-700, #1d4ed8);
    box-shadow: 0 1px 3px 0 color-mix(in srgb, var(--color-primary-200, #bfdbfe) 50%, transparent);
    
    .dark & {
        background-color: color-mix(in srgb, var(--color-primary-900, #1e3a8a) 40%, transparent);
        border-color: var(--color-primary-700, #1d4ed8);
        color: var(--color-primary-300, #93c5fd);
        box-shadow: 0 1px 3px 0 color-mix(in srgb, var(--color-primary-800, #1e40af) 60%, transparent);
    }
}

.nav-link:active {
    transform: translateY(0);
}

</style>
