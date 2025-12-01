<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Testimonial } from "@/types";
import { 
    StarIcon, 
    UserIcon, 
    QuoteIcon, 
    BriefcaseIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    CalendarIcon, 
    ClockIcon,
    ArrowLeftIcon,
    MessageSquareIcon
} from "lucide-vue-next";
    
import { 
    EditButton, 
    DeleteModel 
} from "@/components/button";
import LoadingState from '@/components/card/LoadingState.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';
import BackButton from "@/components/button/BackButton.vue";

const { defaultProfileImage } = useDefaultImages();
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const testimonial = ref<Testimonial | null>(null);
const isLoading = ref(true);
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

const handleDeleted = () => {
    router.push({ name: 'dashboard.testimonials.index' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
};

const getTypeColor = (type: string) => {
    return type === 'employee' 
        ? 'text-purple-700 border-purple-200 dark:text-purple-300' 
        : 'text-blue-700 border-blue-200 dark:text-blue-300';
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-screen">
        
        <LoadingState v-if="isLoading" message="Loading testimonial..." />
        
        <div v-else-if="!testimonial" class="flex flex-col items-center justify-center h-64 text-center">
            <MessageSquareIcon class="size-16 text-muted mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Testimonial Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.testimonials.index' }" class="btn btn-secondary mt-6">
                Back to List
            </RouterLink>
        </div>

        <div v-else class="max-w-5xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    
                    <!-- Profile Section -->
                    <div class="flex items-center gap-5 w-full">
                        <div class="flex-shrink-0 w-20 h-20 rounded-full border-2 border-muted overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                            <img 
                                :src="testimonial.avatar_url ?? testimonial.avatar_thumbnail_url ?? defaultProfileImage" 
                                :alt="testimonial.name" 
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div class="space-y-1.5 flex-1">
                            <h1 class="text-2xl font-bold section-title leading-tight">{{ testimonial.name }}</h1>
                            <p class="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                                <BriefcaseIcon class="size-3.5" />
                                {{ testimonial.role }}
                            </p>
                            <!-- Star Rating -->
                            <div class="flex items-center gap-1">
                                <StarIcon 
                                    v-for="i in 5" 
                                    :key="i" 
                                    class="size-4"
                                    :class="i <= testimonial.rating ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-700'" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                        <!-- <RouterLink :to="{ name: 'dashboard.testimonials.index' }" class="btn btn-ghost">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink> -->
                        <BackButton :to="{ name: 'dashboard.testimonials.index' }"/>
                        <EditButton 
                            v-if="testimonial.can?.update" 
                            :to="{ name: 'dashboard.testimonials.edit', params: { id: testimonial.id } }" 
                            label="Edit"
                        />
                        
                        <DeleteModel 
                            v-if="testimonial.can?.delete" 
                            :item-id="testimonial.id" 
                            :item-name="`testimonial from ${testimonial.name}`" 
                            delete-url="/dashboard/testimonials/" 
                            label="Delete"
                            @deleted="handleDeleted" 
                        />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- LEFT COLUMN: The Quote -->
                <div class="lg:col-span-2">
                    <div class="p-8 rounded-2xl section-bg border border-muted shadow-sm relative overflow-hidden">
                        <!-- Decorative Icon -->
                        <QuoteIcon class="absolute top-6 right-6 size-24 text-primary-50 dark:text-primary-900/20 rotate-12 -z-0 pointer-events-none" />
                        
                        <h3 class="text-xs font-bold uppercase tracking-wider section-title mb-4 relative z-10">Testimonial Content</h3>
                        <blockquote class="relative z-10">
                            <p class="text-xl md:text-2xl leading-relaxed font-medium section-title italic">
                                "{{ testimonial.text }}"
                            </p>
                        </blockquote>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Sidebar Info -->
                <div class="space-y-6">
                    
                    <!-- Key Info -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-6">
                        <h3 class="text-xs font-bold uppercase tracking-wider section-title border-b border-muted pb-2">Details</h3>
                        
                        <!-- Type -->
                        <div>
                            <p class="text-xs section-title mb-1.5">Source Type</p>
                            <span 
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border"
                                :class="getTypeColor(testimonial.type)"
                            >
                                {{ testimonial.type }}
                            </span>
                        </div>

                        <!-- Featured Status -->
                        <div>
                            <p class="text-xs section-title mb-1.5">Visibility</p>
                            <div v-if="testimonial.is_featured" class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 w-fit">
                                <CheckCircleIcon class="size-4" /> Featured on Home
                            </div>
                            <div v-else class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
                                <XCircleIcon class="size-4" /> Standard List
                            </div>
                        </div>
                    </div>
                    
                    <!-- Audit Log -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-4">
                        <h3 class="text-xs font-bold uppercase tracking-wider section-title border-b border-muted pb-2">Audit Log</h3>
                        
                        <div class="space-y-3">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><CalendarIcon class="size-3.5" /> Created</span>
                                <span class="font-medium section-title">{{ formatDate(testimonial.created_at) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><ClockIcon class="size-3.5" /> Updated</span>
                                <span class="font-medium section-title">{{ formatDate(testimonial.updated_at) }}</span>
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