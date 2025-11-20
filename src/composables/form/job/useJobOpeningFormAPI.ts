import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { JobOpening, JobOpeningFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useJobOpeningFormAPI(jobOpening?: JobOpening | null) {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const jobOpeningId = route.params.id as string;

    const jobOpeningData = ref<JobOpening | null>(jobOpening || null);

    const initialData: JobOpeningFormData = {
        title: jobOpeningData.value?.title || '',
        department: jobOpeningData.value?.department || '',
        location: jobOpeningData.value?.location || null,
        type: jobOpeningData.value?.type || 'Full-time',
        description: jobOpeningData.value?.description || null,
        responsibilities: jobOpeningData.value?.responsibilities || [],
        qualifications: jobOpeningData.value?.qualifications || [],
        is_active: jobOpeningData.value?.is_active ?? true,
    };

    const form = reactive<JobOpeningFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof JobOpeningFormData>).forEach((key) => {
            const initialValue = initialData[key];
            const newValue = newForm[key];
            let fieldIsDirty = false;
            if (Array.isArray(initialValue)) {
                fieldIsDirty = JSON.stringify(initialValue) !== JSON.stringify(newValue);
            } else {
                fieldIsDirty = initialValue !== newValue;
            }

            if (fieldIsDirty) {
                dirtyFields.value[key] = true;
                isDirty.value = true;
            } else {
                dirtyFields.value[key] = false;
            }
        });
    }, { deep: true });

    const submit = async () => {
        isLoading.value = true;
        errors.value = {};
        try {
            let response: ApiResponse;
            const payload: Record<string, any> = { ...form };

            if (jobOpeningData.value?.id) {
                response = await apiService.put<ApiResponse>(`/dashboard/jobs/${jobOpeningData.value.id}`, payload);
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/jobs', payload);
            }
            notify(response);
            router.push({ name: 'dashboard.jobs.index' });
            isDirty.value = false;
        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchJobOpening = async () => {
        if (!jobOpeningId) return;
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/jobs/${jobOpeningId}`);
            jobOpeningData.value = response.data.jobOpening;

            const fetchedData = JSON.parse(JSON.stringify(response.data.jobOpening));
            Object.assign(initialData, fetchedData);
            Object.assign(form, fetchedData);

            form.responsibilities = form.responsibilities || [];
            form.qualifications = form.qualifications || [];
            initialData.responsibilities = initialData.responsibilities || [];
            initialData.qualifications = initialData.qualifications || [];

            isDirty.value = false;
            dirtyFields.value = {};

        } catch (err) {
            notifyError(err as any, 'Failed to load job opening');
            router.push({ name: 'dashboard.jobs.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (jobOpeningId && !jobOpeningData.value) {
            fetchJobOpening();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}