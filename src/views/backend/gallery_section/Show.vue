<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { GalleryImage } from "@/types";
import { BackButton, EditButton, DeleteButton } from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const galleryImage = ref<GalleryImage | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const galleryImageId = route.params.id as string;

const fetchDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/gallery/${galleryImageId}`);
        galleryImage.value = response.data.galleryImage;
    } catch (err) {
        notifyError(err as any, "Failed to load image details");
        router.push({ name: "dashboard.gallery.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchDetails);

const handleDelete = async () => {
    if (!galleryImage.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/gallery/${galleryImage.value.id}`);
        router.push({ name: 'dashboard.gallery.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete image`);
    } finally {
        isDeleting.value = false;
    }
};
</script>
<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">Loading details...</div>
		<div v-else-if="!galleryImage" class="text-center py-12 text-lg">Image not found.</div>
		<div v-else class="container mx-auto">
            <div class="flex justify-end gap-3 mb-4">
                <BackButton :to="{ name: 'dashboard.gallery.index' }" />
                <EditButton v-if="galleryImage.can?.update" :to="{ name: 'dashboard.gallery.edit', params: { id: galleryImage.id } }" />
                <DeleteButton v-if="galleryImage.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
            </div>

            <div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <img v-if="galleryImage.image_url" :src="galleryImage.image_url" :alt="galleryImage.alt_text || galleryImage.caption || 'Gallery Image'" class="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-4">
                
                <div class="text-center">
                    <h1 v-if="galleryImage.caption" class="text-2xl font-bold text-gray-900 dark:text-gray-50">{{ galleryImage.caption }}</h1>
                    <p v-if="galleryImage.alt_text" class="text-sm text-gray-500 dark:text-gray-400 mt-1">Alt Text: {{ galleryImage.alt_text }}</p>
                    <p class="text-md text-gray-600 dark:text-gray-300 mt-2">
                        Group: <span class="font-semibold capitalize">{{ galleryImage.gallery_group?.replace('_', ' ') }}</span> | Order: <span class="font-semibold">{{ galleryImage.order_column }}</span>
                    </p>
                </div>
            </div>
		</div>
	</div>
</template>