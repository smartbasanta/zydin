<script setup lang="ts">
import { AlertTriangleIcon, ClockIcon } from "lucide-vue-next";
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
    <div v-if="can?.viewExpiringAssignments"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <AlertTriangleIcon class="size-6 text-amber-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Expiring Assignments ({{ expiringItems.length }})
            </h3>
        </div>
        <p v-if="!expiringItems.length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            No assignments are expiring soon.
        </p>
        <ul v-else class="space-y-1 max-h-72 overflow-y-auto no-scrollbar pr-1">
            <li v-for="(item, index) in expiringItems"
                :key="'exp-' + item.user_id + '-' + item.item_type + '-' + index"
                class="group flex items-center justify-between p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-1000/30 transition-colors">
                <div class="truncate mr-2">
                    <router-link :to="{ name: 'access-control.user-access.edit', params: { id: item.user_id } }"
                        class="link text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400">
                        {{ item.username }}
                    </router-link>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.item_type }}: <span class="italic">{{ item.item_name }}</span>
                    </p>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                    <ClockIcon class="size-4 text-amber-500" />
                    <span class="text-xs font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">{{ formatExpiry(item.expires_at) }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>