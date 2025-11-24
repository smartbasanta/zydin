<script setup lang="ts">
    import { ScrollText, SettingsIcon, ShieldCheckIcon } from "lucide-vue-next";
</script>

<template>
    <header class="flex flex-col sm:flex-row items-center justify-between mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold section-title flex items-center gap-3 mb-4 sm:mb-0">
            <ShieldCheckIcon class="size-9 sm:size-10 text-blue-600 dark:text-blue-400" />
            Access Control Dashboard
        </h1>
        <div class="flex gap-2">
            <button class="btn btn-secondary text-xs px-3 py-1.5">
                <ScrollText />
                Audit Logs
            </button>
            <button class="btn btn-primary text-xs px-3 py-1.5">
                <SettingsIcon />
                Settings
            </button>
        </div>
    </header>
</template>