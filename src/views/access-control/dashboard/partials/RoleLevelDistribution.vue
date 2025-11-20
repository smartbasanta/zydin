<script setup lang="ts">
import { BarChart3Icon } from "lucide-vue-next";

defineProps<{
    can: {
        viewAnyRole?: boolean
    } | undefined;
    roleLevelDistribution: Record<string, number>;
}>();
</script>

<template>
    <div v-if="can?.viewAnyRole"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <BarChart3Icon class="size-6 text-gray-500 dark:text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">Role Level Distribution</h3>
        </div>
        <p v-if="!Object.keys(roleLevelDistribution).length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            No data available for role level distribution.
        </p>
        <ul v-else class="space-y-2">
            <li v-for="([level, count]) in Object.entries(roleLevelDistribution)" :key="level"
                class="flex items-center justify-between p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-1000/30">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Level {{ level }} Roles</span>
                <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                    {{ count }} Users
                </span>
            </li>
        </ul>
    </div>
</template>