<script setup lang="ts">
    import { EditIcon } from 'lucide-vue-next';

    interface Props {
        to: string | object;
    }

    defineProps<Props>();
</script>

<template>
    <router-link
        :to="to"
        class="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md shadow-xl dark:shadow-gray-900/50 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-105"
        title="Edit"
    >
        <span class="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-200/20 via-blue-300/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
        <span class="absolute inset-0 rounded-lg border border-white/30 dark:border-white/10 group-hover:border-blue-400/40 transition-colors duration-300 z-10"></span>
        <EditIcon class="w-4 h-4 relative z-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[10deg]" />
        <span class="sr-only">Edit</span>
    </router-link>
</template>