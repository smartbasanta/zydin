<script setup lang="ts">
    import { UserCheck } from 'lucide-vue-next';
    import { ref } from 'vue';
    const retentionData = ref([
        { period: '7-Day Retention', rate: '65%', users: 195 },
        { period: '30-Day Retention', rate: '42%', users: 126 },
        { period: '90-Day Retention', rate: '28%', users: 84 },
    ]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">User Retention Metrics</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Percentage of users returning after initial signup.</p>
        </div>
        <div class="p-4">
            <ul class="space-y-2">
                <li v-for="retention in retentionData" :key="retention.period" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/50">
                    <UserCheck class="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ retention.period }}: {{ retention.rate }} ({{ retention.users }} users)</span>
                </li>
            </ul>
        </div>
    </div>
</template>