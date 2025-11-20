<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Testimonial } from "@/types";
import { StarIcon, UserSquare } from "lucide-vue-next";
import { BackButton, EditButton, DeleteButton } from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const testimonial = ref<Testimonial | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const testimonialId = route.params.id as string;

const fetchDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/testimonials/${testimonialId}`);
        testimonial.value = response.data.testimonial;
    } catch (err) {
        notifyError(err as any, "Failed to load details");
        router.push({ name: "dashboard.testimonials.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchDetails);

const handleDelete = async () => {
    if (!testimonial.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/testimonials/${testimonial.value.id}`);
        router.push({ name: 'dashboard.testimonials.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete testimonial`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">Loading details...</div>
		<div v-else-if="!testimonial" class="text-center py-12 text-lg">Testimonial not found.</div>
		<div v-else class="container mx-auto">
            <div class="flex justify-end gap-3 mb-4">
                <BackButton :to="{ name: 'dashboard.testimonials.index' }" />
                <EditButton v-if="testimonial.can?.update" :to="{ name: 'dashboard.testimonials.edit', params: { id: testimonial.id } }" />
                <DeleteButton v-if="testimonial.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
            </div>

            <div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 sm:p-8 border border-gray-150 dark:border-gray-1000">
                <div class="flex flex-col sm:flex-row items-center gap-6">
                    <img v-if="testimonial.avatar_url" :src="testimonial.avatar_url" :alt="testimonial.name" class="h-24 w-24 object-cover rounded-full border-4 border-gray-200 dark:border-gray-800">
                    <div v-else class="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-muted">
                        <UserSquare class="size-12" />
                    </div>
                    <div class="text-center sm:text-left">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50">{{ testimonial.name }}</h1>
                        <p class="text-md text-gray-600 dark:text-gray-400">{{ testimonial.role }}</p>
                         <div class="flex items-center justify-center sm:justify-start mt-2">
                            <StarIcon v-for="i in testimonial.rating" :key="i" class="h-5 w-5 text-yellow-400 fill-current" />
                            <StarIcon v-for="i in 5 - testimonial.rating" :key="i" class="h-5 w-5 text-gray-300 dark:text-gray-600" />
                        </div>
                    </div>
                </div>
                <blockquote class="mt-6 border-l-4 border-blue-500 pl-4">
                    <p class="text-lg italic text-gray-700 dark:text-gray-300">
                        "{{ testimonial.text }}"
                    </p>
                </blockquote>
            </div>
		</div>
	</div>
</template>