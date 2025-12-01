<script setup lang="ts">
import { ref, onMounted, computed, type Component as VueComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import LoadingState from '@/components/loading/LoadingState.vue'; // Reuse your loading component

// Lucide Icons
import { 
    LayoutTemplate, 
    Building2, 
    ArrowRight,
    Component as IconComponent,
    Images,
    FileText,
    Megaphone,
    Users
} from 'lucide-vue-next';

interface UnifiedSection {
    key: string;
    title: string;
    description: string;
    icon: VueComponent;
    route: {
        name: string;
        params?: { [key: string]: string };
    };
    // We can derive the color theme from the key or assign it directly
    theme: 'blue' | 'purple' | 'green' | 'orange' | 'gray'; 
}

interface ManagablePage {
    slug: string;
    title: string;
    description: string;
}

const dynamicSections = ref<ManagablePage[]>([]);
const isLoading = ref(true);

const staticSections = [
    {
        key: 'hero-slides',
        title: 'Hero Slides',
        description: 'Manage the main rotating banner and key messages on the homepage.',
        routeName: 'dashboard.hero-slides.index',
        theme: 'blue'
    },
    {
        key: 'gallery',
        title: 'Photo Galleries',
        description: 'Curate images for "Company Culture", "CSR", and other visual sections.',
        routeName: 'dashboard.gallery.index',
        theme: 'green'
    }
];

// --- Helper to assign icons based on slug ---
const getIconForSlug = (slug: string) => {
    switch (slug) {
        case 'homepage': return LayoutTemplate;
        case 'about-us': return Building2;
        case 'hero-slides': return LayoutTemplate;
        case 'gallery': return Images;
        case 'articles': return FileText;
        case 'news': return Megaphone;
        case 'careers': return Users;
        default: return IconComponent;
    }
};

// --- Helper to assign theme colors based on slug (optional) ---
const getThemeForSlug = (slug: string): UnifiedSection['theme'] => {
    switch (slug) {
        case 'homepage': return 'blue';
        case 'about-us': return 'purple';
        case 'gallery': return 'green';
        default: return 'gray';
    }
};

const fetchManagablePages = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/dashboard/page-content');
        dynamicSections.value = response.data.pages;
    } catch (error) {
        console.error("Failed to fetch manageable pages:", error);
    } finally {
        isLoading.value = false;
    }
};

const combinedSections = computed<UnifiedSection[]>(() => {
    // 1. Map the dynamically fetched pages
    const mappedDynamic = dynamicSections.value.map(page => ({
        key: page.slug,
        title: page.title,
        description: page.description,
        icon: getIconForSlug(page.slug),
        theme: getThemeForSlug(page.slug),
        route: { 
            name: 'dashboard.page.content.manage', 
            params: { pageSlug: page.slug } 
        }
    }));

    // 2. Map the static sections
    const mappedStatic = staticSections.map(s => ({
        key: s.key,
        title: s.title,
        description: s.description,
        icon: getIconForSlug(s.key),
        theme: s.theme as UnifiedSection['theme'],
        // FIX: Construct the 'route' object expected by the interface
        // instead of passing 'routeName' string.
        route: { 
            name: s.routeName 
        }
    }));

    return [...mappedStatic, ...mappedDynamic];
});

onMounted(fetchManagablePages);

// --- Theme Classes Mapping ---
// This keeps the template clean and allows for easy theme updates
const themeClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};
</script>

<template>
    <div class="p-6 md:p-8 space-y-8">
        <!-- Header -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold section-title">Page Content</h1>
                <p class="text-muted mt-1">Select a section below to manage its content and configuration.</p>
            </div>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading && combinedSections.length === 0" class="h-64 flex items-center justify-center">
            <LoadingState message="Loading Sections..." />
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <RouterLink 
                v-for="section in combinedSections" 
                :key="section.key"
                :to="section.route"
                class="content-card group"
            >
                <div class="flex flex-col h-full p-6">
                    <!-- Icon Header -->
                    <div class="flex justify-between items-start mb-4">
                        <span class="inline-flex items-center justify-center p-3 rounded-xl transition-colors" :class="themeClasses[section.theme]">
                            <component :is="section.icon" class="w-6 h-6" />
                        </span>
                        <!-- Arrow Icon that slides on hover -->
                        <ArrowRight class="w-5 h-5 text-muted group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-grow">
                        <h2 class="text-lg font-bold section-title mb-2 group-hover:text-primary-600 transition-colors">
                            {{ section.title }}
                        </h2>
                        <p class="text-sm text-muted leading-relaxed">
                            {{ section.description }}
                        </p>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.content-card {
    @apply block rounded-2xl border overflow-hidden transition-all duration-300;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-sm);
}

.content-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-300);
}
:global(.dark) .content-card:hover {
    border-color: var(--color-primary-600);
}
</style>