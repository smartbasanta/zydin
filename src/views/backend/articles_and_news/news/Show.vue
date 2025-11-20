<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { NewsUpdate } from "@/types";
import { CalendarIcon, GlobeIcon, LinkIcon } from "lucide-vue-next";
import { BackButton, EditButton, DeleteButton } from "@/components/button";
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const newsUpdate = ref<NewsUpdate | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const newsUpdateId = route.params.id as string;

const fetchDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/news/${newsUpdateId}`);
        newsUpdate.value = response.data.newsUpdate;
    } catch (err) {
        notifyError(err as any, "Failed to load details");
        router.push({ name: "dashboard.news.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchDetails);

const formatDate = (dateString: string | null) => new Date(dateString??'').toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
});

const handleDelete = async () => {
    if (!newsUpdate.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/news/${newsUpdate.value.id}`);
        router.push({ name: 'dashboard.news.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete post`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen font-poppins">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
			Loading details...
		</div>
		<div v-else-if="!newsUpdate" class="text-center py-12 text-lg">
			News/Update not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <div class="flex justify-end gap-3 mb-4">
                    <BackButton :to="{ name: 'dashboard.news.index' }" />
                    <EditButton v-if="newsUpdate.can?.update" :to="{ name: 'dashboard.news.edit', params: { id: newsUpdate.id } }" />
                    <DeleteButton v-if="newsUpdate.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                </div>

                <div class="bg-gray-100 dark:bg-gray-1100 rounded-2xl">
                    <span class="p-2 block text-center font-bold text-sm text-secondary-500"> {{ (newsUpdate.image_url) ? '' :'Image not set below will be the default image' }}</span>
                    <img :src="newsUpdate.image_url ?? zydinLogoImage"
                        :alt="newsUpdate.title" class="w-full h-64 object-cover rounded-lg mb-4">
                </div>
                <!-- <img v-if="newsUpdate.image_url" :src="newsUpdate.image_url" :alt="newsUpdate.title" class="w-full h-64 object-cover rounded-lg mb-4"> -->
				
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                    {{ newsUpdate.title }}
                </h1>
                
                <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mt-3">
                    <div class="flex items-center gap-2">
                        <GlobeIcon class="size-4" />
                        <span>Source: {{ newsUpdate.source || 'Internal' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <CalendarIcon class="size-4" />
                        <span>{{ formatDate(newsUpdate.publish_date) }}</span>
                    </div>
                     <a v-if="newsUpdate.link" :href="newsUpdate.link" target="_blank" class="flex items-center gap-2 link">
                        <LinkIcon class="size-4" />
                        <span>Read More</span>
                    </a>
                </div>

                <p v-if="newsUpdate.excerpt" class="mt-4 text-lg text-gray-700 dark:text-gray-300 italic">
					{{ newsUpdate.excerpt }}
				</p>
			</div>

            <div v-if="newsUpdate.full_content" class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <div class="prose dark:prose-invert max-w-none" v-html="newsUpdate.full_content"></div>
            </div>
		</div>
	</div>
</template>