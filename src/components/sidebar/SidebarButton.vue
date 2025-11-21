<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebar.store';
import type { LucideIcon } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const props = defineProps<{
    to: { name: string };
    title: string;
    icon: LucideIcon;
    activeGroup: string | string[];
    permission?: string | { [key: string]: string };
}>();

const sidebar = useSidebarStore();
const authStore = useAuthStore();
const route = useRoute();

const canShow = computed(() => {
    if (!props.permission) return true;
    return authStore.hasPermission(props.permission);
});

const isCollapsed = computed(() => !sidebar.isDesktopOpen);

const isActive = computed(() => {
    const currentRouteName = String(route.name ?? '');
    if (Array.isArray(props.activeGroup)) {
        return props.activeGroup.some(group => currentRouteName.startsWith(group));
    }
    return currentRouteName.startsWith(props.activeGroup);
});
</script>

<template>
    <router-link
        v-if="canShow"
        :to="to"
        :title="isCollapsed ? title : undefined"
        class="nav-button group"
        :class="{ 'nav-button--active': isActive, 'justify-center': isCollapsed }"
    >
        <!-- Icon -->
        <component 
            :is="icon" 
            class="h-5 w-5 flex-shrink-0 transition-colors z-10"
        />
        
        <!-- Label -->
        <span 
            class="truncate transition-all duration-200 z-10"
            :class="{ 'opacity-0 w-0 ml-0': isCollapsed, 'ml-3': !isCollapsed }"
        >
            {{ title }}
        </span>

        <!-- Tooltip for Collapsed State -->
        <div v-if="isCollapsed" class="tooltip">
            {{ title }}
        </div>
    </router-link>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.nav-button {
    @apply relative flex h-11 items-center px-4 rounded-lg outline-none transition-all duration-200;
    /* Use theme variables for text color */
    color: var(--section-title-color);
}

/* Hover state provides a subtle background indication */
.nav-button:hover {
    color: var(--header-link);
    background-color: color-mix(in srgb, var(--header-link-hover) 8%, transparent);
}

/* 
  The NEW Active State:
  - Uses a pseudo-element for a clean, inset highlight.
  - Has a subtle gradient and a border that "glows".
  - Looks fantastic in both light and dark mode.
*/
.nav-button--active {
    font-weight: 600;
    color: var(--header-link-hover);
}
.nav-button--active::before {
    content: '';
    @apply absolute inset-0 rounded-lg;
    background: linear-gradient(90deg, 
        color-mix(in srgb, var(--header-link-hover) 12%, transparent),
        color-mix(in srgb, var(--header-link-hover) 5%, transparent)
    );
    border: 1px solid color-mix(in srgb, var(--header-link-hover) 20%, transparent);
    box-shadow: inset 0 0 10px color-mix(in srgb, var(--header-link-hover) 10%, transparent);
}

.tooltip {
    @apply absolute left-full top-1/2 z-20 ml-4 -translate-y-1/2 rounded-md px-3 py-1.5 text-xs font-semibold shadow-lg opacity-0 transition-all delay-200 group-hover:opacity-100 pointer-events-none;
    background-color: var(--card-bg);
    color: var(--section-title-color);
    border: 1px solid var(--card-border);
}
</style>