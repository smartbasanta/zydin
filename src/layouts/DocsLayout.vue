<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

const docPages = [
    { name: 'API Guidelines', path: '/docs/api-guidelines' },
    { name: 'Authentication', path: '/docs/authentication' },
    { name: 'Notifications', path: '/docs/notifications' },
    { name: 'Dashboard', path: '/docs/dashboard' },
];
</script>

<template>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-1150">
        <!-- Sidebar -->
        <aside class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 p-6 hidden md:block">
            <h2 class="text-lg font-semibold text-orange-600 dark:text-orange-500 mb-4">API Documentation</h2>
            <nav class="flex flex-col gap-2">
                <RouterLink
                    v-for="page in docPages"
                    :key="page.name"
                    :to="page.path"
                    class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    active-class="bg-orange-100/50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                    :class="'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'"
                >
                    {{ page.name }}
                </RouterLink>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6 sm:p-8 md:p-10">
            <!-- This will render the DocsPage.vue component -->
            <RouterView />
        </main>
    </div>
</template>