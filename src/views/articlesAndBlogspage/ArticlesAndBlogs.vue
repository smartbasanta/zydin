<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { RouterLink } from 'vue-router';
import { useArticlesAPI } from '@/composables/fetch-public-apis/useArticlesAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
const { articles, pagination, availableCategories, activeFilters, isLoading, fetchArticles } = useArticlesAPI();

onMounted(fetchArticles);

// Separate the first item (latest featured or just latest) to be the hero
const featuredArticle = computed(() => articles.value?.[0]);
const standardArticles = computed(() => articles.value?.slice(1));

const formatDate = (dateString: string | null) => {
    if(dateString === null) return 'Article is not published yet.'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

// When the category filter changes, reset to page 1 and refetch
watch(() => activeFilters.category, () => {
    activeFilters.page = 1;
    fetchArticles();
});
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Page Header -->
        <section class="py-20 text-center text-white bg-primary-900 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk">Industry Insights & Research</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-primary-200">
                    Exploring the frontiers of oncology, from laboratory breakthroughs to patient care innovations.
                </p>
            </div>
        </section>

        <!-- Main Content -->
        <main class="container px-4 py-16 mx-auto sm:py-20">
            <div v-if="isLoading && !articles.length" class="flex items-center justify-center h-96">
                <LoadingState message="Loading Insights..." />
            </div>

            <div v-else-if="articles.length > 0">
                <!-- Featured Article Section -->
                <section v-if="featuredArticle" class="mb-20 bg-secondary-450 rounded-4xl">
                    <RouterLink :to="{ name: 'media.articles-detail', params: { slug: featuredArticle.slug } }"
                        class="block overflow-hidden rounded-lg shadow-xl group wow animate__animated animate__fadeInUp">
                        <div class="grid lg:grid-cols-2">
                            <div class="relative min-h-[300px]">
                                <img :src="featuredArticle.image_url ?? zydinLogoImage" :alt="featuredArticle.title"
                                    class="absolute inset-0 object-cover w-full h-full">
                            </div>
                            <div class="flex flex-col justify-center p-8 bg-white lg:p-12 dark:bg-primary-1000">
                                <p class="mb-2 text-sm font-semibold tracking-wider uppercase text-secondary-600 dark:text-secondary-400">
                                    {{ featuredArticle.category }}
                                </p>
                                <h2 class="mb-4 text-3xl font-bold font-grotesk text-primary-900 dark:text-white group-hover:text-secondary-700">
                                    {{ featuredArticle.title }}
                                </h2>
                                <p class="mb-6 text-gray-600 dark:text-primary-300 line-clamp-3">{{ featuredArticle.excerpt }}</p>
                                <div class="text-sm text-gray-500 dark:text-primary-400">
                                    <span>By {{ featuredArticle.author }}</span> &bull;
                                    <span>{{ formatDate(featuredArticle.publish_date) }}</span>
                                </div>
                            </div>
                        </div>
                    </RouterLink>
                </section>

                <!-- Filters and Grid -->
                <section>
                    <div class="flex flex-col items-center justify-between gap-4 pb-8 mb-8 border-b md:flex-row border-primary-200 dark:border-primary-900">
                        <h3 class="text-2xl font-bold font-grotesk text-primary-900 dark:text-white">Latest Articles</h3>
                        <div class="flex items-center gap-2">
                            <label for="category-filter" class="text-sm font-medium text-gray-600 dark:text-primary-300">Filter by:</label>
                            <select id="category-filter" v-model="activeFilters.category" class="input !py-2 !text-sm">
                                <option value="">All Categories</option>
                                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                        <div v-for="(article, index) in standardArticles" :key="article.id" 
                             class="wow animate__animated animate__fadeInUp" 
                             :data-wow-delay="`${index * 0.1}s`">
                            <RouterLink :to="{ name: 'media.articles-detail', params: { slug: article.slug } }" class="block group">
                                <div class="mb-4 w-50 overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                                    <img :src="article.image_url || zydinLogoImage" :alt="article.title"
                                        class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105">
                                </div>
                                <p class="mb-2 text-sm font-semibold text-secondary-600 dark:text-secondary-400">{{ article.category }}</p>
                                <h3 class="mb-2 text-xl font-bold font-grotesk text-primary-900 dark:text-white group-hover:text-secondary-700 line-clamp-2">
                                    {{ article.title }}
                                </h3>
                                <div class="text-sm text-gray-500 dark:text-primary-400">
                                    <span>{{ formatDate(article.publish_date) }}</span>
                                </div>
                            </RouterLink>
                        </div>
                    </div>
                    <!-- Pagination would go here -->
                </section>
            </div>
            
            <div v-else class="text-center py-20 text-gray-500">
                <p>No articles found. Please check back later.</p>
            </div>
        </main>
    </div>
</template>