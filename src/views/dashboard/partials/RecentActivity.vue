<script setup lang="ts">
defineProps<{
    recentActivities: { user: string; avatar: string; action: string; time: string; important?: boolean }[];
}>();
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Live Activity Feed</h3>
        </div>
        <div class="p-2 space-y-2">
            <div
                v-for="activity in recentActivities"
                :key="activity.time"
                class="flex items-start gap-3 p-3 rounded-lg"
                :class="{ 'bg-orange-600/10 dark:bg-orange-400/10': activity.important }"
            >
                <img :src="activity.avatar" class="w-9 h-9 rounded-full mt-0.5" />
                <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        <strong class="font-semibold text-gray-900 dark:text-white">{{ activity.user }}</strong>
                        {{ activity.action }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
                </div>
            </div>
        </div>
    </div>
</template>