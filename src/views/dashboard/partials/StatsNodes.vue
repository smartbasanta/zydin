<script setup lang="ts">
import { Users, DollarSign, AlertCircle, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';
defineProps<{
    stats: { title: string; value: string; change: string; icon: string; color: string; changeType: string | "increase" | "decrease" | "neutral" }[];
}>();
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
            v-for="stat in stats"
            :key="stat.title"
            class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl p-5 shadow-lg transition-all duration-300 hover:border-blue-600/50 dark:hover:border-blue-400/50 hover:shadow-blue-900/10 hover:-translate-y-1"
        >
            <div class="flex justify-between items-start">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
                </div>
                <div class="p-3 rounded-lg" :class="`${stat.color.replace('text-', 'bg-')}/10`">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs">
                <span
                    class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    :class="{
                        'bg-green-500/10 text-green-600 dark:text-green-400': stat.changeType === 'increase',
                        'bg-red-500/10 text-red-600 dark:text-red-400': stat.changeType === 'decrease',
                        'bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300': stat.changeType === 'neutral',
                    }"
                >
                    <ArrowUpRight v-if="stat.changeType === 'increase'" class="w-3 h-3" />
                    <ArrowDownRight v-if="stat.changeType === 'decrease'" class="w-3 h-3" />
                    {{ stat.change }}
                </span>
            </div>
        </div>
    </div>
</template>