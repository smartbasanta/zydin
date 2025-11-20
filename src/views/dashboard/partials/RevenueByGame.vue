<script setup lang="ts">
import { DollarSign } from 'lucide-vue-next';
import { ref } from 'vue';
const revenueData = ref([
    { game: '8 Ball Pool', revenue: '₹2,50,000' },
    { game: 'Weekly Blitz', revenue: '₹3,10,000' },
    { game: 'Chess Clash', revenue: '₹1,85,000' },
    { game: 'Rummy Royale', revenue: '₹1,00,200' },
]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Revenue by Game</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Entry fees and other revenue sources per game.</p>
        </div>
        <div class="p-4">
            <ul class="space-y-2">
                <li v-for="rev in revenueData" :key="rev.game" class="flex items-center gap-3">
                    <DollarSign class="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ rev.game }}: {{ rev.revenue }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>