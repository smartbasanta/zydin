<script setup lang="ts">
import { AlertTriangleIcon, ClockIcon, ChevronRightIcon, UserIcon } from "lucide-vue-next";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { DashboardExpiringItem } from "@/types/access-control";

defineProps<{
    can: {
        viewExpiringAssignments?: boolean
    } | undefined;
    expiringItems: DashboardExpiringItem[];
}>();

const formatExpiry = (dateString: string | null): string => {
    if (!dateString) return "Never";
    try {
        const date = parseISO(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
        return "Invalid date";
    }
};
</script>

<template>
    <div v-if="can?.viewExpiringAssignments" class="expiring-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <AlertTriangleIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Expiring Assignments</h3>
                <p class="text-xs text-muted">
                    {{ expiringItems.length }} {{ expiringItems.length === 1 ? 'item' : 'items' }} require attention
                </p>
            </div>
        </div>

        <!-- List Content -->
        <div class="card-body section-bg">
            <div v-if="!expiringItems.length" class="empty-state">
                <div class="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 mb-2">
                    <ClockIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">All Good!</p>
                <p class="text-xs text-muted">No assignments are expiring soon.</p>
            </div>

            <ul v-else class="list-container">
                <li v-for="(item, index) in expiringItems"
                    :key="'exp-' + item.user_id + '-' + item.item_type + '-' + index"
                    class="list-item group">
                    
                    <RouterLink 
                        :to="{ name: 'access-control.user-access.edit', params: { id: item.user_id } }"
                        class="flex items-center justify-between w-full"
                    >
                        <div class="flex items-center gap-3 overflow-hidden">
                            <!-- User Avatar Placeholder -->
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-muted">
                                <UserIcon class="size-4" />
                            </div>
                            
                            <div class="min-w-0">
                                <p class="text-sm font-semibold section-title truncate group-hover:text-primary-600 transition-colors">
                                    {{ item.username }}
                                </p>
                                <p class="text-xs text-muted flex items-center gap-1 truncate">
                                    <span class="uppercase tracking-wider text-[10px] font-bold">{{ item.item_type }}:</span>
                                    <span class="truncate">{{ item.item_name }}</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 pl-2 flex-shrink-0">
                            <!-- Expiry Badge -->
                            <span class="expiry-badge">
                                <ClockIcon class="size-3" />
                                {{ formatExpiry(item.expires_at) }}
                            </span>
                            
                            <!-- Arrow -->
                            <ChevronRightIcon class="size-4 text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.expiring-card {
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
    background-color: color-mix(in srgb, var(--color-warning) 15%, transparent);
    color: var(--color-warning);
}

.card-body {
    @apply flex-1 overflow-hidden relative;
}

.list-container {
    @apply divide-y border overflow-y-auto max-h-[300px];
    /* Custom scrollbar for the list */
    scrollbar-width: thin;
    scrollbar-color: var(--border-muted) transparent;
}

.list-item {
    @apply p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200;
}

.expiry-badge {
    @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap;
    background-color: color-mix(in srgb, var(--color-warning) 10%, transparent);
    color: color-mix(in srgb, var(--color-warning) 90%, var(--section-title-color));
    border: 1px solid color-mix(in srgb, var(--color-warning) 20%, transparent);
}

.empty-state {
    @apply flex flex-col items-center justify-center h-48 text-center p-6;
}
</style>