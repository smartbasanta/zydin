<script setup lang="ts">
    import { AlertTriangleIcon } from "lucide-vue-next";
    
    defineEmits<{
        (e: "retry"): void;
    }>();
</script>

<template>
    <div class="min-h-[calc(100vh-80px)] bg-gray-100 dark:bg-gray-1100/80 backdrop-blur-sm border-2 border-red-500/60 dark:border-red-600/30 rounded-xl p-8 text-center shadow-lg shadow-red-500/10 dark:shadow-red-900/20">
        <AlertTriangleIcon class="size-16 mx-auto mb-5 text-red-600 dark:text-red-400 animate-pulse" />
        <h2 class="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Data
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
            Failed to retrieve access control dashboard information. Please try again.
        </p>
        <button
            @click="$emit('retry')"
            class="btn btn-destructive px-6 bg-red-600 dark:bg-red-800 text-white hover:bg-red-700 dark:hover:bg-red-900"
        >
            Retry Load
        </button>
    </div>
</template>