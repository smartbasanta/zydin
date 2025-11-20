<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Product } from "@/types";
import {
    CheckCircleIcon,
    XCircleIcon,
    PackageIcon,
    CalendarIcon,
    ClockIcon,
    BeakerIcon,
    PillIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    FlaskConicalIcon,
    InfoIcon,
    TagIcon,
    BuildingIcon
} from "lucide-vue-next";
    
import { 
    BackButton, 
    EditButton, 
    DeleteButton,
} from "@/components/button";
import DetailItem from "./partials/DetailItem.vue";
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages(); // 2. Get the images you need

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const activeTab = ref('details');
const productId = route.params.id as string;

const fetchProductDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/products/${productId}`);
        product.value = response.data.product;
    } catch (err) {
        notifyError(err as any, "Failed to load product details");
        router.push({ name: "dashboard.products.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchProductDetails);

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric", month: "long", day: "numeric",
    });
};

const handleDelete = async () => {
    if (!product.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/products/${product.value.id}`);
        router.push({ name: 'dashboard.products.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete product`);
    } finally {
        isDeleting.value = false;
    }
};

// Computed property for dynamic title based on product type
const typeSpecificTitle = computed(() => {
    return product.value?.type === 'ff' ? 'Formulation Details' : 'API Specifications';
});

// Helper component for displaying detail items to reduce repetition
// const DetailItem = {
//   props: ['label', 'value'],
//   template: `
//     <div>
//       <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</dt>
//       <dd class="mt-1 text-sm text-gray-900 dark:text-gray-50">{{ value || 'N/A' }}</dd>
//     </div>
//   `
// };
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-1100 font-sans">
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
            <p class="text-lg animate-pulse text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
        <div v-else-if="!product" class="flex justify-center items-center h-screen">
            <p class="text-lg text-gray-700 dark:text-gray-300">Product not found.</p>
        </div>
        <div v-else class="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            <!-- =================================== -->
            <!-- Header Section                      -->
            <!-- =================================== -->
            <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <BackButton :to="{ name: 'dashboard.products.index' }" class="mb-2" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <PillIcon v-if="product.type === 'ff'" class="size-8 text-purple-500" />
                        <BeakerIcon v-else class="size-8 text-blue-500" />
                        <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                        Product Name: <span class="font-semibold uppercase text-gray-700 dark:text-gray-50 text-2xl">{{ product.name }}</span>
                    </p>
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Product Type: <span class="font-semibold uppercase text-gray-700 dark:text-gray-200">{{ product.type }}</span>
                    </p>
                </div>
                <div class="flex items-center gap-3 self-start sm:self-center">
                    <EditButton v-if="product.can?.update" :to="{ name: 'dashboard.products.edit', params: { id: product.id } }" />
                    <DeleteButton v-if="product.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                </div>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- =================================== -->
                <!-- Main Content Section (Tabs)       -->
                <!-- =================================== -->
                <main class="lg:col-span-2 space-y-8">
                    <!-- Product Image & Description Card -->
                    <div class="bg-white dark:bg-gray-1000 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="bg-gray-100 dark:bg-gray-700">
                            <span class="p-2 block text-center font-bold text-sm text-secondary-500"> {{ product.image_url? '':'Image not set below will be the default image' }}</span>
                             <img :src="product.image_url ?? (product.type === 'api' ? defaultProductAPIImage : defaultProductFFImage)" :alt="product.name" class="w-full h-64 object-cover">
                        </div>
                        <div class="p-6">
                            <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                                <InfoIcon class="size-5" />
                                Description
                            </h2>
                            <p v-if="product.description" class="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {{ product.description }}
                            </p>
                             <p v-else class="text-gray-500 dark:text-gray-400 italic">No description provided.</p>
                        </div>
                    </div>

                    <!-- Tabs for Detailed Info -->
                    <div class="bg-white dark:bg-gray-1000 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div class="border-b border-gray-200 dark:border-gray-700">
                            <nav class="-mb-px flex gap-6 px-6" aria-label="Tabs">
                                <button @click="activeTab = 'details'" :class="['shrink-0 border-b-2 px-1 py-4 text-sm font-medium', activeTab === 'details' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200']">
                                    {{ typeSpecificTitle }}
                                </button>
                                <button v-if="product.pharmacology" @click="activeTab = 'pharma'" :class="['shrink-0 border-b-2 px-1 py-4 text-sm font-medium', activeTab === 'pharma' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200']">
                                    Pharmacology
                                </button>
                                <button v-if="product.safety_precaution" @click="activeTab = 'safety'" :class="['shrink-0 border-b-2 px-1 py-4 text-sm font-medium', activeTab === 'safety' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200']">
                                    Safety Precautions
                                </button>
                            </nav>
                        </div>
                        
                        <!-- Tab Panels -->
                        <div class="p-6">
                            <!-- Details Tab -->
                            <div v-show="activeTab === 'details'">
                                <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <template v-if="product.type === 'ff'">
                                        <DetailItem label="Generic Name" :value="product.generic_name" />
                                        <DetailItem label="Therapeutic Area" :value="product.therapeutic_area" />
                                        <DetailItem label="Dosage Form" :value="product.dosage_form" />
                                        <DetailItem label="Strength" :value="product.strength" />
                                        <DetailItem label="Indications" :value="product.indications" />
                                    </template>
                                    <template v-if="product.type === 'api'">
                                        <DetailItem label="CAS Number" :value="product.cas_number" />
                                        <DetailItem label="Category" :value="product.category" />
                                        <DetailItem label="Molecular Formula" :value="product.molecular_formula" />
                                        <DetailItem label="Molecular Weight" :value="product.molecular_weight" />
                                    </template>
                                </dl>
                            </div>
                             <!-- Pharmacology Tab -->
                            <div v-show="activeTab === 'pharma'" class="prose prose-sm dark:prose-invert max-w-none">
                                <p>{{ product.pharmacology }}</p>
                            </div>
                            <!-- Safety Tab -->
                             <div v-show="activeTab === 'safety'" class="prose prose-sm dark:prose-invert max-w-none">
                                <p>{{ product.safety_precaution }}</p>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- =================================== -->
                <!-- Sidebar Section                   -->
                <!-- =================================== -->
                <aside class="space-y-6">
                    <!-- Key Info Card -->
                    <div class="bg-white dark:bg-gray-1000 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-700 pb-3">
                            Key Information
                        </h3>
                        <div class="space-y-4">
                           <div class="flex items-start gap-3">
                                <BuildingIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Brand</p>
                                    <p class="text-sm text-gray-900 dark:text-gray-50 font-semibold">{{ product.brand?.name || 'N/A' }}</p>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <TagIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                                    <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', product.is_featured ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200']">
                                        {{ product.is_featured ? 'Featured' : 'Standard' }}
                                    </span>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <CalendarIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Date Created</p>
                                    <p class="text-sm text-gray-900 dark:text-gray-50">{{ formatDate(product.created_at) }}</p>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <ClockIcon class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                                    <p class="text-sm text-gray-900 dark:text-gray-50">{{ formatDate(product.updated_at) }}</p>
                                </div>
                           </div>
                        </div>
                    </div>
                    <!-- Prescription Card -->
                    <div v-if="product.prescribtion" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                           <BookOpenIcon class="size-5" />
                           Prescription Details
                        </h3>
                        <div class="prose prose-sm dark:prose-invert max-w-none">
                            <p>{{ product.prescribtion }}</p>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    </div>
</template>