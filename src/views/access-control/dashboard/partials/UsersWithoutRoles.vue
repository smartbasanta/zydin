<script setup lang="ts">
import { UserLockIcon, UserXIcon, ChevronRightIcon, CheckCircleIcon } from "lucide-vue-next";
import type { UserAccess } from "@/types/access-control";

defineProps<{
    can: {
        viewAnyAccess?: boolean
    } | undefined;
    usersWithoutRoles: UserAccess[];
}>();
</script>

<template>
    <div v-if="can?.viewAnyAccess" class="no-roles-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <UserLockIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Pending Assignments</h3>
                <p class="text-xs text-muted">
                    {{ usersWithoutRoles.length }} {{ usersWithoutRoles.length === 1 ? 'user needs' : 'users need' }} role configuration
                </p>
            </div>
        </div>

        <!-- Body -->
        <div class="card-body">
            <!-- Empty State (Good State) -->
            <div v-if="!usersWithoutRoles.length" class="empty-state">
                <div class="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 mb-2">
                    <CheckCircleIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">All Set</p>
                <p class="text-xs text-muted">Every user has at least one role assigned.</p>
            </div>

            <!-- User List -->
            <ul v-else class="list-container">
                <li v-for="user in usersWithoutRoles" :key="user.id" class="list-item group">
                    <router-link 
                        :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }"
                        class="flex items-center justify-between w-full"
                    >
                        <div class="flex items-center gap-3 overflow-hidden">
                            <!-- Avatar Placeholder -->
                            <div class="flex-shrink-0 w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                <UserXIcon class="size-4" />
                            </div>

                            <div class="min-w-0">
                                <p class="text-sm font-semibold section-title truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    {{ user.username }}
                                </p>
                                <p class="text-xs text-muted truncate">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pl-2 flex-shrink-0">
                            <span class="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 group-hover:bg-amber-100 transition-colors">
                                Assign
                            </span>
                            <ChevronRightIcon class="size-4 text-muted group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.no-roles-card {
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
    /* Amber theme for Warning/Attention */
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