<script setup lang="ts">
import { onMounted } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { RouterLink } from 'vue-router';
import { ArrowRightIcon } from 'lucide-vue-next';
import { useNewsAPI } from '@/composables/fetch-public-apis/useNewsAPI';

const { newsUpdates, pagination, isLoading, fetchNewsUpdates } = useNewsAPI();

onMounted(fetchNewsUpdates);
const formatDate = (dateString: string | null) => {
    if (dateString === null) return 'Article is not published yet.'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Header -->
        <header class="py-20 text-center bg-primary-50 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk text-primary-900 dark:text-white">News & Updates
                </h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-gray-600 dark:text-primary-300">
                    The latest press releases, announcements, and official news from Zydin Biotech.
                </p>
            </div>
        </header>

        <!-- News Feed -->
        <main class="py-16 bg-white dark:bg-primary-1200 sm:py-20">
            <div v-if="isLoading" class="flex items-center justify-center h-64">
                <LoadingState message="Loading News..." />
            </div>

            <div v-else-if="newsUpdates.length > 0" class="container max-w-4xl px-4 mx-auto">
                <div class="space-y-10">
                    <template v-for="item in newsUpdates" :key="item.id">

                        <article
                            class="relative pl-6 border-l-2 group border-primary-200 dark:border-primary-900 wow animate__animated animate__fadeInUp">
                            <!-- Dot on timeline -->
                            <div
                                class="absolute w-4 h-4 -left-[9px] top-1 bg-white dark:bg-primary-1200 rounded-full border-2 border-primary-300 dark:border-primary-700 group-hover:border-secondary-500 group-hover:dark:border-secondary-500 transition-colors">
                            </div>

                            <RouterLink :to="{ name: 'media.news-detail', params: { slug: item.slug } }"
                                class="flex items-center justify-between mb-2 p-4 bg-primary-1250 rounded-2xl group-hover:border">
                                <div class="group-hover:scale-[1.02]">
                                    <div
                                        class="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-primary-400">
                                        <span class="font-semibold">{{ item.source }}</span>
                                        <time :datetime="item.publish_date ?? undefined">{{formatDate(item.publish_date)}}</time>
                                    </div>
                                    <h2 class="mb-3 text-2xl font-bold font-grotesk text-primary-900 dark:text-white">
                                        <RouterLink :to="{ name: 'media.news-detail', params: { slug: item.slug } }"
                                            class="transition-colors group-hover:text-secondary-700">
                                            {{ item.title }}
                                        </RouterLink>
                                    </h2>
                                    <p class="text-gray-600 dark:text-primary-300 line-clamp-3">{{ item.excerpt }}</p>
                                    <RouterLink :to="{ name: 'media.news-detail', params: { slug: item.slug } }"
                                        class="inline-flex items-center gap-2 mt-4 font-semibold text-secondary-600">
                                        Read More
                                        <ArrowRightIcon
                                            class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </RouterLink>
                                </div>
                            </RouterLink>
                        </article>
                    </template>
                    <!-- Pagination would go here -->
                </div>
            </div>

            <div v-else class="text-center py-20 text-gray-500">
                <p>No news updates found.</p>
            </div>
        </main>
    </div>
</template>