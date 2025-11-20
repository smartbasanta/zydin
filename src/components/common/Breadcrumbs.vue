<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next';
defineProps<{
    items: { name: string; path?: string }[];
}>();
</script>
<template>
    <nav class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <ol class="flex items-center space-x-2">
            <li v-for="(item, index) in items" :key="index" class="flex items-center">
                <RouterLink v-if="item.path" :to="item.path" class="hover:text-blue-600 hover:underline">{{ item.name }}</RouterLink>
                <span v-else class="font-semibold text-gray-700 dark:text-gray-300">{{ item.name }}</span>
                <ChevronRightIcon v-if="index < items.length - 1" class="w-4 h-4 mx-2 flex-shrink-0" />
            </li>
        </ol>
    </nav>
</template>