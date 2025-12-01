<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Brand } from "@/types";
import { useDefaultImages } from '@/composables/useDefaultImages';
import {
    CheckCircleIcon, 
    XCircleIcon, 
    CalendarIcon, 
    ClockIcon, 
    BuildingIcon,
    InfoIcon, 
    PackageIcon, 
    TagIcon, 
    PillIcon, 
    BeakerIcon,
    ArrowLeftIcon,
    ImageIcon
} from "lucide-vue-next";
    
import { 
    EditButton, 
    DeleteModel 
} from "@/components/button";
import LoadingState from '@/components/card/LoadingState.vue';
import BackButton from "@/components/button/BackButton.vue";

const { zydinLogoImage } = useDefaultImages(); // Ensure you have a default brand image
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const brand = ref<Brand | null>(null);
const isLoading = ref(true);
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
        year: "numeric", month: "short", day: "numeric"
    });
};

const handleDeleted = () => {
    router.push({ name: 'dashboard.brands.index' });
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-screen">
        
        <LoadingState v-if="isLoading" message="Loading brand details..." />
        
        <div v-else-if="!brand" class="flex flex-col items-center justify-center h-64 text-center">
            <BuildingIcon class="size-16 text-muted mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Brand Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.brands.index' }" class="btn btn-secondary mt-6">
                Back to List
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div class="flex items-start gap-5 w-full">
                        <div class="flex-shrink-0 grid place-content-center size-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-muted text-primary-600 dark:text-primary-400">
                            <TagIcon class="size-8" />
                        </div>
                        <div class="space-y-1 flex-1">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h1 class="text-2xl font-bold section-title leading-tight">{{ brand.name }}</h1>
                                <span 
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border"
                                    :class="brand.is_featured 
                                        ? 'text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800'
                                        : 'text-slate-600 border-slate-200  dark:text-slate-400 dark:border-slate-700'"
                                >
                                    <component :is="brand.is_featured ? CheckCircleIcon : XCircleIcon" class="size-3.5" />
                                    {{ brand.is_featured ? 'Featured' : 'Standard' }}
                                </span>
                            </div>
                            <p class="text-sm font-mono text-muted">ID: #{{ brand.id }} <span class="mx-2">•</span> Slug: {{ brand.slug }}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                        <!-- <RouterLink :to="{ name: 'dashboard.brands.index' }" class="btn btn-ghost">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink> -->
                        <BackButton :to="{ name: 'dashboard.brands.index' }" />                        
                        <EditButton 
                            v-if="brand.can?.update"
                            :to="{ name: 'dashboard.brands.edit', params: { id: brand.id } }"
                            label="Edit"
                        />
                        
                        <DeleteModel
                            v-if="brand.can?.delete"
                            :item-id="brand.id"
                            :item-name="brand.name"
                            delete-url="/dashboard/brands/"
                            label="Delete"
                            @deleted="handleDeleted"
                        />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- LEFT COLUMN: Main Content -->
                <div class="lg:col-span-2 space-y-8">
                    
                    <!-- Description -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                            <InfoIcon class="size-4" /> Description
                        </h3>
                        <p v-if="brand.description" class="section-title leading-relaxed whitespace-pre-wrap">
                            {{ brand.description }}
                        </p>
                        <p v-else class="text-muted italic text-sm">No description provided for this brand.</p>
                    </div>

                    <!-- Associated Products -->
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden">
                        <header class="p-5 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                            <h2 class="font-bold section-title flex items-center gap-2">
                                <PackageIcon class="size-5 text-primary-500" />
                                Associated Products
                            </h2>
                            <span class="px-2 py-0.5 rounded-md text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                {{ brand.products?.length || 0 }}
                            </span>
                        </header>
                        
                        <div class="p-2">
                            <ul v-if="brand.products && brand.products.length > 0" class="space-y-1">
                                <li v-for="product in brand.products" :key="product.id">
                                    <RouterLink 
                                        :to="{ name: 'dashboard.products.show', params: { id: product.id } }" 
                                        class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <div class="flex-shrink-0 p-2 rounded-lg" :class="product.type === 'ff' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'">
                                            <component :is="product.type === 'ff' ? PillIcon : BeakerIcon" class="size-5" />
                                        </div>
                                        
                                        <div class="flex-1 min-w-0">
                                            <p class="font-semibold text-section-title group-hover:text-primary-600 transition-colors">
                                                {{ product.name }}
                                            </p>
                                            <p class="text-xs text-muted uppercase tracking-wide">
                                                {{ product.type === 'api' ? 'Active Ingredient' : 'Finished Formulation' }}
                                            </p>
                                        </div>
                                    </RouterLink>
                                </li>
                            </ul>
                            <div v-else class="p-8 text-center text-muted italic">
                                No products are currently associated with this brand.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Sidebar -->
                <div class="space-y-6">
                    
                    <!-- Logo Card -->
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden">
                        <div class="p-4 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Brand Logo</h3>
                        </div>
                        <div class="p-6 flex items-center justify-center min-h-[180px]">
                            <img 
                                :src="brand.image_url ?? brand.image_thumbnail_url ?? zydinLogoImage" 
                                :alt="brand.name" 
                                class="max-w-full max-h-32 object-contain drop-shadow-sm"
                            >
                            <!-- <div v-else class="flex flex-col items-center text-muted opacity-50">
                                <ImageIcon class="size-12 mb-2" />
                                <span class="text-xs">No Logo</span>
                            </div> -->
                        </div>
                    </div>
                    
                    <!-- Audit Info -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-4">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-muted border-b border-muted pb-2">Audit Log</h3>
                        
                        <div class="space-y-3">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><CalendarIcon class="size-3.5" /> Created</span>
                                <span class="font-medium section-title">{{ formatDate(brand.created_at) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><ClockIcon class="size-3.5" /> Updated</span>
                                <span class="font-medium section-title">{{ formatDate(brand.updated_at) }}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
</style>