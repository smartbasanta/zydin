<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import { CalendarIcon, ArrowLeftIcon } from 'lucide-vue-next'; // Assuming AnnounceIcon
import { useNewsAPI } from '@/composables/fetch-public-apis/useNewsAPI';

const route = useRoute();
const { newsUpdate, isLoading, fetchNewsUpdateBySlug } = useNewsAPI();

const fetchData = (slug: string) => fetchNewsUpdateBySlug(slug);

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
            <LoadingState message="Loading Update..." />
        </div>
        
        <div v-else-if="newsUpdate">
            <!-- Header -->
            <header class="py-20 bg-primary-50 dark:bg-primary-1100">
                <div class="container max-w-4xl px-4 mx-auto text-center">
                    <h1 class="text-3xl font-bold md:text-4xl font-grotesk text-primary-900 dark:text-white">{{ newsUpdate.title }}</h1>
                    <div class="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-gray-600 md:gap-6 dark:text-primary-400">
                        <div class="flex items-center gap-2">
                            <i class="i-lucide-megaphone w-4 h-4 text-secondary-600"></i>
                            <span>Source: {{ newsUpdate.source }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <CalendarIcon class="w-4 h-4 text-secondary-600" />
                            <span>Published on {{ formatDate(newsUpdate.publish_date) }}</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="container max-w-3xl px-4 py-16 mx-auto">
                <article class="prose dark:prose-invert lg:prose-lg max-w-none" v-html="newsUpdate.full_content"></article>
                
                 <div class="pt-12 mt-12 border-t border-primary-200 dark:border-primary-900">
                    <RouterLink :to="{ name: 'media.news' }" class="inline-flex items-center font-semibold transition-colors text-secondary-600 hover:text-secondary-500">
                        <ArrowLeftIcon class="w-5 h-5 mr-2" />
                        Back to All News
                    </RouterLink>
                </div>
            </main>
        </div>
        
        <div v-else class="py-40 text-center">
            <h1 class="text-2xl font-bold">News Update Not Found</h1>
        </div>
    </div>
</template>