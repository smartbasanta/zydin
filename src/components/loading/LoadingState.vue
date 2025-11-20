<script setup lang="ts">
    import { ShieldCheckIcon } from "lucide-vue-next";
    withDefaults(defineProps<{
        text?: string;
    }>(), {
        text: 'Loading data...'
    })
</script>

<template>
    <div class="flex flex-col justify-center items-center py-20 space-y-4 h-[calc(100vh-80px)]">
        <div class="relative w-16 h-16 shrink-0">
            <div class="absolute inset-0 rounded-full border-2 border-blue-500/50 dark:border-blue-200/50 animate-ping opacity-75"></div>
            <div class="absolute inset-2 rounded-full border-2 border-blue-400/70 dark:border-blue-300/70 animate-pulse"></div>
            <ShieldCheckIcon class="absolute inset-4 size-8 text-blue-400 dark:text-blue-300" />
        </div>
        <p class="text-lg text-gray-500 dark:text-gray-400">{{ text }}</p>
    </div>
</template>