import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { Certification, CertificationFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useCertificationFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const certId = route.params.id as string | undefined;

    // REFACTORED: Standardized state management
    const initialData = reactive<CertificationFormData>({
        name: '',
        issuing_body: '',
        description: null,
        logo_image: null,
        logo_url: null,
        pdf_file: null,
        pdf_url: null,
        is_featured: false
    });

    const form = reactive<CertificationFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    // REFACTORED: Simplified watcher
    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof CertificationFormData>).forEach((key) => {
            if (initialData[key] !== newForm[key]) {
                dirtyFields.value[key] = true;
                isDirty.value = true;
            } else {
                dirtyFields.value[key] = false;
            }
        });
    }, { deep: true });
    
    // REFACTORED: To match the robust pattern from useArticleFormAPI
    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            // CORRECTED: Handle both file types
            if ((key === 'logo_image' || key === 'pdf_file') && value) {
                formData.append(key, value as File);
            } else if (key !== 'logo_image' && key !== 'logo_url' && key !== 'pdf_file' && key !== 'pdf_url' && value !== null) {
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (certId) {
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/certifications/${certId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/certifications', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.certifications.index' });

        } catch (error: any)
        {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };
    
    // REFACTORED: Standardized fetch logic
    const fetchCertification = async () => {
        if (!certId) return;
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/certifications/${certId}`);
            const fetchedData = response.data.certification;
            
            const formattedData = {
                ...fetchedData,
                logo_image: null, // Reset file inputs
                pdf_file: null,
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};

        } catch (err) {
            notifyError(err as any, 'Failed to load certification details');
            router.push({ name: 'dashboard.certifications.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (certId) {
            fetchCertification();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}