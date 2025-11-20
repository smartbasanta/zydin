<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Brand } from "@/types";
import {
    CheckCircleIcon, XCircleIcon, CalendarIcon, ClockIcon, BuildingIcon,
    InfoIcon, PackageIcon, TagIcon, PillIcon, BeakerIcon
} from "lucide-vue-next";
    
import { 
    BackButton, 
    EditButton, 
    DeleteButton,
} from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const brand = ref<Brand | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const brandId = route.params.id as string;

const fetchBrandDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/brands/${brandId}`);
        brand.value = response.data.brand;
    } catch (err) {
        notifyError(err as any, "Failed to load brand details");
        router.push({ name: "dashboard.brands.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchBrandDetails);

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric", month: "long", day: "numeric",
    });
};

const handleDelete = async () => {
    if (!brand.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/brands/${brand.value.id}`);
        router.push({ name: 'dashboard.brands.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete brand`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-1100 min-h-screen font-sans">
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
            <p class="text-lg animate-pulse text-gray-600 dark:text-gray-400">Loading brand details...</p>
        </div>
        <div v-else-if="!brand" class="flex justify-center items-center h-screen">
            <p class="text-lg text-gray-700 dark:text-gray-300">Brand not found.</p>
        </div>
        <div v-else class="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            <!-- =================================== -->
            <!-- Header Section                      -->
            <!-- =================================== -->
            <header>
                <BackButton :to="{ name: 'dashboard.brands.index' }" class="mb-4" />
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="flex items-center gap-4">
                        <div class="flex-shrink-0 flex items-center justify-center size-14 rounded-lg bg-gray-100 dark:bg-gray-1000">
                            <BuildingIcon class="size-8 text-gray-300" />
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                                {{ brand.name }}
                            </h1>
                             <p class="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                                ID: {{ brand.id }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 self-end sm:self-center">
                        <EditButton v-if="brand.can?.update" :to="{ name: 'dashboard.brands.edit', params: { id: brand.id } }" />
                        <DeleteButton v-if="brand.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- =================================== -->
                <!-- Main Content Section              -->
                <!-- =================================== -->
                <main class="lg:col-span-2 space-y-8">
                    <!-- Description Card -->
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <InfoIcon class="size-5" />
                            Description
                        </h2>
                        <div v-if="brand.description" class="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                            {{ brand.description }}
                        </div>
                        <p v-else class="text-gray-500 dark:text-gray-400 italic">No description provided for this brand.</p>
                    </div>

                    <!-- Associated Products Card -->
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                         <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <PackageIcon class="size-5" />
                            Associated Products
                        </h2>
                        <ul v-if="brand.products && brand.products.length > 0" class="space-y-3">
                            <li v-for="product in brand.products" :key="product.id">
                                <RouterLink :to="{ name: 'dashboard.products.show', params: { id: product.id } }" class="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                    <PillIcon v-if="product.type === 'ff'" class="size-6 text-purple-500 flex-shrink-0" />
                                    <BeakerIcon v-else class="size-6 text-blue-500 flex-shrink-0" />
                                    <div>
                                        <p class="font-semibold text-gray-800 dark:text-gray-100">{{ product.name }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ product.type }}</p>
                                    </div>
                                </RouterLink>
                            </li>
                        </ul>
                         <p v-else class="text-gray-500 dark:text-gray-400 italic">No products are currently associated with this brand.</p>
                    </div>
                </main>

                <!-- =================================== -->
                <!-- Sidebar Section                   -->
                <!-- =================================== -->
                <aside class="space-y-6">
                    <!-- Logo Card -->
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-base font-bold text-gray-800 dark:text-white mb-4">
                            Brand Logo
                        </h3>
                        <div v-if="brand.image_url" class="aspect-video bg-gray-50 dark:bg-gray-1000 rounded-md flex items-center justify-center p-2">
                            <img :src="brand.image_url" :alt="brand.name" class="max-h-full max-w-full object-contain">
                        </div>
                        <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic">No logo uploaded.</p>
                    </div>
                    
                    <!-- Key Info Card -->
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-base font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-700 pb-3">
                            Key Information
                        </h3>
                        <div class="space-y-4">
                           <div class="flex items-start gap-3">
                                <TagIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">URL Slug</p>
                                    <p class="text-sm text-gray-900 dark:text-gray-50 font-mono">{{ brand.slug }}</p>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <CheckCircleIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                                    <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', brand.is_featured ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200']">
                                        {{ brand.is_featured ? 'Featured' : 'Standard' }}
                                    </span>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <CalendarIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Date Created</p>
                                    <p class="text-sm text-gray-900 dark:text-gray-50">{{ formatDate(brand.created_at) }}</p>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <ClockIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                                    <p class="text-sm text-gray-900 dark:text-gray-50">{{ formatDate(brand.updated_at) }}</p>
                                </div>
                           </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    </div>
</template>