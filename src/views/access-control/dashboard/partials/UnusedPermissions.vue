<script setup lang="ts">
import { PuzzleIcon, ChevronRightIcon, CheckCircleIcon } from "lucide-vue-next";
import type { Permission } from "@/types/access-control";

defineProps<{
    can: {
        viewAnyPermission?: boolean
    } | undefined;
    unusedPermissions: Permission[];
}>();
</script>

<template>
    <div v-if="can?.viewAnyPermission" class="unused-permissions-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <PuzzleIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Unused Permissions</h3>
                <p class="text-xs text-muted">
                    {{ unusedPermissions.length }} {{ unusedPermissions.length === 1 ? 'permission' : 'permissions' }} not assigned
                </p>
            </div>
        </div>

        <!-- Body -->
        <div class="card-body">
            <!-- Empty State (Good State) -->
            <div v-if="!unusedPermissions.length" class="empty-state">
                <div class="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 mb-2">
                    <CheckCircleIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">Optimized</p>
                <p class="text-xs text-muted">All permissions are currently in use.</p>
            </div>

            <!-- List -->
            <ul v-else class="list-container">
                <li v-for="perm in unusedPermissions" :key="perm.id" class="list-item group">
                    <router-link 
                        :to="{ name: 'access-control.permissions.show', params: { id: perm.id } }"
                        class="flex items-center justify-between w-full"
                    >
                        <div class="min-w-0 flex-1 pr-4">
                            <p class="text-sm font-semibold section-title group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                                {{ perm.name }}
                            </p>
                            <!-- Code Badge for the Key -->
                            <div class="mt-1.5 flex">
                                <code class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-muted border border-muted font-mono truncate max-w-full">
                                    {{ perm.key }}
                                </code>
                            </div>
                        </div>

                        <div class="flex-shrink-0">
                            <ChevronRightIcon class="size-4 text-muted group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.unused-permissions-card {
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
    /* Orange theme for maintenance/structure items */
    background-color: color-mix(in srgb, var(--color-warning) 10%, transparent);
    color: var(--color-warning);
}

.card-body {
    @apply flex-1 overflow-hidden relative;
}

.list-container {
    @apply divide-y border overflow-y-auto max-h-[300px];
    scrollbar-width: thin;
}

.list-item {
    @apply p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200;
}

.empty-state {
    @apply flex flex-col items-center justify-center h-48 text-center p-6;
}
</style>