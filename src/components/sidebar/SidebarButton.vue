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
    // Use `activeGroup` for robust matching. This is the route name prefix.
    // e.g., 'admin-dashboard', 'admin-users'
    activeGroup: string | string[];
    permission?: string | { [key: string]: string };
}>();

const sidebar = useSidebarStore();
const authStore = useAuthStore();
const route = useRoute();

const canShow = computed(() => {
    // If no permission is required, always show the button
    if (!props.permission) return true;
    // Otherwise, check if the user has the required permission
    return authStore.hasPermission(props.permission);
});
const isCollapsed = computed(() => !sidebar.isDesktopOpen);

// This is the robust active check. It checks if the current route's name
// starts with the provided activeGroup string. This handles nested routes
// like 'admin-users-create' correctly when the group is 'admin-users'.
const isActive = computed(() => {
    const currentRouteName = route.name ? String(route.name) : '';

    if (Array.isArray(props.activeGroup)) {
        // If it's an array, check if the current route name starts with any of the strings in the array.
        return props.activeGroup.some(group => currentRouteName.startsWith(group));
    } else {
        // If it's a single string, perform the original startsWith check.
        return currentRouteName.startsWith(props.activeGroup);
    }
});
</script>

<template>
    <template v-if="canShow">

        <router-link
            :to="to"
            :title="isCollapsed ? title : undefined"
            class="group relative flex h-12 items-center gap-3 pr-4 text-sm font-semibold outline-none transition-colors duration-200"
            :class="[
                isActive 
                    ? 'text-white' // Active text
                    : 'text-gray-400 hover:text-white', // Inactive and hover text
                isCollapsed && 'justify-center !pr-0' // Collapsed state
            ]"
        >
            <!-- 
                The unique, angled background shape.
                This is the core of the design.
            -->
            <div 
                class="absolute inset-y-0 left-0 w-full rounded-r-lg transition-all duration-300"
                :class="[
                    isActive
                        ? 'bg-gradient-to-r from-blue-700 to-blue-800 dark:from-primary-900 dark:to-primary-1000/30 shadow-lg shadow-blue-900/50'
                        : 'bg-gray-900/0 group-hover:bg-secondary-750/50'
                ]"
                style="clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 75%);"
            ></div>
            <!-- <div 
                class="absolute inset-y-0 left-0 w-full rounded-r-lg transition-all duration-300"
                :class="[
                    isActive
                        ? 'bg-gradient-to-r from-orange-550 to-orange-800 dark:from-secondary dark:to-secondary shadow-lg shadow-orange-900/50'
                        : 'bg-gray-900/0 group-hover:bg-secondary/50'
                ]"
                style="clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 75%);"
            ></div> -->
    
            <!-- 
                Content container with padding. 
                This ensures the content is correctly aligned inside the shape.
            -->
            <div class="relative z-10 flex w-full items-center gap-3 pl-4">
                <!-- Icon -->
                <component 
                    :is="icon" 
                    class="h-5 w-5 flex-shrink-0 transition-colors"
                    :class="isActive ? 'text-primary-300' : 'text-gray-500 group-hover:text-gray-300'"
                />
                <!-- <component 
                    :is="icon" 
                    class="h-5 w-5 flex-shrink-0 transition-colors"
                    :class="isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'"
                /> -->
                
                <!-- Label -->
                <span 
                    class="truncate transition-opacity duration-200"
                    :class="{ 'opacity-0': isCollapsed }"
                >
                    {{ title }}
                </span>
            </div>
    
            <!-- Tooltip for Collapsed State -->
            <div 
                v-if="isCollapsed" 
                class="absolute left-full top-1/2 z-20 ml-4 -translate-y-1/2 rounded-md bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all delay-200 group-hover:opacity-100 pointer-events-none"
            >
                {{ title }}
            </div>
        </router-link>
    </template>
</template>