import { ref, reactive, watch, onMounted, computed } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiError, ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

/**
 * A native, dependency-free deep clone function.
 * Uses the modern `structuredClone` API for a robust copy.
 * @param obj The object to clone.
 */
function deepClone<T>(obj: T): T {
    // structuredClone is the modern, standard way to deep-clone objects.
    // It's more robust than the JSON.parse(JSON.stringify(obj)) trick.
    return JSON.parse(JSON.stringify(obj));
    // return structuredClone(obj);
}

// A generic configuration interface
interface FormConfig<T, F> {
    resourceName: string; // e.g., 'brand', 'product'
    apiEndpoint: string; // e.g., '/dashboard/content/brands'
    initialData: F;
    beforeSubmit?: (form: F) => F; // Optional hook to modify form data before submission
}

export function useContentFormAPI<T extends { id: any }, F extends object>(config: FormConfig<T, F>) {
    const router = useRouter();
    const route = useRoute();
    const { notify, error: notifyError } = useNotifier();

    const resourceId = computed(() => route.params.id as string | undefined);
    const isEditMode = computed(() => !!resourceId.value);

    const resourceData = ref<T | null>(null);
    const initialFormState = reactive<F>(deepClone(config.initialData));
    const form = reactive<F>(deepClone(config.initialData));
    
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const dirtyFields = ref<Partial<Record<keyof F, boolean>>>({});
    const isDirty = computed(() => Object.values(dirtyFields.value).some(Boolean));

    const setPristineState = (data: T) => {
        resourceData.value = data;
        const freshData = deepClone(data as unknown as F); // Create a fresh clone
        Object.assign(initialFormState, freshData);
        Object.assign(form, freshData);
        dirtyFields.value = {};
    };

    watch(form, (newForm) => {
        const newDirtyFields: Partial<Record<keyof F, boolean>> = {};
        for (const key in initialFormState) {
            const typedKey = key as keyof F;
            // Use JSON.stringify for a reliable comparison of nested objects/arrays
            const initialValue = (initialFormState as F)[typedKey];
            const currentValue = (newForm as F)[typedKey];
            
            newDirtyFields[typedKey] = JSON.stringify(initialValue) !== JSON.stringify(currentValue);
        }
        dirtyFields.value = newDirtyFields;
    }, { deep: true });

    const fetchResource = async () => {
        if (!isEditMode.value) {
            isLoading.value = false;
            return;
        }
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse<Record<string, T>>>(`${config.apiEndpoint}/${resourceId.value}`);
            setPristineState(response.data[config.resourceName]);
        } catch (err) {
            notifyError(err as ApiError, `Failed to load ${config.resourceName} details`);
            // Redirect or handle error appropriately
        } finally {
            isLoading.value = false;
        }
    };

    const submit = async () => {
        if (!isDirty.value && isEditMode.value) {
            notify({
                message: 'No changes to save.',
                notification: { type: 'info', title: 'Unchanged' }
            } as ApiResponse);
            return;
        }
        isLoading.value = true;
        errors.value = {};
        
        // Create a clone of the form to avoid mutating the reactive state directly
        const formSnapshot = deepClone(form as F);
        const payload = config.beforeSubmit ? config.beforeSubmit(formSnapshot) : formSnapshot;

        try {
            let response: ApiResponse<Record<string, T>>;
            if (isEditMode.value) {
                if (Object.values(payload).some(v => v instanceof File)) {
                    response = await apiService.postWithFiles<ApiResponse<Record<string, T>>>(`${config.apiEndpoint}/${resourceId.value}`, payload as any);
                } else {
                    response = await apiService.put<ApiResponse<Record<string, T>>>(`${config.apiEndpoint}/${resourceId.value}`, payload);
                }
            } else {
                 if (Object.values(payload).some(v => v instanceof File)) {
                    response = await apiService.postWithFiles<ApiResponse<Record<string, T>>>(config.apiEndpoint, payload as any);
                } else {
                    response = await apiService.post<ApiResponse<Record<string, T>>>(config.apiEndpoint, payload);
                }
            }
            
            notify(response);
            setPristineState(response.data[config.resourceName]);
            // Optional: Redirect on success, for example:
            // router.push({ name: `dashboard.${config.resourceName}.index` });

        } catch (error) {
            const apiErr = error as ApiError;
            if (apiErr.errors) {
                errors.value = apiErr.errors;
            }
            notifyError(apiErr);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        isLoading.value = true;
        fetchResource();
    });

    return {
        isEditMode,
        resourceData,
        form,
        errors,
        isLoading,
        isDirty,
        dirtyFields,
        submit,
    };
}