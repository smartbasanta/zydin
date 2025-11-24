<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import { CalendarIcon, UserIcon, ArrowLeftIcon, ClockIcon, Share2Icon, BookmarkIcon } from 'lucide-vue-next';
import { useArticlesAPI } from '@/composables/fetch-public-apis/useArticlesAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages();
const route = useRoute();
const { article, isLoading, fetchArticleBySlug } = useArticlesAPI();

const fetchData = (slug: string) => fetchArticleBySlug(slug);

onMounted(() => fetchData(route.params.slug as string));
watch(() => route.params.slug, (newSlug) => fetchData(newSlug as string));

const formatDate = (dateString: string | null) => {
    if(dateString === null) return 'Pending'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

// Calculate estimated read time based on word count (avg 200 wpm)
const readTime = computed(() => {
    if (!article.value?.content) return '1 min read';
    const words = article.value.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
});
</script>

<template>
    <div class="section-bg min-h-screen relative">
        <div v-if="isLoading" class="flex items-center justify-center h-screen">
            <LoadingState message="Loading Article..." />
        </div>
        
        <div v-else-if="article" class="pb-24">
            <!-- Immersive Hero Header -->
            <header class="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <!-- Background Image with Blur/Overlay -->
                <div class="absolute inset-0">
                    <img 
                        :src="article.image_url || zydinLogoImage" 
                        :alt="article.title" 
                        class="w-full h-full object-cover transition-transform duration-[20s] hover:scale-110"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 backdrop-blur-[2px]"></div>
                </div>

                <!-- Navigation (Absolute Top) -->
                <div class="absolute top-24 left-0 w-full px-6 z-20">
                    <div class="container mx-auto">
                        <RouterLink 
                            :to="{ name: 'media.articles' }" 
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
                        >
                            <ArrowLeftIcon class="w-4 h-4" />
                            Back to Insights
                        </RouterLink>
                    </div>
                </div>

                <!-- Hero Content -->
                <div class="absolute bottom-0 left-0 w-full pb-24 px-6 z-10">
                    <div class="container max-w-4xl mx-auto text-center">
                        <span class="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase text-white bg-secondary-500 rounded-full shadow-lg shadow-secondary-500/20">
                            {{ article.category }}
                        </span>
                        
                        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-grotesk text-white leading-tight mb-8 text-shadow-md">
                            {{ article.title }}
                        </h1>

                        <!-- Meta Data Bar -->
                        <div class="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/80">
                            <div class="flex items-center gap-2">
                                <div class="p-1 bg-white/10 rounded-full">
                                    <UserIcon class="w-4 h-4 text-secondary-400" />
                                </div>
                                <span>{{ article.author }}</span>
                            </div>
                            <div class="w-1 h-1 rounded-full bg-white/30"></div>
                            <div class="flex items-center gap-2">
                                <CalendarIcon class="w-4 h-4" />
                                <time :datetime="article.publish_date ?? undefined">{{ formatDate(article.publish_date) }}</time>
                            </div>
                            <div class="w-1 h-1 rounded-full bg-white/30"></div>
                            <div class="flex items-center gap-2">
                                <ClockIcon class="w-4 h-4" />
                                <span>{{ readTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Card (Floating Overlap) -->
            <main class="container max-w-4xl px-4 mx-auto relative z-20 -mt-16">
                <div class="section-bg rounded-3xl shadow-2xl border border-muted p-8 md:p-12 lg:p-16">
                    
                    <!-- Article Body -->
                    <article 
                        class="prose prose-lg dark:prose-invert max-w-none
                               prose-headings:font-grotesk prose-headings:text-primary-900 dark:prose-headings:text-white
                               prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                               prose-a:text-secondary-600 hover:prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline
                               prose-blockquote:border-l-4 prose-blockquote:border-secondary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
                               prose-img:rounded-2xl prose-img:shadow-lg prose-img:w-full section-title"
                        v-html="article.content"
                    ></article>

                    <!-- Article Footer / Share -->
                    <div class="mt-16 pt-8 border-t border-muted flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div class="section-title font-medium text-sm">
                            Thanks for reading!
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <button class="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors" title="Share Article">
                                <Share2Icon class="w-5 h-5" />
                            </button>
                            <button class="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-colors" title="Save for Later">
                                <BookmarkIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Not Found State -->
        <div v-else class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-muted">
                <ArrowLeftIcon class="w-8 h-8" />
            </div>
            <h1 class="text-3xl font-bold section-title mb-2">Article Not Found</h1>
            <p class="text-muted mb-8 text-lg">The article you are looking for might have been removed or is temporarily unavailable.</p>
            <RouterLink :to="{ name: 'media.articles' }" class="btn btn-primary">
                Back to Insights
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.text-shadow-md {
    text-shadow: 0 2px 15px rgba(0,0,0,0.3);
}
</style>