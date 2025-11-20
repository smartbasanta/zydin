<script setup lang="ts">
import { UserPlus2Icon } from 'lucide-vue-next';
</script>

<template>
    <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-50 font-grotesk">Admin Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400">Welcome back, dashboard. Here's what's happening on Zydin Biotech.</p>
        </div>
        <button class="btn bg-blue-700 dark:bg-blue-500 text-white hover:bg-blue-800 dark:hover:bg-blue-700 flex items-center gap-2 px-4 py-2 rounded-lg">
            <UserPlus2Icon class="w-4 h-4" />
            Create New Account
        </button>
    </div>
</template>