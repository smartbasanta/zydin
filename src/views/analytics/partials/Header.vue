<script setup lang="ts">
    import { Calendar, Gamepad2, Filter, Download } from 'lucide-vue-next';
    
    defineProps<{
        timeRanges: string[];
        selectedTimeRange: string;
    }>();
</script>

<template>
    <div class="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-50 font-grotesk">Platform Analytics</h1>
            <p class="text-gray-600 dark:text-gray-400">Deep dive into user behavior, financial metrics, and game performance.</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
            <div class="flex items-center gap-2 bg-white dark:bg-gray-1000 border border-gray-300 dark:border-gray-800 rounded-lg px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <Calendar class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>{{ selectedTimeRange }}</span>
            </div>
            <button class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors text-sm">
                <Filter class="w-4 h-4" />
                Filters
            </button>
            <button class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm">
                <Download class="w-4 h-4" />
                Export CSV
            </button>
        </div>
    </div>
</template>