<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
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
    InfoIcon,
    TagIcon,
    BuildingIcon,
    ArrowLeftIcon,
    FileTextIcon,
    ShieldAlertIcon,
    ActivityIcon,
    HashIcon,
    ScaleIcon,
    FlaskConicalIcon
} from "lucide-vue-next";
    
import { 
    EditButton, 
    DeleteModel 
} from "@/components/button";
import LoadingState from '@/components/card/LoadingState.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';
import BackButton from "@/components/button/BackButton.vue";

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages();
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const productId = route.params.id as string;
const activeTab = ref('details');

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
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
};

const handleDeleted = () => {
    router.push({ name: 'dashboard.products.index' });
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-screen">
        
        <LoadingState v-if="isLoading" message="Loading product details..." />
        
        <div v-else-if="!product" class="flex flex-col items-center justify-center h-64 text-center">
            <PackageIcon class="size-16 text-muted mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Product Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.products.index' }" class="btn btn-secondary mt-6">
                Back to Inventory
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                    <!-- Product Image & Title -->
                    <div class="flex flex-col sm:flex-row items-start gap-6 w-full">
                        
                        <!-- Image Container -->
                        <div class="flex-shrink-0 w-full sm:w-40 h-40 bg-white dark:bg-gray-800 rounded-2xl border border-muted p-2 flex items-center justify-center shadow-sm">
                            <img 
                                :src="product.image_url ?? (product.type === 'api' ? defaultProductAPIImage : defaultProductFFImage)" 
                                :alt="product.name" 
                                class="max-w-full max-h-full object-contain rounded-lg"
                            >
                        </div>

                        <div class="space-y-3 flex-1">
                            <!-- Type Badge -->
                            <div class="flex items-center gap-3">
                                <span 
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border"
                                    :class="product.type === 'api' ? 'text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-800' : 'text-purple-700 border-purple-200 dark:text-purple-300 dark:border-purple-800'"
                                >
                                    <component :is="product.type === 'api' ? BeakerIcon : PillIcon" class="size-3.5" />
                                    {{ product.type === 'api' ? 'Active Ingredient (API)' : 'Finished Formulation' }}
                                </span>
                                <span v-if="product.is_featured" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircleIcon class="size-3" /> Featured
                                </span>
                            </div>

                            <div>
                                <h1 class="text-3xl font-bold section-title leading-tight">{{ product.name }}</h1>
                                <p class="text-lg text-primary-600 dark:text-primary-400 font-medium mt-1">
                                    {{ product.generic_name }}
                                </p>
                            </div>
                            
                            <!-- Quick Specs (Pills) -->
                            <div class="flex flex-wrap gap-2 pt-2">
                                <span v-if="product.brand" class="spec-pill">
                                    <BuildingIcon class="size-3.5" /> {{ product.brand.name }}
                                </span>
                                <span v-if="product.category" class="spec-pill">
                                    <TagIcon class="size-3.5" /> {{ product.category }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end self-start">
                        <!-- <RouterLink :to="{ name: 'dashboard.products.index' }" class="btn btn-ghost">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink> -->
                        <BackButton :to="{ name: 'dashboard.products.index' }"/>
                        <EditButton 
                            v-if="product.can?.update" 
                            :to="{ name: 'dashboard.products.edit', params: { id: product.id } }" 
                            label="Edit"
                        />
                        
                        <DeleteModel 
                            v-if="product.can?.delete" 
                            :item-id="product.id" 
                            :item-name="product.name" 
                            delete-url="/dashboard/products/" 
                            label="Delete"
                            @deleted="handleDeleted" 
                        />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- LEFT COLUMN: Main Info Tabs -->
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden min-h-[400px]">
                        <!-- Tab Navigation -->
                        <div class="flex border-b border-muted bg-gray-50/50 dark:bg-gray-900/20 overflow-x-auto">
                            <button @click="activeTab = 'details'" :class="['tab-btn', activeTab === 'details' ? 'active' : '']">
                                <InfoIcon class="size-4" /> Specifications
                            </button>
                            <button v-if="product.pharmacology" @click="activeTab = 'pharma'" :class="['tab-btn', activeTab === 'pharma' ? 'active' : '']">
                                <ActivityIcon class="size-4" /> Pharmacology
                            </button>
                            <button v-if="product.safety_precaution" @click="activeTab = 'safety'" :class="['tab-btn', activeTab === 'safety' ? 'active' : '']">
                                <ShieldAlertIcon class="size-4" /> Safety
                            </button>
                            <button v-if="product.prescribtion" @click="activeTab = 'prescription'" :class="['tab-btn', activeTab === 'prescription' ? 'active' : '']">
                                <FileTextIcon class="size-4" /> Prescription
                            </button>
                        </div>
                        
                        <!-- Tab Content -->
                        <div class="p-6 md:p-8">
                            <!-- Details Tab -->
                            <div v-if="activeTab === 'details'" class="space-y-8">
                                <div class="prose prose-sm dark:prose-invert max-w-none section-title">
                                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-2">Description</h3>
                                    <p>{{ product.description || 'No description provided.' }}</p>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-muted">
                                    <!-- Finished Formulation Specs -->
                                    <template v-if="product.type === 'ff'">
                                        <div class="spec-item">
                                            <span class="label">Therapeutic Area</span>
                                            <span class="value">{{ product.therapeutic_area || '-' }}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="label">Dosage Form</span>
                                            <span class="value">{{ product.dosage_form || '-' }}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="label">Strength</span>
                                            <span class="value">{{ product.strength || '-' }}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="label">Indications</span>
                                            <span class="value">{{ product.indications || '-' }}</span>
                                        </div>
                                    </template>
                                    
                                    <!-- API Specs -->
                                    <template v-if="product.type === 'api'">
                                        <div class="spec-item">
                                            <span class="label flex items-center gap-1.5"><HashIcon class="size-3.5" /> CAS Number</span>
                                            <span class="value font-mono">{{ product.cas_number || '-' }}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="label flex items-center gap-1.5"><FlaskConicalIcon class="size-3.5" /> Molecular Formula</span>
                                            <span class="value font-mono">{{ product.molecular_formula || '-' }}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="label flex items-center gap-1.5"><ScaleIcon class="size-3.5" /> Molecular Weight</span>
                                            <span class="value">{{ product.molecular_weight || '-' }}</span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            
                            <!-- Pharmacology Tab -->
                            <div v-if="activeTab === 'pharma'" class="prose prose-sm dark:prose-invert max-w-none section-title">
                                <p>{{ product.pharmacology }}</p>
                            </div>
                            
                            <!-- Safety Tab -->
                            <div v-if="activeTab === 'safety'" class="prose prose-sm dark:prose-invert max-w-none section-title">
                                <p>{{ product.safety_precaution }}</p>
                            </div>
                            
                            <!-- Prescription Tab -->
                            <div v-if="activeTab === 'prescription'" class="prose prose-sm dark:prose-invert max-w-none section-title">
                                <p>{{ product.prescribtion }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Sidebar Info -->
                <div class="space-y-6">
                    
                    <!-- Key Info -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-4">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-muted border-b border-muted pb-2">System Information</h3>
                        
                        <div class="space-y-3">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted">Internal ID</span>
                                <span class="font-mono section-title">#{{ product.id }}</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted">Slug</span>
                                <span class="font-mono text-muted truncate max-w-[150px]" :title="product.slug">{{ product.slug }}</span>
                            </div>
                            
                            <div class="pt-2 border-t border-dashed border-muted">
                                <div class="flex items-center justify-between text-xs mb-2">
                                    <span class="text-muted flex items-center gap-1.5"><CalendarIcon class="size-3.5" /> Created</span>
                                    <span class="font-medium section-title">{{ formatDate(product.created_at) }}</span>
                                </div>
                                <div class="flex items-center justify-between text-xs">
                                    <span class="text-muted flex items-center gap-1.5"><ClockIcon class="size-3.5" /> Updated</span>
                                    <span class="font-medium section-title">{{ formatDate(product.updated_at) }}</span>
                                </div>
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

/* Spec Pill Styling */
.spec-pill {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium section-title border border-muted;
}

/* Modern Tab Buttons */
.tab-btn {
    @apply flex items-center gap-2 px-6 py-4 text-sm font-medium text-muted border-b-2 border-transparent transition-all hover:text-primary-600 whitespace-nowrap;
}
.tab-btn.active {
    @apply text-primary-600 border-primary-600 bg-primary-50/50 dark:bg-primary-900/10;
}

/* Spec Items in Grid */
.spec-item {
    @apply flex flex-col gap-1;
}
.spec-item .label {
    @apply text-xs font-bold uppercase text-muted;
}
.spec-item .value {
    @apply font-medium section-title;
}
</style>