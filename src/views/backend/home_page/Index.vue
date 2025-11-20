<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { 
    LayoutTemplate, 
    Building2, 
    Images, 
    ArrowRight 
} from 'lucide-vue-next';

// We define our management sections here as an array of objects.
// This makes it easy to add more sections in the future without changing the template.
const managementSections = [
    {
        name: 'hero-slides',
        title: 'Hero Section Slides',
        description: 'Manage the rotating slides, images, and calls-to-action on the homepage hero section.',
        icon: LayoutTemplate,
        routeName: 'dashboard.hero-slides.index',
        iconBgClass: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    },
    {
        name: 'gallery',
        title: 'Photo Galleries',
        description: 'Upload and manage images for galleries like "Company Culture" and "Employee Life".',
        icon: Images,
        routeName: 'dashboard.gallery.index',
        iconBgClass: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
    }
];
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8">
        <!-- Page Header -->
        <header class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Landing Page Management</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Central hub for managing content on your main pages.</p>
        </header>

        <!-- Grid of Management Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="section in managementSections" :key="section.name">
                <RouterLink 
                    :to="{ name: section.routeName }"
                    class="block p-6 bg-white dark:bg-gray-1000 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                >
                    <div class="flex flex-col h-full">
                        <!-- Icon -->
                        <div class="mb-4">
                            <span class="inline-flex items-center justify-center p-3 rounded-lg" :class="section.iconBgClass">
                                <component :is="section.icon" class="size-6" />
                            </span>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-grow">
                            <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ section.title }}</h2>
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ section.description }}</p>
                        </div>

                        <!-- Footer / Action Link -->
                        <div class="mt-6">
                            <span class="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Manage Section
                                <ArrowRight class="ml-2 size-4" />
                            </span>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>