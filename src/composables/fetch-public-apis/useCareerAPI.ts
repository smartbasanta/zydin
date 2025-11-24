import { ref, reactive } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { JobOpening } from '@/types';
import { useNotifier } from '../useNotifier';
import { apiService } from '@/services/api.service';

export function useCareerAPI() {
    const jobs = ref<JobOpening[]>([]);
    const availableFilters = ref<{ departments: string[]; locations: string[], types: string[] }>({ departments: [], locations: [], types: [] });
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const { notify, error: notifyError } = useNotifier();

    const fetchJobs = async () => {
        isLoading.value = true;
        try {
            // Note: Your backend seems to return paginatedData, so let's adjust.
            // If it's not paginated, you can simplify this.
            const response = await apiService.get<ApiResponse>('/public/job-openings');
            jobs.value = response.data.paginatedData.data; // Adjusted to match backend
            // If you add filters to your backend response, you can uncomment this:
            // availableFilters.value = response.data.filters;
            // console.log(response.data.paginatedData.data);
        } finally {
            isLoading.value = false;
        }
    };
    
    const applyForJob = async (jobId: number, applicationData: Record<string, any>) => {
        isSubmitting.value = true;
        try {
            // Use postWithFiles since we are sending FormData
            const response = await apiService.postWithFiles<ApiResponse>(`/public/job-openings/${jobId}/apply`, applicationData);
            notify(response.notification); // Use the notification from your backend
            return true; // Indicate success
        } catch (err: any) {
            notifyError(err, 'Application failed');
            return err.errors || {}; // Return validation errors on failure
        } finally {
            isSubmitting.value = false;
        }
    };

    return { jobs, availableFilters, isLoading, isSubmitting, fetchJobs, applyForJob };
}