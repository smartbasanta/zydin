<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { HeroSlide } from "@/types";
import { 
    ArrowLeftIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ExternalLinkIcon,
    CalendarIcon,
    ClockIcon,
    ImageIcon,
    ArrowUpDownIcon,
    LinkIcon,
    TypeIcon
} from "lucide-vue-next";
// Use universal buttons
import { EditButton } from "@/components/button";
import DeleteModel from "@/components/button/DeleteModel.vue";
import LoadingState from '@/components/card/LoadingState.vue';
import { useDefaultImages } from "@/composables/useDefaultImages";

const { defaultSlideImage } = useDefaultImages();
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const heroSlide = ref<HeroSlide | null>(null);
const isLoading = ref(true);
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

const handleDeleted = () => {
    router.push({ name: 'dashboard.hero-slides.index' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans section-bg section-title">
        
        <LoadingState v-if="isLoading" message="Loading slide details..." />
        
        <div v-else-if="!heroSlide" class="flex flex-col items-center justify-center h-64 text-center">
            <ImageIcon class="size-16 mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Slide Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.hero-slides.index' }" class="btn btn-secondary mt-6">
                Back to Slides
            </RouterLink>
        </div>

        <div v-else class="max-w-5xl mx-auto space-y-8">
            
            <!-- Top Navigation & Actions -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-3">
                    <RouterLink :to="{ name: 'dashboard.hero-slides.index' }" class="btn btn-ghost btn-sm px-2">
                        <ArrowLeftIcon class="size-5" />
                    </RouterLink>
                    <div>
                        <h1 class="text-2xl font-bold section-title">Hero Slide Details</h1>
                        <p class="text-sm font-mono">ID: #{{ heroSlide.id }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <EditButton 
                        v-if="heroSlide.can?.update" 
                        :to="{ name: 'dashboard.hero-slides.edit', params: { id: heroSlide.id } }" 
                        label="Edit Slide"
                    />
                    <DeleteModel 
                        v-if="heroSlide.can?.delete" 
                        :item-id="heroSlide.id" 
                        :item-name="heroSlide.title" 
                        delete-url="/dashboard/hero-slides/" 
                        label="Delete"
                        @deleted="handleDeleted" 
                    />
                </div>
            </div>

            <!-- Visual Preview Card -->
            <div class="card-backdrop relative overflow-hidden group p-0 min-h-[400px] flex items-center justify-center border border-muted rounded-3xl shadow-lg">
                <!-- Background Image -->
                <div class="absolute inset-0 bg-gray-900">
                    <img 
                        :src="heroSlide.image_url ?? heroSlide.image_thumbnail_url ?? defaultSlideImage" 
                        :alt="heroSlide.title" 
                        class="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                    >
                    <!-- <div v-else class="w-full h-full flex items-center justify-center opacity-20">
                        <ImageIcon class="size-32 text-white" />
                    </div> -->
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                <!-- Content Overlay -->
                <div class="relative z-10 text-center max-w-3xl px-6 py-12">
                    <h2 class="text-4xl md:text-5xl font-bold text-white font-grotesk mb-4 drop-shadow-lg">
                        {{ heroSlide.title }}
                    </h2>
                    <p v-if="heroSlide.description" class="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md leading-relaxed">
                        {{ heroSlide.description }}
                    </p>
                    <div v-if="heroSlide.link_text && heroSlide.link_url">
                        <span class="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-xl hover:bg-primary-500 transition-colors cursor-default">
                            {{ heroSlide.link_text }}
                            <ExternalLinkIcon class="size-4" />
                        </span>
                    </div>
                </div>
            </div>

            <!-- Configuration Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Settings Card -->
                <div class="p-6 rounded-2xl border border-muted bg-card-bg shadow-sm flex flex-col gap-6">
                    <h3 class="text-sm font-bold uppercase tracking-wider border-b border-muted pb-3">Configuration</h3>
                    
                    <div class="grid grid-cols-2 gap-6">
                        <!-- Status -->
                        <div>
                            <span class="text-xs font-medium block mb-1.5">Status</span>
                            <span v-if="heroSlide.is_active" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-emerald-700 border border-emerald-200 dark:text-emerald-400 dark:border-emerald-800 text-sm font-bold">
                                <CheckCircleIcon class="size-4" /> Active
                            </span>
                            <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 border border-slate-200 dark:text-slate-400 dark:border-slate-700 text-sm font-medium">
                                <XCircleIcon class="size-4" /> Inactive
                            </span>
                        </div>

                        <!-- Display Order -->
                        <div>
                            <span class="text-xs font-medium block mb-1.5">Display Order</span>
                            <div class="flex items-center gap-2 text-section-title font-mono font-bold text-lg">
                                <div class="p-1.5 rounded border">
                                    <ArrowUpDownIcon class="size-4" />
                                </div>
                                {{ heroSlide.order_column }}
                            </div>
                        </div>
                    </div>

                    <!-- Link Details -->
                    <div v-if="heroSlide.link_url" class="p-4 rounded-xl border border-muted space-y-3">
                        <div class="flex items-start gap-3">
                            <TypeIcon class="size-4 mt-0.5" />
                            <div>
                                <p class="text-xs font-bold uppercase">Button Label</p>
                                <p class="text-sm font-medium section-title">{{ heroSlide.link_text || 'N/A' }}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LinkIcon class="size-4 mt-0.5" />
                            <div class="min-w-0">
                                <p class="text-xs font-bold uppercase">Target URL</p>
                                <a :href="heroSlide.link_url" target="_blank" class="text-sm text-primary-600 hover:underline truncate block">
                                    {{ heroSlide.link_url }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Audit Card -->
                <div class="p-6 rounded-2xl border border-muted bg-card-bg shadow-sm flex flex-col gap-6">
                    <h3 class="text-sm font-bold uppercase tracking-wider border-b border-muted pb-3">Audit Information</h3>
                    
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                                <CalendarIcon class="size-5" />
                            </div>
                            <div>
                                <p class="text-xs font-bold uppercase">Created On</p>
                                <p class="text-sm font-medium section-title">{{ formatDate(heroSlide.created_at) }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                <ClockIcon class="size-5" />
                            </div>
                            <div>
                                <p class="text-xs font-bold uppercase">Last Updated</p>
                                <p class="text-sm font-medium section-title">{{ formatDate(heroSlide.updated_at) }}</p>
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