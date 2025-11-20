<script setup lang="ts">
import type { Article } from '@/types';
import { CalendarIcon, ArrowRightIcon } from 'lucide-vue-next';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
defineProps<{
    article: Article;
}>();

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) { return dateString; }
};
</script>

<template>
    <article
        class="group relative flex flex-col bg-gray-300/50 dark:bg-gray-1100 border border-gray-200 dark:border-gray-1000 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-xl">
        <div class="aspect-video overflow-hidden">
            <img :src="article.image_url ?? zydinLogoImage" :alt="article.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div class="p-6 flex flex-col flex-grow">
            <div class="mb-3">
                <span
                    class="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 inline-block px-2 py-1 rounded">{{
                    article.category }}</span>
            </div>
            <h2 class="text-xl font-bold mb-3 flex-grow">
                <RouterLink :to="`/media/articles/${article.slug}`"
                    class="hover:text-blue-600 dark:hover:text-blue-500">
                    {{ article.title }}
                </RouterLink>
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ article.excerpt }}</p>
            <div
                class="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-2">
                    <CalendarIcon class="w-4 h-4" />
                    <span>{{ formatDate(article.publish_date) }}</span>
                </div>
                <RouterLink :to="`/media/articles/${article.slug}`"
                    class="font-semibold text-blue-600 dark:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Read More
                    <ArrowRightIcon class="w-4 h-4" />
                </RouterLink>
            </div>
        </div>
    </article>
</template>