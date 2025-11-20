<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import { CalendarIcon, UserIcon, TagIcon, ArrowLeftIcon } from 'lucide-vue-next';
import { useArticlesAPI } from '@/composables/fetch-public-apis/useArticlesAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
const route = useRoute();
const { article, isLoading, fetchArticleBySlug } = useArticlesAPI();

const fetchData = (slug: string) => fetchArticleBySlug(slug);

onMounted(() => fetchData(route.params.slug as string));
watch(() => route.params.slug, (newSlug) => fetchData(newSlug as string));
const formatDate = (dateString: string | null) => {
    if(dateString === null) return 'Article is not published yet.'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <div v-if="isLoading" class="flex items-center justify-center h-screen">
            <LoadingState message="Loading Article..." />
        </div>
        
        <div v-else-if="article">
            <article>
                <!-- Article Header -->
                <header class="relative py-24 text-white bg-primary-1000">
                    <div class="absolute inset-0">
                        <img :src="article.image_url || zydinLogoImage" :alt="article.title" class="object-cover w-full h-full opacity-20">
                    </div>
                    <div class="container relative px-4 mx-auto text-center">
                        <p class="mb-4 font-semibold tracking-wider uppercase text-secondary-400">{{ article.category }}</p>
                        <h1 class="max-w-4xl mx-auto mb-6 text-4xl font-bold md:text-5xl font-grotesk">{{ article.title }}</h1>
                        <div class="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-primary-300 md:gap-6">
                            <div class="flex items-center gap-2">
                                <UserIcon class="w-4 h-4" />
                                <span>By {{ article.author }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <CalendarIcon class="w-4 h-4" />
                                <time :datetime="article.publish_date?? undefined">{{ formatDate(article.publish_date) }}</time>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Article Content -->
                <div class="container max-w-3xl px-4 py-16 mx-auto sm:py-20">
                    <!-- The rich text content from the database will be rendered here -->
                    <div class="prose lg:prose-lg dark:prose-invert max-w-none" v-html="article.content"></div>

                     <div class="pt-12 mt-12 border-t border-primary-200 dark:border-primary-900">
                        <RouterLink :to="{ name: 'media.articles' }" class="inline-flex items-center font-semibold transition-colors text-secondary-600 hover:text-secondary-500">
                            <ArrowLeftIcon class="w-5 h-5 mr-2" />
                            Back to All Articles
                        </RouterLink>
                    </div>
                </div>
            </article>
            <!-- A 'Related Articles' section could be added here if the API provides that data -->
        </div>

        <div v-else class="py-40 text-center">
            <h1 class="text-2xl font-bold">Article Not Found</h1>
        </div>
    </div>
</template>