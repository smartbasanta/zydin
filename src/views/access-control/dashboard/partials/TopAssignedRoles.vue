<script setup lang="ts">
import { TrendingUpIcon, UsersIcon, ChevronRightIcon } from "lucide-vue-next";
import { computed } from "vue";
import type { Role } from "@/types/access-control";

const props = defineProps<{
    can: {
        viewAnyRole?: boolean
    } | undefined;
    topRoles: Role[];
}>();

// Safe computation for scaling progress bars
const maxUserCount = computed(() => {
    if (!props.topRoles || props.topRoles.length === 0) return 1;
    const counts = props.topRoles.map(role => role.users_count ?? 0);
    const max = Math.max(...counts);
    return max > 0 ? max : 1;
});
</script>

<template>
    <div v-if="can?.viewAnyRole" class="top-roles-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <TrendingUpIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Top Roles</h3>
                <p class="text-xs text-muted">Most assigned system roles</p>
            </div>
        </div>

        <!-- Body -->
        <div class="card-body">
            <!-- Empty State -->
            <div v-if="!topRoles.length" class="empty-state">
                <div class="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-2">
                    <UsersIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">No Assignments</p>
                <p class="text-xs text-muted">No roles have been assigned yet.</p>
            </div>

            <!-- Roles List -->
            <div v-else class="list-container">
                <div v-for="role in topRoles" :key="role.id" class="list-item group">
                    <router-link 
                        :to="{ name: 'access-control.roles.show', params: { id: role.id } }" 
                        class="block"
                    >
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold section-title group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    {{ role.name }}
                                </span>
                                <ChevronRightIcon class="size-3 text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </div>
                            
                            <span class="flex items-center gap-1.5 text-xs font-medium text-muted bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-transparent group-hover:border-sky-100 dark:group-hover:border-sky-900 transition-colors">
                               <UsersIcon class="size-3" />
                               {{ role.users_count ?? 0 }}
                            </span>
                        </div>

                        <!-- Progress Bar -->
                        <div class="relative w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                class="absolute top-0 left-0 h-full bg-sky-500 rounded-full transition-all duration-500 group-hover:bg-sky-400"
                                :style="{ width: `${((role.users_count ?? 0) / maxUserCount * 100)}%` }"
                            ></div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.top-roles-card {
    @apply flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 h-full;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-md);
}

.card-header {
    @apply flex items-center gap-3 p-5 border-b border-muted section-bg;
}

.icon-wrapper {
    @apply flex items-center justify-center w-10 h-10 rounded-xl;
    /* Sky Blue theme for growth/stats */
    background-color: color-mix(in srgb, var(--color-info) 10%, transparent);
    color: var(--color-info);
}

.card-body {
    @apply flex-1 overflow-hidden relative;
}

.list-container {
    @apply p-5 space-y-5 overflow-y-auto max-h-[300px];
    scrollbar-width: thin;
}

.list-item {
    @apply relative;
}

.empty-state {
    @apply flex flex-col items-center justify-center h-48 text-center p-6;
}
</style>