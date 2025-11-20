<script setup lang="ts">
import { ref, onMounted, computed, type Component as VueComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';

// Lucide Icons
import { 
    LayoutTemplate, 
    Building2, 
    GalleryHorizontal,
    ArrowRight,
    Component as IconComponent, // Generic icon for fallback
    Images
} from 'lucide-vue-next';

interface UnifiedSection {
    key: string;
    title: string;
    description: string;
    icon: VueComponent;
    iconBgClass: string;
    route: {
        name: string;
        params?: { [key: string]: string };
    };
}
interface ManagablePage {
    slug: string;
    title: string;
    description: string;
}

// The list is now a reactive ref, initially empty.
const dynamicSections = ref<ManagablePage[]>([]); // Holds data from API
const isLoading = ref(true);

const staticSections = [
    {
        key: 'hero-slides',
        title: 'Hero Section Slides',
        description: 'Manage the rotating slides, images, and calls-to-action on the homepage hero section.',
        routeName: 'dashboard.hero-slides.index',
    },
    {
        key: 'gallery',
        title: 'Photo Galleries',
        description: 'Upload and manage images for galleries like "Company Culture" and "Employee Life".',
        routeName: 'dashboard.gallery.index',
    }
];

// --- Icon Mapping ---
// Since icons are a frontend concern, we map them here based on the slug from the backend.
const getIconForSlug = (slug: string) => {
    switch (slug) {
        case 'homepage': return LayoutTemplate;
        case 'about-us': return Building2;
        case 'hero-slides': return LayoutTemplate;
        case 'gallery': return Images;
        default: return IconComponent; // Fallback icon
    }
};

const getIconBgClass = (slug: string): string => {
     switch (slug) {
        case 'homepage': 
        case 'hero-slides':
            return 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400';
        case 'about-us': 
            return 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400';
        case 'gallery': 
            return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
        default: 
            return 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400';
    }
}

// --- Data Fetching ---
const fetchManagablePages = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/dashboard/page-content');
        dynamicSections.value = response.data.pages;
    } catch (error) {
        console.error("Failed to fetch manageable pages:", error);
        // You can add user notification here using your notifier composable
    } finally {
        isLoading.value = false;
    }
};

// --- COMPUTED PROPERTY (The Magic) ---
// This computed property merges the static and dynamic arrays into one unified structure.
const combinedSections = computed<UnifiedSection[]>(() => {
    // 1. Map the dynamically fetched pages to our unified format
    const mappedDynamicSections = dynamicSections.value.map(page => ({
        key: page.slug,
        title: page.title,
        description: page.description,
        icon: getIconForSlug(page.slug),
        iconBgClass: getIconBgClass(page.slug),
        route: { 
            name: 'dashboard.content.manage', 
            params: { pageSlug: page.slug } 
        }
    }));

    // 2. Map the statically defined sections to our unified format
    const mappedStaticSections = staticSections.map(section => ({
        key: section.key,
        title: section.title,
        description: section.description,
        icon: getIconForSlug(section.key),
        iconBgClass: getIconBgClass(section.key),
        route: { 
            name: section.routeName 
        }
    }));

    // 3. Return the combined array. You can control the order here.
    return [...mappedStaticSections, ...mappedDynamicSections];
});

// Fetch the data when the component is mounted.
onMounted(fetchManagablePages);
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8">
        <header class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Select a section to manage its content.</p>
        </header>

        <div v-if="isLoading && combinedSections.length === 0" class="text-center py-12">
            <p>Loading sections...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- The v-for loop now iterates over the single, unified 'combinedSections' array -->
            <div v-for="section in combinedSections" :key="section.key">
                <RouterLink 
                    :to="section.route"
                    class="block p-6 bg-white dark:bg-gray-1000 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                >
                    <div class="flex flex-col h-full">
                        <div class="mb-4">
                            <!-- All properties are now consistently available on the 'section' object -->
                            <span class="inline-flex items-center justify-center p-3 rounded-lg" :class="section.iconBgClass">
                                <component :is="section.icon" class="size-6" />
                            </span>
                        </div>
                        
                        <div class="flex-grow">
                            <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ section.title }}</h2>
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ section.description }}</p>
                        </div>

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