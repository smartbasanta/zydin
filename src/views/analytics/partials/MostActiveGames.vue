<script setup lang="ts">
    import { Gamepad2 } from 'lucide-vue-next';
    import { ref } from 'vue';
    const activeGames = ref([
        { rank: 1, name: 'Comfun Ludo', matches: 1200 },
        { rank: 2, name: '8 Ball Pool', matches: 950 },
        { rank: 3, name: 'eFootball', matches: 700 },
        { rank: 4, name: 'Chess Clash', matches: 450 },
        { rank: 5, name: 'Rummy Royale', matches: 300 },
    ]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Most Active Games</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Number of matches played per game in the selected period.</p>
        </div>
        <div class="p-4">
            <ul class="space-y-2">
                <li v-for="game in activeGames" :key="game.rank" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/50">
                    <span class="w-6 text-center font-bold" :class="{ 'text-amber-600 dark:text-amber-400': game.rank === 1 }">{{ game.rank }}</span>
                    <Gamepad2 class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ game.name }}: {{ game.matches }} matches</span>
                </li>
            </ul>
        </div>
    </div>
</template>