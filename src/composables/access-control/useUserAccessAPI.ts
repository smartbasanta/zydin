import { ref, reactive, watch, computed } from 'vue';
import { apiService } from '@/services/api.service';
import type {
    UserAccessEditData,
    UserRolesUpdatePayload,
    UserDirectPermissionsUpdatePayload,
} from '@/types/access-control';
import type { ApiError, ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
import { useRouter } from 'vue-router';

function cloneAssignments<T extends { id: number; expires_at: string | null }>(assignments: T[]): T[] {
    return assignments.map(a => ({ ...a }));
}

export function useUserAccessAPI(targetUserId: string) {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();

    const editData = ref<UserAccessEditData | null>(null);
    const isSubmitting = ref(false);
    const submissionErrors = ref<Record<string, any>>({});

    const rolesForm = reactive<UserRolesUpdatePayload>({ role_assignments: [] });
    const directPermissionsForm = reactive<UserDirectPermissionsUpdatePayload>({ direct_permission_assignments: [] });
    
    let pristineRolesForm: UserRolesUpdatePayload = { role_assignments: [] };
    let pristineDirectPermissionsForm: UserDirectPermissionsUpdatePayload = { direct_permission_assignments: [] };

    const isRolesFormDirty = computed(() => JSON.stringify(rolesForm.role_assignments) !== JSON.stringify(pristineRolesForm.role_assignments));
    const isPermissionsFormDirty = computed(() => JSON.stringify(directPermissionsForm.direct_permission_assignments) !== JSON.stringify(pristineDirectPermissionsForm.direct_permission_assignments));

    const setPristineState = () => {
        if (!editData.value) return;
        
        const initialRoles = editData.value.user.roles.map(r => ({ id: r.id, expires_at: r.pivot?.expires_at || null }));
        const initialPermissions = editData.value.user.permissions.map(p => ({ id: p.id, expires_at: p.pivot?.expires_at || null }));
        
        pristineRolesForm = { role_assignments: cloneAssignments(initialRoles) };
        pristineDirectPermissionsForm = { direct_permission_assignments: cloneAssignments(initialPermissions) };

        rolesForm.role_assignments = cloneAssignments(initialRoles);
        directPermissionsForm.direct_permission_assignments = cloneAssignments(initialPermissions);
    };
    
    const fetchUserAccessData = async () => {
        try {
            const response = await apiService.get<ApiResponse<UserAccessEditData>>(`/access-control/user-access/${targetUserId}/edit-data`);
            editData.value = response.data;
            setPristineState();
        } catch (err) {
            notifyError(err as ApiError, 'Failed to load user access data');
            router.push({ name: 'access-control.user-access.index' });
        }
    };

    const { isLoading, retry } = useNamedComponentLoader('user-access-edit', fetchUserAccessData);
    
    const handleApiSubmit = async (apiCall: Promise<ApiResponse>, successMessage: string) => {
        isSubmitting.value = true;
        submissionErrors.value = {};
        try {
            const response = await apiCall;
            notify(response);
            await retry();
        } catch (err: any) {
            submissionErrors.value = err.errors || { general: [err.message || 'An unknown error occurred.'] };
            notifyError(err);
        } finally {
            isSubmitting.value = false;
        }
    };

    const updateRoles = () => {
        if (!editData.value?.can.assignRoles || !isRolesFormDirty.value) return;
        handleApiSubmit(apiService.put(`/access-control/user-access/${targetUserId}/roles`, rolesForm), "User roles updated.");
    };

    const syncDirectPermissions = () => {
        if (!editData.value?.can.assignDirectPermissions || !isPermissionsFormDirty.value) return;
        handleApiSubmit(apiService.put(`/access-control/user-access/${targetUserId}/direct-permissions`, directPermissionsForm), "Direct permissions updated.");
    };

    const revokePermission = (payload: { permissionId: number, reason: string | null }) => {
        if (!editData.value?.can.revokePermission) return;
        handleApiSubmit(apiService.post(`/access-control/user-access/${targetUserId}/permissions/${payload.permissionId}/revoke`, { reason: payload.reason }), "Permission revoked.");
    };

    const restoreRevokedPermission = (permissionId: number) => {
        if (!editData.value?.can.restorePermission) return;
        handleApiSubmit(apiService.post(`/access-control/user-access/${targetUserId}/permissions/${permissionId}/restore`, {}), "Permission restored.");
    };

    return {
        editData, isLoading, isSubmitting, submissionErrors,
        rolesForm, directPermissionsForm,
        isRolesFormDirty, isPermissionsFormDirty,
        retry, updateRoles, syncDirectPermissions,
        revokePermission, restoreRevokedPermission,
    };
}