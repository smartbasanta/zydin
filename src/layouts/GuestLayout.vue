<script setup lang="ts">
    import AppHeader from '@/components/navigation/header/AppHeader.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col justify-between">
        <div>
            <div class="fixed inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-4 -left-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute top-1/4 right-8 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <AppHeader />
            <main class="pb-20 px-4">
                <RouterView />
            </main>
        </div>

        <footer class="px-4 py-6 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
                © 2025 Zydin Biotech. All rights reserved. 
            </p>
        </footer>
    </div>
</template>
