<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import { CalendarIcon, ArrowLeftIcon, MegaphoneIcon, Share2Icon } from 'lucide-vue-next';
import { useNewsAPI } from '@/composables/fetch-public-apis/useNewsAPI';

const route = useRoute();
const { newsUpdate, isLoading, fetchNewsUpdateBySlug } = useNewsAPI();

const fetchData = (slug: string) => fetchNewsUpdateBySlug(slug);

onMounted(() => fetchData(route.params.slug as string));
watch(() => route.params.slug, (newSlug) => fetchData(newSlug as string));

const formatDate = (dateString: string | null) => {
    if(dateString === null) return 'Pending Publication'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};
</script>

<template>
    <div class="section-bg min-h-screen relative">
        <!-- Background Decor -->
        <div class="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/20 pointer-events-none"></div>

        <div v-if="isLoading" class="flex items-center justify-center h-screen">
            <LoadingState message="Loading Update..." />
        </div>
        
        <div v-else-if="newsUpdate" class="relative">
            <!-- Article Header -->
            <header class="relative pt-32 pb-32 overflow-hidden">
                <!-- Abstract Glows -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
                    <div class="absolute top-10 left-10 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
                    <div class="absolute bottom-10 right-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
                </div>

                <div class="container max-w-4xl px-6 mx-auto text-center relative z-10">
                    <!-- Breadcrumb / Back Link -->
                    <div class="mb-8 flex justify-center">
                        <RouterLink 
                            :to="{ name: 'media.news' }" 
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-muted text-sm font-semibold text-muted hover:text-primary-600 transition-colors"
                        >
                            <ArrowLeftIcon class="w-4 h-4" />
                            Back to Newsroom
                        </RouterLink>
                    </div>

                    <!-- Meta Badges -->
                    <div class="flex flex-wrap items-center justify-center gap-3 mb-6">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                            <MegaphoneIcon class="w-3.5 h-3.5" />
                            {{ newsUpdate.source }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-muted border border-muted">
                            <CalendarIcon class="w-3.5 h-3.5" />
                            {{ formatDate(newsUpdate.publish_date) }}
                        </span>
                    </div>

                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-grotesk section-title leading-tight text-shadow-sm">
                        {{ newsUpdate.title }}
                    </h1>
                </div>
            </header>

            <!-- Main Content Card -->
            <main class="container max-w-4xl px-4 mx-auto relative z-20 -mt-20 pb-24">
                <article class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-muted p-8 md:p-12 lg:p-16">
                    <!-- Content -->
                    <div 
                        class="prose prose-lg dark:prose-invert max-w-none 
                               prose-headings:font-grotesk prose-headings:section-title
                               prose-p:section-text prose-p:leading-relaxed
                               prose-a:text-secondary-600 hover:prose-a:text-secondary-500
                               prose-blockquote:border-l-4 prose-blockquote:border-secondary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                               prose-img:rounded-xl prose-img:shadow-lg section-title"
                        v-html="newsUpdate.full_content"
                    ></div>

                    <!-- Article Footer -->
                    <div class="mt-16 pt-8 border-t border-muted flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div class="text-sm text-muted">
                            Category: <span class="font-semibold text-primary-600">Press Release</span>
                        </div>
                        
                        <div class="flex items-center gap-4">
                            <span class="text-sm font-medium text-muted">Share this update:</span>
                            <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-muted hover:text-primary-600 transition-colors">
                                <Share2Icon class="w-5 h-5" />
                            </button>
                            <!-- Add more social icons as needed -->
                        </div>
                    </div>
                </article>
            </main>
        </div>
        
        <!-- Not Found State -->
        <div v-else class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-muted">
                <MegaphoneIcon class="w-8 h-8" />
            </div>
            <h1 class="text-2xl font-bold section-title mb-2">Update Not Found</h1>
            <p class="text-muted mb-6">The news article you are looking for does not exist or has been removed.</p>
            <RouterLink :to="{ name: 'media.news' }" class="btn btn-primary">
                Return to Newsroom
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.text-shadow-sm {
    text-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
</style>