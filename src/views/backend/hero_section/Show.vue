<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { HeroSlide } from "@/types";
import { BackButton, EditButton, DeleteButton } from "@/components/button";
import { CheckCircleIcon, XCircleIcon } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const heroSlide = ref<HeroSlide | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const heroSlideId = route.params.id as string;

const fetchDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/hero-slides/${heroSlideId}`);
        heroSlide.value = response.data.heroSlide;
    } catch (err) {
        notifyError(err as any, "Failed to load slide details");
        router.push({ name: "dashboard.hero-slides.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchDetails);

const handleDelete = async () => {
    if (!heroSlide.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/hero-slides/${heroSlide.value.id}`);
        router.push({ name: 'dashboard.hero-slides.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete slide`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
			Loading slide details...
		</div>
		<div v-else-if="!heroSlide" class="text-center py-12 text-lg">
			Hero Slide not found.
		</div>
		<div v-else class="container mx-auto">
            <div class="flex justify-end gap-3 mb-4">
                <BackButton :to="{ name: 'dashboard.hero-slides.index' }" />
                <EditButton v-if="heroSlide.can?.update" :to="{ name: 'dashboard.hero-slides.edit', params: { id: heroSlide.id } }" />
                <DeleteButton v-if="heroSlide.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
            </div>

            <div 
                v-if="heroSlide.image_url"
                class="relative bg-gray-800 rounded-xl shadow-md border border-gray-150 dark:border-gray-1000 overflow-hidden min-h-[50vh] flex items-center justify-center p-8 text-center"
            >
                <img :src="heroSlide.image_url" :alt="heroSlide.title" class="absolute inset-0 w-full h-full object-cover z-0 opacity-30">
                <div class="relative z-10 text-white">
                    <h1 class="text-4xl font-bold drop-shadow-lg">{{ heroSlide.title }}</h1>
                    <p v-if="heroSlide.description" class="mt-2 text-xl max-w-2xl mx-auto drop-shadow-md">
                        {{ heroSlide.description }}
                    </p>
                    <a v-if="heroSlide.link_url && heroSlide.link_text" :href="heroSlide.link_url" target="_blank" class="btn btn-primary btn-lg mt-6">
                        {{ heroSlide.link_text }}
                    </a>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000 mt-6">
                <h2 class="font-bold text-xl mb-4">Configuration Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Display Order</p>
                        <p class="text-lg font-semibold text-gray-900 dark:text-gray-50">{{ heroSlide.order_column }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <p class="text-lg font-semibold text-gray-900 dark:text-gray-50 inline-flex items-center gap-2">
                             <span v-if="heroSlide.is_active" class="status-badge-success text-base"><CheckCircleIcon class="size-4" /> Active</span>
                            <span v-else class="status-badge-gray text-base"><XCircleIcon class="size-4" /> Inactive</span>
                        </p>
                    </div>
                </div>
            </div>
		</div>
	</div>
</template>