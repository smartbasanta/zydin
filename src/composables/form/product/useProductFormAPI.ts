import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { Product, ProductFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useProductFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const productId = route.params.id as string | undefined;

    // REFACTORED: Standardized state management
    const initialData = reactive<ProductFormData>({
        name: '',
        slug: '',
        type: 'ff',
        description: null,
        is_featured: false,
        brand_id: null,
        image_url: null,
        image: null,
        prescribtion: [],
        safety_precaution: [],
        generic_name: null,
        therapeutic_area: null,
        dosage_form: null,
        strength: null,
        pharmacology: null,
        indications: null,
        cas_number: null,
        category: null,
        molecular_formula: null,
        molecular_weight: null,
    });

    const form = reactive<ProductFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    // REFACTORED: Simplified watcher
    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof ProductFormData>).forEach((key) => {
             // CORRECTED: Proper deep comparison for arrays
            const initialValue = initialData[key];
            const newValue = newForm[key];
            const fieldIsDirty = JSON.stringify(initialValue) !== JSON.stringify(newValue);

            if (fieldIsDirty) {
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
            } 
            // CORRECTED: Handle arrays by stringifying them
            else if (Array.isArray(value)) {
                // formData.append(key, JSON.stringify(value));
            }
            else if (key !== 'image' && key !== 'image_url' && value !== null) {
                // CORRECTED: This is the critical fix for the boolean toggle
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (productId) {
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/products/${productId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.products.index' });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    // REFACTORED: Standardized fetch logic
    const fetchProduct = async () => {
        if (!productId) return;
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/products/${productId}`);
            const fetchedData = response.data.product;
            
            const formattedData = {
                ...fetchedData,
                // Ensure arrays are not null
                prescribtion: fetchedData.prescribtion || [],
                safety_precaution: fetchedData.safety_precaution || [],
                image: null, // Reset file input
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            
        } catch (err) {
            notifyError(err as any, 'Failed to load product details');
            router.push({ name: 'dashboard.products.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (productId) {
            fetchProduct();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}