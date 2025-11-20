<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { JobApplication } from "@/types";
import { UserIcon, MailIcon, PhoneIcon, BriefcaseIcon, CalendarIcon, FileTextIcon, DownloadIcon } from "lucide-vue-next";
import { BackButton, DeleteButton } from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const application = ref<JobApplication | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const applicationId = route.params.id as string;

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
    year: 'numeric', month: 'long', day: 'numeric'
});

const getDownloadUrl = (id: number | undefined) => {
    if (!id) return '#';
    return `/dashboard/job-applications/${id}/download-resume`;
};

const handleDelete = async () => {
    if (!application.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/job-applications/${application.value.id}`);
        router.push({ name: 'dashboard.job-applications.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete application`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen font-poppins">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
			Loading application details...
		</div>
		<div v-else-if="!application" class="text-center py-12 text-lg">
			Application not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <div class="flex justify-end gap-3 mb-4">
                    <BackButton :to="{ name: 'dashboard.job-applications.index' }" />
                    <DeleteButton v-if="application.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                </div>

                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                    {{ application.name }}
                </h1>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400 mt-4 border-t dark:border-gray-800 pt-4">
                    <div class="flex items-center gap-2">
                        <MailIcon class="size-4" />
                        <a :href="`mailto:${application.email}`" class="link">{{ application.email }}</a>
                    </div>
                    <div class="flex items-center gap-2">
                        <PhoneIcon class="size-4" />
                        <span>{{ application.phone }}</span>
                    </div>
                     <div class="flex items-center gap-2">
                        <BriefcaseIcon class="size-4" />
                        <span>Applied for: <strong>{{ application.job_opening?.title }}</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <CalendarIcon class="size-4" />
                        <span>Applied on: {{ formatDate(application.created_at) }}</span>
                    </div>
                </div>

                <a v-if="application.resume_url" :href="getDownloadUrl(application.id)" target="_blank" class="btn btn-primary mt-6 inline-flex items-center gap-2">
                    <DownloadIcon class="size-4" />
                    Download Resume
                </a>
			</div>

            <div v-if="application.cover_letter" class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
                <h2 class="font-bold text-xl mb-4 flex items-center gap-2"><FileTextIcon class="size-5" /> Cover Letter</h2>
                <div class="prose dark:prose-invert max-w-none whitespace-pre-wrap">{{ application.cover_letter }}</div>
            </div>
             <div v-else class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000 text-center">
                <p class="text-muted">No cover letter was submitted.</p>
             </div>
		</div>
	</div>
</template>