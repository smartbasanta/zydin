import { ref, reactive, watch, onMounted, computed } from 'vue';
import { apiService } from '@/services/api.service';
import type { Permission, PermissionFormData } from '@/types/access-control';
import type { ApiError, ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

// Helper to create a clean copy of the data
function createDataCopy(permission: Permission | null): PermissionFormData {
    return {
        group: permission?.group || null,
        module: permission?.module || null,
        description: permission?.description || null,
    };
}

export function usePermissionFormAPI() {
    const route = useRoute();
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const permissionId = route.params.id as string;

    const permissionData = ref<Permission | null>(null);

    // This will hold the "pristine" state of the form after each fetch/save
    const initialData = reactive<PermissionFormData>({
        group: null,
        module: null,
        description: null,
    });

    // This is the form state that the UI will bind to. It's a copy.
    const form = reactive<PermissionFormData>({ ...initialData });

    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(true);
    
    const dirtyFields = ref<Record<keyof PermissionFormData, boolean>>({
        group: false,
        module: false,
        description: false,
    });
    const isDirty = computed(() => Object.values(dirtyFields.value).some(Boolean));

    // Function to correctly set both initial data and form data
    const setInitialData = (permission: Permission) => {
        permissionData.value = permission;
        const dataCopy = createDataCopy(permission);
        
        // Update both the initial "pristine" state and the form state
        Object.assign(initialData, dataCopy);
        Object.assign(form, dataCopy);
    };

    watch(form, (newForm) => {
        Object.keys(initialData).forEach(key => {
            const typedKey = key as keyof PermissionFormData;
            dirtyFields.value[typedKey] = initialData[typedKey] !== newForm[typedKey];
        });
    }, { deep: true });

    const fetchPermission = async () => {
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>('/access-control/permissions/edit/' + permissionId);
            setInitialData(response.data.permission);
        } catch (err) {
            notifyError(err as any, 'Failed to load permission details');
            router.push({ name: 'access-control.permissions.index' });
        } finally {
            isLoading.value = false;
        }
    };

    const submit = async () => {
        if (!permissionData.value?.id || !isDirty.value) return;
        isLoading.value = true;
        errors.value = {};

        try {
            const response = await apiService.put<ApiResponse>(
                `/access-control/permissions/${permissionData.value.id}`, 
                form // Submit the 'form' object, which is the edited copy
            );
            
            notify(response);
            // On success, update the pristine state to match the newly saved data
            setInitialData(response.data.permission); 
            
            router.push({ name: 'access-control.permissions.show', params: { id: response.data.permission.id } });

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

    onMounted(fetchPermission);

    return {
        permissionData,
        form,
        errors,
        isLoading,
        isDirty,
        dirtyFields,
        submit,
    };
}