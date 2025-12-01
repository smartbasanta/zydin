<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Certification } from "@/types";
import { useDefaultImages } from '@/composables/useDefaultImages';
import { 
    AwardIcon, 
    FileTextIcon, 
    ArrowLeftIcon, 
    DownloadIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    BuildingIcon,
    CalendarIcon,
    ClockIcon
} from "lucide-vue-next";
    
// Use universal buttons
import { EditButton } from "@/components/button";
import DeleteModel from "@/components/button/DeleteModel.vue";
import LoadingState from '@/components/card/LoadingState.vue';
import BackButton from "@/components/button/BackButton.vue";

const { defaultCertificationImage } = useDefaultImages();
const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const certification = ref<Certification | null>(null);
const isLoading = ref(true);
const certificationId = route.params.id as string;

const fetchCertificationDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/certifications/${certificationId}`);
        certification.value = response.data.certification;
    } catch (err) {
        notifyError(err as any, "Failed to load certification details");
        router.push({ name: "dashboard.certifications.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchCertificationDetails);

const handleDeleted = () => {
    router.push({ name: 'dashboard.certifications.index' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric"
    });
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-screen">
        
        <LoadingState v-if="isLoading" message="Loading certification..." />
        
        <div v-else-if="!certification" class="flex flex-col items-center justify-center h-64 text-center">
            <AwardIcon class="size-16 text-muted mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Certification Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.certifications.index' }" class="btn btn-secondary mt-6">
                Back to List
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div class="flex items-start gap-5 w-full">
                        <div class="flex-shrink-0 grid place-content-center size-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-muted text-emerald-600 dark:text-emerald-500">
                            <AwardIcon class="size-8" />
                        </div>
                        <div class="space-y-1 flex-1">
                            <h1 class="text-2xl font-bold section-title leading-tight">{{ certification.name }}</h1>
                            <div class="flex items-center gap-2 text-muted text-sm">
                                <BuildingIcon class="size-3.5" />
                                <span class="font-medium">{{ certification.issuing_body }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                        <BackButton :to="{ name: 'dashboard.certifications.index' }" />
                        
                        <EditButton 
                            v-if="certification.can?.update"
                            :to="{ name: 'dashboard.certifications.edit', params: { id: certification.id } }"
                            label="Edit"
                        />
                        
                        <DeleteModel
                            v-if="certification.can?.delete"
                            :item-id="certification.id"
                            :item-name="certification.name"
                            delete-url="/dashboard/certifications/"
                            label="Delete"
                            @deleted="handleDeleted"
                        />
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- LEFT COLUMN: Main Content & PDF -->
                <div class="lg:col-span-2 space-y-8">
                    
                    <!-- Description Card -->
                    <div v-if="certification.description" class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm">
                        <h3 class="text-lg font-extrabold uppercase tracking-wider section-title mb-3">Description / Scope</h3>
                        <p class="section-title leading-relaxed">
                            {{ certification.description }}
                        </p>
                    </div>

                    <!-- Document Viewer -->
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div class="p-4 border-b border-muted flex justify-between items-center">
                            <h3 class="font-bold section-title flex items-center gap-2">
                                <FileTextIcon class="size-4 text-primary-500" />
                                Document Preview
                            </h3>
                            <a 
                                v-if="certification.pdf_url" 
                                :href="certification.pdf_url" 
                                target="_blank" 
                                class="btn btn-sm btn-secondary"
                            >
                                <DownloadIcon class="size-4 mr-2" /> Download PDF
                            </a>
                        </div>

                        <div class="flex-grow bg-gray-100 dark:bg-gray-900 relative">
                            <iframe 
                                v-if="certification.pdf_url" 
                                :src="certification.pdf_url" 
                                class="w-full h-full" 
                                title="Certification PDF"
                            ></iframe>
                            <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-muted">
                                <FileTextIcon class="size-16 mb-4 opacity-20" />
                                <p>No PDF document attached.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Sidebar Info -->
                <div class="space-y-6">
                    
                    <!-- Logo Card -->
                    <div class="rounded-2xl border border-muted shadow-sm overflow-hidden">
                        <div class="p-4 border-b border-muted">
                            <h3 class="text-xs font-bold uppercase tracking-wider section-title">Official Logo</h3>
                        </div>
                        <div class="p-6 flex items-center justify-center section-bg min-h-[200px]">
                            <img 
                                :src="certification.logo_url ?? certification.logo_thumbnail_url ?? defaultCertificationImage" 
                                :alt="certification.name" 
                                class="max-w-full max-h-40 object-contain"
                            >
                        </div>
                    </div>

                    <!-- Status & Meta -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm space-y-6">
                        <!-- Status -->
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-wider section-title mb-2">Visibility</h3>
                            <div v-if="certification.is_featured" class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                <CheckCircleIcon class="size-5" /> Featured on Website
                            </div>
                            <div v-else class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <XCircleIcon class="size-5" /> Standard Listing
                            </div>
                        </div>

                        <div class="pt-4 border-t border-muted space-y-3">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><CalendarIcon class="size-3.5" /> Created</span>
                                <span class="font-medium section-title">{{ formatDate(certification.created_at) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-muted flex items-center gap-1.5"><ClockIcon class="size-3.5" /> Updated</span>
                                <span class="font-medium section-title">{{ formatDate(certification.updated_at) }}</span>
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