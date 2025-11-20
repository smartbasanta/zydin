<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { JobOpening } from "@/types";
import { BriefcaseIcon, MapPinIcon, BuildingIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-vue-next";
import { BackButton, EditButton, DeleteButton } from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const job = ref<JobOpening | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
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

const handleDelete = async () => {
    if (!job.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/jobs/${job.value.id}`);
        router.push({ name: 'dashboard.jobs.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete job`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen font-poppins">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
			Loading job details...
		</div>
		<div v-else-if="!job" class="text-center py-12 text-lg">
			Job opening not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<!-- Header -->
			<div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000">
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div class="flex items-center gap-4">
                        <BriefcaseIcon class="size-8 text-indigo-500" />
						<div>
							<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50">
								{{ job.title }}
							</h1>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span class="flex items-center gap-1.5"><BuildingIcon class="size-4" /> {{ job.department }}</span>
                                <span class="flex items-center gap-1.5"><MapPinIcon class="size-4" /> {{ job.location }}</span>
                                <span class="flex items-center gap-1.5"><ClockIcon class="size-4" /> {{ job.type }}</span>
                            </div>
						</div>
					</div>
					<div class="flex items-center gap-3">
                        <BackButton :to="{ name: 'dashboard.jobs.index' }" />
                        <EditButton v-if="job.can?.update" :to="{ name: 'dashboard.jobs.edit', params: { id: job.id } }" />
                        <DeleteButton v-if="job.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
					</div>
				</div>
                 <div class="mt-4 flex items-center gap-2">
                    <CheckCircleIcon v-if="job.is_active" class="w-5 h-5 text-green-500" />
                    <XCircleIcon v-else class="w-5 h-5 text-gray-500" />
                    <span class="font-medium text-sm">
                        {{ job.is_active ? 'Actively Recruiting' : 'Not Active' }}
                    </span>
                </div>
			</div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000 space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Job Description</h2>
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ job.description }}</p>
                </div>
                 <div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000 space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Responsibilities</h2>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li v-for="(item, index) in job.responsibilities" :key="index">{{ item }}</li>
                    </ul>
                </div>
                <div class="md:col-span-2 bg-white dark:bg-gray-1200 rounded-xl shadow-md p-6 border border-gray-150 dark:border-gray-1000 space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Qualifications</h2>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li v-for="(item, index) in job.qualifications" :key="index">{{ item }}</li>
                    </ul>
                </div>
            </div>
		</div>
	</div>
</template>