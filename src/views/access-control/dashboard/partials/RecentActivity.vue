<script setup lang="ts">
import { HistoryIcon, UserPlusIcon, KeyRoundIcon } from 'lucide-vue-next';
import { formatDistanceToNow, parseISO } from 'date-fns';
import type { DashboardRecentActivityItem } from '@/types/access-control';

defineProps<{
    can: {
        viewRecentActivity?: boolean
    } | undefined;
    recentActivity: DashboardRecentActivityItem[];
}>();

const formatTimestamp = (dateString: string) => {
    if (!dateString) return 'Unknown time';
    try {
        return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch (e) {
        return 'Invalid date';
    }
};

const eventDetails = (item: DashboardRecentActivityItem) => {
    switch (item.event_type) {
        case 'role_assigned':
            return {
                icon: UserPlusIcon,
                // Sky/Blue theme for Roles
                iconBg: 'bg-sky-50 dark:bg-sky-900/20',
                iconColor: 'text-sky-600 dark:text-sky-400',
                linkTo: { name: 'access-control.roles.show', params: { id: item.object_id } }
            };
        case 'permission_granted':
            return {
                icon: KeyRoundIcon,
                // Purple theme for Permissions
                iconBg: 'bg-purple-50 dark:bg-purple-900/20',
                iconColor: 'text-purple-600 dark:text-purple-400',
                linkTo: { name: 'access-control.permissions.show', params: { id: item.object_id } }
            };
        default:
            return { 
                icon: HistoryIcon, 
                iconBg: 'bg-gray-50 dark:bg-gray-800',
                iconColor: 'text-gray-500', 
                linkTo: '#' 
            };
    }
};
</script>

<template>
    <div v-if="can?.viewRecentActivity" class="activity-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <HistoryIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Recent Activity</h3>
                <p class="text-xs text-muted">Latest security and access changes</p>
            </div>
        </div>

        <!-- Body -->
        <div class="card-body section-bg">
            <!-- Empty State -->
            <div v-if="!recentActivity.length" class="empty-state">
                <div class="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-2">
                    <HistoryIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">No Activity</p>
                <p class="text-xs text-muted">No recent access changes recorded.</p>
            </div>

            <!-- Activity List -->
            <ul v-else class="list-container">
                <li v-for="(item, index) in recentActivity" :key="index" class="activity-item group">
                    <!-- Icon -->
                    <div 
                        class="activity-icon"
                        :class="eventDetails(item).iconBg"
                    >
                        <component 
                            :is="eventDetails(item).icon" 
                            class="h-4 w-4" 
                            :class="eventDetails(item).iconColor" 
                        />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <p class="text-sm section-text leading-relaxed">
                            <router-link 
                                :to="{ name: 'access-control.user-access.edit', params: { id: item.subject_id } }" 
                                class="activity-link"
                            >
                                {{ item.granter_name }}
                            </router-link>
                            
                            <span class="text-muted mx-1">
                                {{ item.event_type === 'role_assigned' ? 'assigned role' : 'granted permission' }}
                            </span>

                            <router-link 
                                :to="eventDetails(item).linkTo" 
                                class="activity-link"
                            >
                                {{ item.object_name }}
                            </router-link>
                            
                            <span class="text-muted mx-1">to</span>

                            <router-link 
                                :to="{ name: 'access-control.user-access.edit', params: { id: item.subject_id } }" 
                                class="activity-link"
                            >
                                {{ item.subject_name }}
                            </router-link>
                        </p>
                        
                        <time class="text-[11px] text-muted font-mono mt-1 block">
                            {{ formatTimestamp(item.created_at) }}
                        </time>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.activity-card {
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
    background-color: color-mix(in srgb, var(--color-gray-500) 10%, transparent);
    color: var(--color-gray-600);
}
:global(.dark) .icon-wrapper {
    color: var(--color-gray-400);
}

.card-body {
    @apply flex-1 overflow-hidden relative;
}

.list-container {
    @apply divide-y border overflow-y-auto max-h-[350px];
    scrollbar-width: thin;
}

.activity-item {
    @apply flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200;
}

.activity-icon {
    @apply flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition-all duration-300;
}
.group:hover .activity-icon {
    transform: scale(1.05);
    @apply shadow-sm border-gray-200 dark:border-gray-700;
}

.activity-link {
    @apply font-semibold text-primary-600 dark:text-primary-400 hover:underline decoration-primary-300 underline-offset-2 transition-colors;
}

.empty-state {
    @apply flex flex-col items-center justify-center h-48 text-center p-6;
}
</style>