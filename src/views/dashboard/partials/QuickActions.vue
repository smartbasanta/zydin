<script setup lang="ts">
import { Users, Gamepad2, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-vue-next';
defineProps<{
    quickActions: { title: string; icon: string; to: string }[];
}>();
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div class="p-2 space-y-1">
            <RouterLink
                v-for="action in quickActions"
                :key="action.title"
                :to="action.to"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors"
            >
                <div class="flex items-center gap-3">
                    <component :is="action.icon" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span class="font-medium text-gray-700 dark:text-gray-200">{{ action.title }}</span>
                </div>
                <ChevronRight class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </RouterLink>
        </div>
    </div>
</template>