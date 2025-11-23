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
            :class="{ 'nav-link-active': route.path.startsWith(item.path) }" aria-haspopup="true"
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
    @apply hover:text-[var(--color-primary-800)] dark:hover:text-[var(--color-primary-400)];
}


</style>