import { ref, reactive, watch, onMounted, computed } from 'vue';
import { apiService } from '@/services/api.service';
import type { Role, RoleFormData } from '@/types/access-control';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useRoleFormAPI(role?: Role | null) {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const roleId = route.params.id as string;

    const roleData = ref<Role | null>(role || null);

    const initialData: RoleFormData = {
        key: roleData.value?.key || '',
        name: roleData.value?.name || '',
        description: roleData.value?.description || null,
        level: roleData.value?.level || 0,
        is_default: roleData.value?.is_default || false,
        color_light: roleData.value?.color_light || '#FFFFFF',
        color_dark: roleData.value?.color_dark || '#000000',
    };

    const form = reactive<RoleFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    // Watch for changes to mark form and individual fields as dirty
    watch(
        form,
        (newForm) => {
            isDirty.value = false;
            dirtyFields.value = {};

            Object.keys(initialData).forEach((key) => {
                const initialValue = initialData[key as keyof RoleFormData];
                const currentValue = newForm[key as keyof RoleFormData];

                // Compare initial and current values
                if (initialValue !== currentValue) {
                    dirtyFields.value[key] = true;
                    isDirty.value = true; // Set form as dirty if any field is dirty
                } else {
                    dirtyFields.value[key] = false;
                }
            });
        },
        { deep: true }
    );

    const resetForm = () => {
        Object.assign(form, initialData);
        errors.value = {};
        isLoading.value = false;
        isDirty.value = false;
        dirtyFields.value = {};
    };

    const generateKey = () => {
        if (!form.key && form.name && !roleData.value) {
            form.key = form.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^\w.-]+/g, '');
        }
    };

    const submit = async () => {
        isLoading.value = true;
        errors.value = {};
        generateKey();

        try {
            let response: ApiResponse;

            if (roleData.value?.id) {
                const updatePayload = { ...form };
                delete (updatePayload as any).key;
                response = await apiService.put<ApiResponse>(`/access-control/roles/${roleData.value.id}`, updatePayload);
                notify(response);
                router.push({ name: 'access-control.roles.show', params: { id: response.data.role.id } });
            } else {
                response = await apiService.post<ApiResponse>('/access-control/roles', form);
                router.push({ name: 'access-control.roles.show', params: { id: response.data.role.id } });
                notify(response);
            }

            // Update initialData with the submitted data to reset dirty state
            Object.assign(initialData, form);
            isDirty.value = false;
            dirtyFields.value = {};

        } catch (error: any) {
            if (error.errors) {
                errors.value = error.errors;
            }
            notifyError(error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchRole = async () => {
        if (!roleId) {
            roleData.value = null;
            Object.assign(form, initialData);
            return;
        }

        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/access-control/roles/edit/${roleId}`);
            roleData.value = response.data.role;
            Object.assign(initialData, roleData.value);
            Object.assign(form, roleData.value);
            dirtyFields.value = {};
            return roleData;
        } catch (err) {
            notifyError(err as any, 'Failed to load role details');
            router.push({ name: 'access-control.roles.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (roleId && !roleData.value) {
            fetchRole();
        }
    });

    return {
        form,
        errors,
        isLoading,
        isDirty,
        dirtyFields, 
        submit,
        resetForm,
        generateKey,
    };
}