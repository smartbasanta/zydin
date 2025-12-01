<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { JobOpening } from "@/types";
import { 
    BriefcaseIcon, 
    MapPinIcon, 
    BuildingIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ArrowLeftIcon, 
    FileTextIcon, 
    ListChecksIcon, 
    GraduationCapIcon 
} from "lucide-vue-next";

// Use universal buttons
import { EditButton } from "@/components/button";
import DeleteModel from "@/components/button/DeleteModel.vue";
import LoadingState from '@/components/card/LoadingState.vue';
import BackButton from "@/components/button/BackButton.vue";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const job = ref<JobOpening | null>(null);
const isLoading = ref(true);
const jobId = route.params.id as string;

const fetchJobDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/jobs/${jobId}`);
        job.value = response.data.jobOpening;
    } catch (err) {
        notifyError(err as any, "Failed to load job details");
        router.push({ name: "dashboard.jobs.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchJobDetails);

const handleDeleted = () => {
    router.push({ name: 'dashboard.jobs.index' });
};

const getJobTypeColor = (type: string | undefined) => {
    switch (type) {
        case 'Full-time': return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-800';
        case 'Part-time': return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800';
        case 'Contract': return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-900/20 dark:border-amber-800';
        default: return 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-900/20 dark:border-purple-800';
    }
};
</script>

<template>
    <div class="p-6 md:p-8 section-bg">
        
        <LoadingState v-if="isLoading" message="Loading job details..." />
        
        <div v-else-if="!job" class="flex flex-col items-center justify-center h-64 text-center">
            <BriefcaseIcon class="size-16 text-muted mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Job Opening Not Found</h3>
            <RouterLink :to="{ name: 'dashboard.jobs.index' }" class="btn btn-secondary mt-6">
                Back to List
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-6">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div class="flex items-start gap-5 w-full">
                        <div class="flex-shrink-0 grid place-content-center size-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-muted text-indigo-600 dark:text-indigo-400">
                            <BriefcaseIcon class="size-8" />
                        </div>
                        <div class="space-y-1 flex-1">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h1 class="text-2xl font-bold section-title leading-tight">{{ job.title }}</h1>
                                <!-- Status Badge -->
                                <span v-if="job.is_active" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                                    <CheckCircleIcon class="size-3.5" /> Active
                                </span>
                                <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200 dark:text-slate-400 dark:border-slate-700">
                                    <XCircleIcon class="size-3.5" /> Inactive
                                </span>
                            </div>
                            <p class="text-sm section-title">ID: #{{ job.id }}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                        <!-- <RouterLink :to="{ name: 'dashboard.jobs.index' }" class="btn btn-ghost">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink> -->
                        <BackButton :to="{ name: 'dashboard.jobs.index' }" />
                        <EditButton 
                            v-if="job.can?.update" 
                            :to="{ name: 'dashboard.jobs.edit', params: { id: job.id } }" 
                            label="Edit"
                        />
                        
                        <DeleteModel 
                            v-if="job.can?.delete" 
                            :item-id="job.id" 
                            :item-name="job.title" 
                            delete-url="/dashboard/jobs/" 
                            label="Delete"
                            @deleted="handleDeleted" 
                        />
                    </div>
                </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- Department -->
                <div class="p-4 rounded-xl bg-card-bg border border-muted shadow-sm">
                    <div class="flex items-center gap-2 mb-2 text-muted text-xs font-bold uppercase tracking-wider">
                        <BuildingIcon class="size-4" /> Department
                    </div>
                    <p class="font-semibold section-title">{{ job.department }}</p>
                </div>

                <!-- Location -->
                <div class="p-4 rounded-xl bg-card-bg border border-muted shadow-sm">
                    <div class="flex items-center gap-2 mb-2 text-muted text-xs font-bold uppercase tracking-wider">
                        <MapPinIcon class="size-4" /> Location
                    </div>
                    <p class="font-semibold section-title">{{ job.location || 'Remote' }}</p>
                </div>

                <!-- Job Type -->
                <div class="p-4 rounded-xl bg-card-bg border border-muted shadow-sm">
                    <div class="flex items-center gap-2 mb-2 text-muted text-xs font-bold uppercase tracking-wider">
                        <ClockIcon class="size-4" /> Employment Type
                    </div>
                    <span class="inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide border" :class="getJobTypeColor(job.type)">
                        {{ job.type }}
                    </span>
                </div>

                <!-- Applicants (Placeholder for future feature) -->
                <div class="p-4 rounded-xl bg-card-bg border border-muted shadow-sm opacity-70">
                    <div class="flex items-center gap-2 mb-2 text-muted text-xs font-bold uppercase tracking-wider">
                        <FileTextIcon class="size-4" /> Applications
                    </div>
                    <p class="font-semibold section-title text-sm">View in Applications</p>
                </div>
            </div>

            <!-- Main Content -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                
                <!-- Description (Wide) -->
                <div class="space-y-6">
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm">
                        <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                            <FileTextIcon class="size-4" /> Job Description
                        </h3>
                        <div class="prose prose-sm dark:prose-invert max-w-none section-title whitespace-pre-line leading-relaxed">
                            {{ job.description }}
                        </div>
                    </div>
                </div>

                <!-- Lists (Narrow) -->
                <div class="space-y-6 lg:col-span-2">
                    <!-- Responsibilities -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm">
                        <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                            <ListChecksIcon class="size-4" /> Key Responsibilities
                        </h3>
                        <ul class="space-y-3">
                            <li v-for="(item, index) in job.responsibilities" :key="index" class="flex items-start gap-3 text-sm section-title">
                                <div class="mt-1.5 size-1.5 rounded-full bg-gradient-secondary flex-shrink-0"></div>
                                <span class="leading-relaxed">{{ item }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Qualifications -->
                    <div class="p-6 rounded-2xl bg-card-bg border border-muted shadow-sm">
                        <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                            <GraduationCapIcon class="size-4" /> Qualifications
                        </h3>
                        <ul class="space-y-3">
                            <li v-for="(item, index) in job.qualifications" :key="index" class="flex items-start gap-3 text-sm section-title">
                                <div class="mt-1.5 size-1.5 rounded-full bg-gradient-secondary flex-shrink-0"></div>
                                <span class="leading-relaxed">{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
</style>