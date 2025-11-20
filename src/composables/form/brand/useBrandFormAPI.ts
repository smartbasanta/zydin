import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { Brand, BrandFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useBrandFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const brandId = route.params.id as string | undefined;

    // REFACTORED: Standardized state management
    const initialData = reactive<BrandFormData>({
        name: '',
        slug: '',
        description: null,
        is_featured: false,
        image: null,
        image_url: null,
    });

    const form = reactive<BrandFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof BrandFormData>).forEach((key) => {
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
            if (key === 'image' && value) {
                formData.append(key, value as File);
            } else if (key !== 'image' && key !== 'image_url' && value !== null) {
                // CORRECTED: This is the critical fix for the boolean toggle
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (brandId) {
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/brands/${brandId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/brands', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.brands.index' });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    // REFACTORED: Standardized fetch logic
    const fetchBrand = async () => {
        if (!brandId) return;
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/brands/${brandId}`);
            const fetchedData = response.data.brand;
            
            const formattedData = {
                ...fetchedData,
                image: null, // Reset file input
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            
        } catch (err) {
            notifyError(err as any, 'Failed to load brand details');
            router.push({ name: 'dashboard.brands.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (brandId) {
            fetchBrand();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}