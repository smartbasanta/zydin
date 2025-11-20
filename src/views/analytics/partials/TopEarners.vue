<script setup lang="ts">
    import { ExternalLink } from 'lucide-vue-next';
    defineProps<{
        topUsers: { 
            rank: number; 
            name: string; 
            avatar: string; 
            winnings: number; 
            events: number 
        }[];
    }>();
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Top Earners</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Players with the highest winnings in the selected period.</p>
        </div>
        <div class="p-2">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-300 dark:border-gray-800">
                        <th class="p-3 text-left font-semibold text-gray-500 dark:text-gray-400">Rank</th>
                        <th class="p-3 text-left font-semibold text-gray-500 dark:text-gray-400">Player</th>
                        <th class="p-3 text-right font-semibold text-gray-500 dark:text-gray-400">Winnings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in topUsers" :key="user.rank" class="hover:bg-gray-100 dark:hover:bg-gray-900/50">
                        <td class="p-3 text-center w-12 font-bold" :class="{ 'text-amber-600 dark:text-amber-400': user.rank === 1 }">{{ user.rank }}</td>
                        <td class="p-3">
                            <div class="flex items-center gap-3">
                                <img :src="user.avatar" class="w-8 h-8 rounded-full">
                                <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                            </div>
                        </td>
                        <td class="p-3 text-right font-mono font-semibold text-green-600 dark:text-green-400">₹{{ user.winnings.toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="p-4 border-t border-gray-300 dark:border-gray-800 text-center">
            <a href="#" class="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors flex items-center justify-center gap-2">
                View Full Leaderboard <ExternalLink class="w-4 h-4" />
            </a>
        </div>
    </div>
</template>