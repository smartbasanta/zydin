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
                iconClass: 'text-sky-500',
                linkTo: { name: 'access-control.roles.show', params: { id: item.object_id } }
            };
        case 'permission_granted':
            return {
                icon: KeyRoundIcon,
                iconClass: 'text-purple-500',
                linkTo: { name: 'access-control.permissions.show', params: { id: item.object_id } }
            };
        default:
            return { icon: HistoryIcon, iconClass: 'text-gray-500', linkTo: '#' };
    }
};
</script>

<template>
    <div v-if="can?.viewRecentActivity"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <HistoryIcon class="size-6 text-gray-500 dark:text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Recent Activity
            </h3>
        </div>
        <p v-if="!recentActivity.length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            No recent access changes to display.
        </p>
        <ul v-else class="space-y-4">
            <li v-for="(item, index) in recentActivity" :key="index" class="flex items-start gap-4">
                <span class="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-1000">
                    <component :is="eventDetails(item).icon" class="h-5 w-5" :class="eventDetails(item).iconClass" />
                </span>
                <div class="flex-1">
                    <p class="text-sm text-gray-800 dark:text-gray-300">
                        <router-link :to="{ name: 'access-control.user-access.edit', params: { id: item.subject_id } }" class="font-bold link-subtle">{{ item.granter_name }}</router-link>
                        {{ item.event_type === 'role_assigned' ? 'assigned role' : 'granted permission' }}
                        <router-link :to="eventDetails(item).linkTo" class="font-bold link-subtle">{{ item.object_name }}</router-link>
                        to
                        <router-link :to="{ name: 'access-control.user-access.edit', params: { id: item.subject_id } }" class="font-bold link-subtle">{{ item.subject_name }}</router-link>.
                    </p>
                    <time class="text-xs text-gray-500 dark:text-gray-500">
                        {{ formatTimestamp(item.created_at) }}
                    </time>
                </div>
            </li>
        </ul>
    </div>
</template>