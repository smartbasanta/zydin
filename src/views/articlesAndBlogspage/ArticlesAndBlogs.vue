<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { RouterLink } from 'vue-router';
import { useArticlesAPI } from '@/composables/fetch-public-apis/useArticlesAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';
import { CalendarIcon, UserIcon, ArrowRightIcon, SearchIcon } from 'lucide-vue-next';

const { zydinLogoImage } = useDefaultImages();
const { articles, availableCategories, activeFilters, isLoading, fetchArticles } = useArticlesAPI();

onMounted(fetchArticles);

const featuredArticle = computed(() => articles.value?.[0]);
const standardArticles = computed(() => articles.value?.slice(1));

const formatDate = (dateString: string | null) => {
    if(dateString === null) return 'Coming Soon'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

// Reset pagination when category changes
watch(() => activeFilters.category, () => {
    activeFilters.page = 1;
    fetchArticles();
});
</script>

<template>
    <div class="section-bg min-h-screen relative">
        <!-- Hero Section with Abstract Background -->
        <header class="relative pt-32 pb-20 overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div class="absolute -top-20 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]"></div>
                <div class="absolute top-40 -left-20 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div class="container px-6 mx-auto relative z-10 section-title text-center">
                <span class="inline-block py-1 px-3 rounded-full text-xs font-bold tracking-wider uppercase mb-6">
                    Research & Development
                </span>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold section-title mb-6 tracking-tight font-grotesk">
                    Industry Insights & Research
                </h1>
                <p class="max-w-2xl mx-auto text-lg md:text-xl section-text leading-relaxed">
                    Exploring the frontiers of oncology, from laboratory breakthroughs to patient care innovations.
                </p>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container px-6 pb-24 mx-auto relative z-10">
            <div v-if="isLoading && !articles.length" class="flex items-center justify-center h-96">
                <LoadingState message="Curating Insights..." />
            </div>

            <div v-else-if="articles.length > 0">
                
                <!-- Featured Article (Magazine Style) -->
                <section v-if="featuredArticle" class="mb-24">
                    <RouterLink 
                        :to="{ name: 'media.articles-detail', params: { slug: featuredArticle.slug } }"
                        class="group block relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-muted"
                    >
                        <div class="grid lg:grid-cols-12 gap-0 min-h-[450px] header-shell">
                            <!-- Image Side -->
                            <div class="lg:col-span-5 relative overflow-hidden h-[300px] lg:h-auto">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 lg:hidden"></div>
                                <img 
                                    :src="featuredArticle.image_url ?? zydinLogoImage" 
                                    :alt="featuredArticle.title"
                                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                >
                            </div>
                            
                            <!-- Content Side -->
                            <div class="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center backdrop-blur-xl">
                                <div class="flex items-center gap-3 mb-4">
                                    <span class="px-3 py-1 text-xs font-bold uppercase tracking-widest text-white bg-primary-600 rounded-full">
                                        Featured
                                    </span>
                                    <span class="text-xs font-semibold uppercase tracking-widest">
                                        {{ featuredArticle.category }}
                                    </span>
                                </div>
                                
                                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 mb-4 leading-tight group-hover:section-title transition-colors">
                                    {{ featuredArticle.title }}
                                </h2>
                                
                                <p class="text-muted mb-8 line-clamp-3 text-primary-600 md:text-lg">
                                    {{ featuredArticle.excerpt }}
                                </p>
                                
                                <div class="mt-auto flex items-center justify-between border-t border-muted pt-6">
                                    <div class="flex items-center gap-4 text-sm section-title">
                                        <div class="flex items-center gap-1.5">
                                            <UserIcon class="w-4 h-4" />
                                            <span>{{ featuredArticle.author }}</span>
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <CalendarIcon class="w-4 h-4" />
                                            <span>{{ formatDate(featuredArticle.publish_date) }}</span>
                                        </div>
                                    </div>
                                    <span class="flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                                        Read Article <ArrowRightIcon class="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </RouterLink>
                </section>

                <!-- Filtering Bar -->
                <div class="sticky top-24 z-30 mb-12 header-bg backdrop-blur-md p-2 py-4 rounded-2xl border border-muted shadow-sm">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                        <!-- Category Tabs -->
                        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                            <button 
                                @click="activeFilters.category = ''"
                                class="filter-pill"
                                :class="{ 'active': activeFilters.category === '' }"
                            >
                                All View
                            </button>
                            <button 
                                v-for="cat in availableCategories" 
                                :key="cat" 
                                @click="activeFilters.category = cat"
                                class="filter-pill"
                                :class="{ 'active': activeFilters.category === cat }"
                            >
                                {{ cat }}
                            </button>
                        </div>

                        <!-- Search (Visual Placeholder/Future Feature) -->
                        <div class="relative hidden md:block">
                            <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input type="text" placeholder="Search articles..." class="pl-9 pr-4 py-2 rounded-xl section-bg border-none text-sm focus:ring-2 focus:ring-primary-500 section-title w-64" disabled>
                        </div>
                    </div>
                </div>

                <!-- Articles Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    <div 
                        v-for="(article, index) in standardArticles" 
                        :key="article.id" 
                        class="group flex flex-col h-full auth-card hover:scale-105"
                    >
                        <RouterLink :to="{ name: 'media.articles-detail', params: { slug: article.slug } }" class="block relative overflow-hidden rounded-2xl mb-5 aspect-[16/10]">
                            <img 
                                :src="article.image_url || zydinLogoImage" 
                                :alt="article.title"
                                class="object-cover w-full h-full transition-transform duration-500"
                                loading="lazy"
                            >
                            <div class="absolute top-4 left-4">
                                <span class="px-3 py-1 text-xs font-bold bg-white/90 dark:bg-black/80 backdrop-blur-sm text-primary-600 rounded-full shadow-sm">
                                    {{ article.category }}
                                </span>
                            </div>
                        </RouterLink>

                        <div class="flex-1 flex flex-col p-4">
                            <div class="flex items-center gap-3 text-xs font-medium text-muted mb-3">
                                <span class="flex items-center gap-1">
                                    <CalendarIcon class="w-3.5 h-3.5" />
                                    {{ formatDate(article.publish_date) }}
                                </span>
                                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{{ article.author }}</span>
                            </div>

                            <h3 class="text-xl font-bold section-title mb-3 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                                <RouterLink :to="{ name: 'media.articles-detail', params: { slug: article.slug } }">
                                    {{ article.title }}
                                </RouterLink>
                            </h3>

                            <p class="text-muted text-sm line-clamp-3 mb-4 flex-grow">
                                {{ article.excerpt }}
                            </p>

                            <RouterLink 
                                :to="{ name: 'media.articles-detail', params: { slug: article.slug } }" 
                                class="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mt-auto"
                            >
                                Read More <ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </RouterLink>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-32 text-center">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <SearchIcon class="w-10 h-10 text-muted" />
                </div>
                <h3 class="text-xl font-bold section-title mb-2">No Insights Found</h3>
                <p class="text-muted max-w-md">We couldn't find any articles matching your criteria. Try selecting a different category.</p>
            </div>
        </main>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Styling for the category filter pills */
.filter-pill {
    @apply px-5 py-2 rounded-xl footer-text text-sm font-medium transition-all duration-200 whitespace-nowrap;
    color: var();
    background-color: transparent;
}

.filter-pill:hover {
    /* color: var(--section-title-color); */
    background-color: color-mix(in srgb, var(--color-primary-500) 50%, transparent);
}

.filter-pill.active {
    @apply shadow-md;
    background-color: var(--color-primary-600);
    color: white;
}
:global(.dark) .filter-pill.active {
    background-color: var(--color-primary-500);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>