<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { GalleryImage } from "@/types";
import { useDefaultImages } from '@/composables/useDefaultImages';
import { 
    ArrowLeftIcon, 
    ImageIcon, 
    LayersIcon, 
    HashIcon, 
    TypeIcon, 
    CalendarIcon, 
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from "lucide-vue-next";
    
// Use universal buttons
import { EditButton } from "@/components/button";
import DeleteModel from "@/components/button/DeleteModel.vue";
import LoadingState from '@/components/card/LoadingState.vue';

const { zydinLogoImage } = useDefaultImages();
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const galleryImage = ref<GalleryImage | null>(null);
const isLoading = ref(true);
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

const handleDeleted = () => {
    router.push({ name: 'dashboard.gallery.index' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
};

// Helper to format group name (e.g., company_culture -> Company Culture)
const formatGroup = (group: string | undefined) => {
    if (!group) return 'Unknown Group';
    return group.replace(/_/g, ' ');
};

// Helper to assign colors to groups
const getGroupColor = (group: string | undefined) => {
    switch (group) {
        case 'company_culture': return 'text-blue-700 border-blue-200 dark:text-blue-300';
        case 'employee_life': return 'text-purple-700 border-purple-200 dark:text-purple-300';
        case 'corporate_social_responsibility': return 'text-emerald-700 border-emerald-200 dark:text-emerald-300';
        default: return 'text-gray-700 border-gray-200';
    }
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans section-bg section-title">
        
        <LoadingState v-if="isLoading" message="Loading gallery image..." />
        
        <div v-else-if="!galleryImage" class="flex flex-col items-center justify-center h-64 text-center">
            <ImageIcon class="size-16 mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Image Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.gallery.index' }" class="btn btn-secondary mt-6">
                Back to Gallery
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-6">
            
            <!-- Navigation & Actions -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-3">
                    <RouterLink :to="{ name: 'dashboard.gallery.index' }" class="btn btn-ghost btn-sm px-2">
                        <ArrowLeftIcon class="size-5" />
                    </RouterLink>
                    <div>
                        <h1 class="text-2xl font-bold section-title">Gallery Detail</h1>
                        <p class="text-sm font-mono">ID: #{{ galleryImage.id }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <EditButton 
                        v-if="galleryImage.can?.update" 
                        :to="{ name: 'dashboard.gallery.edit', params: { id: galleryImage.id } }" 
                        label="Edit Details"
                    />
                    <DeleteModel 
                        v-if="galleryImage.can?.delete" 
                        :item-id="galleryImage.id" 
                        :item-name="galleryImage.caption || `Image #${galleryImage.id}`" 
                        delete-url="/dashboard/gallery/" 
                        label="Delete"
                        @deleted="handleDeleted" 
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                <!-- LEFT COL: Image Preview (Studio Style) -->
                <div class="lg:col-span-2">
                    <div class="card-backdrop p-1.5 bg-white dark:bg-gray-900 border border-muted rounded-2xl shadow-sm overflow-hidden">
                        <div class="relative w-full min-h-[400px] max-h-[600px] bg-gray-100 dark:bg-black/50 rounded-xl flex items-center justify-center overflow-hidden group">
                            <!-- Checkerboard pattern for transparent images -->
                            <div class="absolute inset-0 opacity-10" 
                                 style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;">
                            </div>
                            
                            <img 
                                :src="galleryImage.image_url ?? zydinLogoImage" 
                                :alt="galleryImage.alt_text || galleryImage.caption || 'Gallery Image'" 
                                class="relative z-10 max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                            >
                        </div>
                    </div>
                </div>

                <!-- RIGHT COL: Metadata & Info -->
                <div class="space-y-6">
                    
                    <!-- Primary Details Card -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-6">
                        <!-- Caption -->
                        <div>
                            <h3 class="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                <TypeIcon class="size-3.5" /> Caption
                            </h3>
                            <p class="text-lg font-bold section-title leading-tight">
                                {{ galleryImage.caption || 'No caption provided' }}
                            </p>
                        </div>

                        <!-- Group & Order -->
                        <div class="grid grid-cols-1 gap-4 pt-4 border-t border-muted">
                            <div>
                                <h3 class="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                    <LayersIcon class="size-3.5" /> Group
                                </h3>
                                <span 
                                    class="inline-flex px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border"
                                    :class="getGroupColor(galleryImage.gallery_group)"
                                >
                                    {{ formatGroup(galleryImage.gallery_group) }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xs font-bold uppercase mb-1 flex items-center gap-2">
                                        <HashIcon class="size-3.5" /> Sort Order
                                    </h3>
                                    <span class="font-mono text-lg font-bold section-title">{{ galleryImage.order_column }}</span>
                                </div>
                                <div>
                                    <h3 class="text-xs font-bold uppercase mb-1">Featured</h3>
                                    <div v-if="galleryImage.is_featured" class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                                        <CheckCircleIcon class="size-4" /> Yes
                                    </div>
                                    <div v-else class="flex items-center gap-1.5 text-sm">
                                        <XCircleIcon class="size-4" /> No
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Technical Details Card -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-4">
                        <div>
                            <h3 class="text-xs font-bold uppercase mb-2">Alt Text (Accessibility)</h3>
                            <p class="text-sm text-section-text p-3 rounded-lg border border-muted italic">
                                "{{ galleryImage.alt_text || 'No alt text provided' }}"
                            </p>
                        </div>

                        <div class="pt-4 border-t border-muted space-y-3">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><CalendarIcon class="size-3.5" /> Created</span>
                                <span class="font-medium section-title">{{ formatDate(galleryImage.created_at) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><ClockIcon class="size-3.5" /> Updated</span>
                                <span class="font-medium section-title">{{ formatDate(galleryImage.updated_at) }}</span>
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