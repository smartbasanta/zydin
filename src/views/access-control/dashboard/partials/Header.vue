<script setup lang="ts">
    import { ScrollText, SettingsIcon, ShieldCheckIcon } from "lucide-vue-next";
</script>

<template>
    <header class="flex flex-col sm:flex-row items-center justify-between mb-12 ">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-4 sm:mb-0">
            <ShieldCheckIcon class="size-9 sm:size-10 text-blue-600 dark:text-blue-400" />
            Access Control Dashboard
        </h1>
        <div class="flex gap-2">
            <button class="btn btn-secondary text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800">
                <ScrollText />
                Audit Logs
            </button>
            <button class="btn btn-ghost text-xs px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <SettingsIcon />
                Settings
            </button>
        </div>
    </header>
</template>