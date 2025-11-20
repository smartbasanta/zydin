<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Article } from "@/types";
import { BookOpenIcon, CalendarIcon, UserIcon } from "lucide-vue-next";
import { BackButton, EditButton, DeleteButton } from "@/components/button";
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const article = ref<Article | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const articleId = route.params.id as string;

const fetchArticleDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/articles/${articleId}`);
        article.value = response.data.article;
    } catch (err) {
        notifyError(err as any, "Failed to load article details");
        router.push({ name: "dashboard.articles.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchArticleDetails);

const formatDate = (dateString: string | null) => new Date(dateString ?? '').toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
});

const handleDelete = async () => {
    if (!article.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/articles/${article.value.id}`);
        router.push({ name: 'dashboard.articles.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete article`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen font-poppins">
        <div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
            Loading article details...
        </div>
        <div v-else-if="!article" class="text-center py-12 text-lg">
            Article not found.
        </div>
        <div v-else class="container mx-auto space-y-6">
            <!-- Header -->
            <div
                class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <div class="flex justify-end gap-3 mb-4">
                    <BackButton :to="{ name: 'dashboard.articles.index' }" />
                    <EditButton v-if="article.can?.update"
                        :to="{ name: 'dashboard.articles.edit', params: { id: article.id } }" />
                    <DeleteButton v-if="article.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                </div>

                <div class="bg-gray-100 dark:bg-gray-1100 rounded-2xl">
                    <span class="p-2 block text-center font-bold text-sm text-secondary-500"> {{ (article.image_url) ? '' :'Image not set below will be the default image' }}</span>
                    <img :src="article.image_url ?? zydinLogoImage"
                        :alt="article.category" class="w-full h-64 object-cover rounded-lg mb-4">
                </div>
                <span
                    class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {{ article.category }}
                </span>

                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                    {{ article.title }}
                </h1>

                <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mt-3">
                    <div class="flex items-center gap-2">
                        <UserIcon class="size-4" />
                        <span>{{ article.author }} - {{ article.author_title }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <CalendarIcon class="size-4" />
                        <span>{{ formatDate(article.publish_date) }}</span>
                    </div>
                </div>

                <p v-if="article.excerpt" class="mt-4 text-lg text-gray-700 dark:text-gray-300 italic">
                    {{ article.excerpt }}
                </p>
            </div>

            <!-- Content -->
            <div
                class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <div class="prose dark:prose-invert max-w-none" v-html="article.content"></div>
            </div>
        </div>
    </div>
</template>