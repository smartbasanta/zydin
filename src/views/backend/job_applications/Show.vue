<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { JobApplication } from "@/types";
import { 
    UserIcon, 
    MailIcon, 
    PhoneIcon, 
    BriefcaseIcon, 
    CalendarIcon, 
    FileTextIcon, 
    DownloadIcon, 
    ArrowLeftIcon
} from "lucide-vue-next";

// Use universal buttons
import { BackButton, DeleteModel } from "@/components/button";
import LoadingState from '@/components/card/LoadingState.vue';
import type { AxiosResponse } from "axios"; // Import AxiosResponse type

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const application = ref<JobApplication | null>(null);
const isLoading = ref(true);
const applicationId = route.params.id as string;
const isDownloadingResume = ref(false);

const fetchApplicationDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/job-applications/${applicationId}`);
        application.value = response.data.jobApplication;
    } catch (err) {
        notifyError(err as any, "Failed to load application details");
        router.push({ name: "dashboard.job-applications.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchApplicationDetails);

const formatDate = (dateString: string | null) => new Date(dateString??'').toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

const handleDeleted = () => {
    router.push({ name: 'dashboard.job-applications.index' });
};

const downloadResume = async () => {
    if (!application.value?.id) return;
    isDownloadingResume.value = true;
    try {
        const url = `/dashboard/job-applications/${application.value.id}/download-resume`;
        const response: AxiosResponse<Blob> = await apiService.get(url, {
            responseType: 'blob',
            getFullResponse: true,
        });
        const blob = response.data;
        const blobUrl = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', `Resume - ${application.value.name}.pdf`);
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        notifyError(err as any, 'Failed to download resume');
    } finally {
        isDownloadingResume.value = false;
    }
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-screen">
        
        <LoadingState v-if="isLoading" message="Loading application..." />
        
        <div v-else-if="!application" class="flex flex-col items-center justify-center h-64 text-center">
            <FileTextIcon class="size-16 text-muted mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Application Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.job-applications.index' }" class="btn btn-secondary mt-6">
                Back to Applications
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div class="flex items-start gap-5 w-full">
                        <div class="flex-shrink-0 grid place-content-center size-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-muted text-primary-500">
                            <UserIcon class="size-8" />
                        </div>
                        <div class="space-y-1 flex-1">
                            <h1 class="text-2xl font-bold section-title leading-tight">{{ application.name }}</h1>
                            <div class="flex items-center gap-2 text-muted text-sm">
                                <BriefcaseIcon class="size-3.5" />
                                <span class="font-medium">Applying for: {{ application.job_opening?.title || 'Unknown Position' }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                        <BackButton :to="{ name: 'dashboard.job-applications.index' }"/>
                        <!-- <RouterLink :to="{ name: 'dashboard.job-applications.index' }" class="btn btn-ghost">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink> -->
                        
                        <DeleteModel
                            v-if="application.can?.delete"
                            :item-id="application.id"
                            :item-name="`application from ${application.name}`"
                            delete-url="/dashboard/job-applications/"
                            label="Delete"
                            @deleted="handleDeleted"
                        />
                    </div>
                </div>

                <!-- Contact Grid -->
                <div class="mt-6 pt-6 border-t border-muted grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <MailIcon class="size-4" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase text-muted">Email</p>
                            <a :href="`mailto:${application.email}`" class="text-sm font-medium text-primary-600 hover:underline">{{ application.email }}</a>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                            <PhoneIcon class="size-4" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase text-muted">Phone</p>
                            <a :href="`tel:${application.phone}`" class="text-sm font-medium text-section-title hover:text-primary-600">{{ application.phone }}</a>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                            <CalendarIcon class="size-4" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase text-muted">Applied On</p>
                            <p class="text-sm font-medium section-title">{{ formatDate(application.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- LEFT: Cover Letter -->
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden">
                        <header class="p-5 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                            <h2 class="font-bold section-title flex items-center gap-2">
                                <FileTextIcon class="size-5 text-primary-500" />
                                Cover Letter
                            </h2>
                        </header>
                        <div class="p-6">
                            <div v-if="application.cover_letter" class="prose dark:prose-invert max-w-none text-sm text-section-text whitespace-pre-wrap leading-relaxed">
                                {{ application.cover_letter }}
                            </div>
                            <p v-else class="text-muted italic text-center py-8">No cover letter submitted.</p>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: Resume Preview/Download -->
                <div class="space-y-6">
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden">
                        <header class="p-5 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                            <h2 class="font-bold section-title">Resume</h2>
                            <button 
                                v-if="application.resume_url" 
                                @click="downloadResume"
                                :disabled="isDownloadingResume"
                                class="btn btn-sm btn-secondary"
                            >
                                <DownloadIcon class="size-4 mr-2" />
                                {{ isDownloadingResume ? 'Downloading...' : 'Download' }}
                            </button>
                        </header>
                        
                        <div class="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-[300px]">
                            <!-- Note: Browsers handle PDF embedding differently. Ideally, use a PDF viewer library. -->
                            <!-- For now, we use an iframe for a quick preview if the browser supports it. -->
                            <!-- We construct the URL manually for the iframe src -->
                            <iframe 
                                v-if="application.resume_url" 
                                :src="`/api/v1/dashboard/job-applications/${application.id}/download-resume`" 
                                class="w-full h-[400px] rounded-lg border border-muted"
                                title="Resume Preview"
                            ></iframe>
                            
                            <div v-else class="text-center text-muted">
                                <FileTextIcon class="size-12 mx-auto mb-2 opacity-30" />
                                <p>No resume uploaded.</p>
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