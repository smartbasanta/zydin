<script setup lang="ts">
import { ShieldAlertIcon, UserIcon, ChevronRightIcon } from 'lucide-vue-next';
import type { User } from '@/types/auth';

defineProps<{
    can: {
        viewSuperUsers?: boolean
    } | undefined;
    superUsers: User[];
}>();
</script>

<template>
    <div v-if="can?.viewSuperUsers" class="super-user-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <ShieldAlertIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Super Users</h3>
                <p class="text-xs text-muted">
                    {{ superUsers.length }} {{ superUsers.length === 1 ? 'user has' : 'users have' }} full system access
                </p>
            </div>
        </div>

        <!-- List Content -->
        <div class="card-body">
            <!-- Empty State -->
            <div v-if="!superUsers.length" class="empty-state">
                <div class="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 mb-2">
                    <ShieldAlertIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">Secure System</p>
                <p class="text-xs text-muted">No accounts currently have global super-user privileges.</p>
            </div>

            <!-- User List -->
            <ul v-else class="list-container">
                <li v-for="user in superUsers" :key="user.id" class="list-item">
                    <RouterLink 
                        :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }"
                        class="flex items-center justify-between w-full group"
                    >
                        <div class="flex items-center gap-3 overflow-hidden">
                            <!-- Avatar / Placeholder -->
                            <div class="flex-shrink-0 w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                                <UserIcon class="size-4" />
                            </div>
                            
                            <div class="min-w-0">
                                <p class="text-sm font-bold section-title truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                    {{ user.username }}
                                </p>
                                <p class="text-xs text-muted truncate">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pl-2 flex-shrink-0">
                            <span class="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-800">
                                Root
                            </span>
                            <ChevronRightIcon class="size-4 text-muted group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
        
        <!-- Footer Warning -->
        <div v-if="superUsers.length > 0" class="p-3 bg-rose-50/50 dark:bg-rose-900/10 border-t border-rose-100 dark:border-rose-900/30">
            <p class="text-[11px] text-rose-700 dark:text-rose-400 text-center font-medium flex items-center justify-center gap-1.5">
                <ShieldAlertIcon class="size-3" />
                Regularly review these accounts for security.
            </p>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.super-user-card {
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
    /* Rose color to signify high privilege/danger zone */
    background-color: color-mix(in srgb, var(--color-error) 10%, transparent);
    color: var(--color-error);
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