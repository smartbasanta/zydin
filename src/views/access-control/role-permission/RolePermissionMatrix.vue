<script setup lang="ts">
    import { ref, watch, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { apiService } from '@/services/api.service';
    import type { SystemRoleForAssignment, SystemPermissionForAssignment, GroupedSystemPermissions, RolePermissionSyncPayload } from '@/types/access-control';
    import { useNotifier } from '@/composables/useNotifier';
    import { usePermissions } from '@/composables/access-control/usePermissions';
    import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
    import { UploadCloudIcon, ShieldUserIcon, GitForkIcon, LockIcon } from 'lucide-vue-next';
    import type { ApiResponse } from '@/types/api';
    import LoadingState from '@/components/card/LoadingState.vue'; // <-- Import LoadingState

    const router = useRouter();
    const route = useRoute();
    const { notify, error: notifyError } = useNotifier();
    const { hasPermission } = usePermissions();

    const roles = ref<SystemRoleForAssignment[]>([]);
    const permissionsGrouped = ref<GroupedSystemPermissions>({});
    const selectedRole = ref<SystemRoleForAssignment | null>(null);
    const actingUserIsSuperUser = ref(false);
    const isSyncing = ref(false);
    const isLoadingPermissions = ref(false);

    const assignedPermissionIdsForm = ref<number[]>([]);

    const fetchInitialData = async () => {
        try {
            const response = await apiService.get<ApiResponse>('/access-control/role-permissions');
            
            roles.value = response.data.roles;
            permissionsGrouped.value = response.data.permissionsGrouped;
            actingUserIsSuperUser.value = response.data.actingUserIsSuperUser;
            
            const roleIdFromQuery = route.query.selected_role?.toString();
            if (roleIdFromQuery && roles.value.length > 0) {
                const roleToSelect = roles.value.find(r => r.id.toString() === roleIdFromQuery);
                if (roleToSelect) {
                    await selectRole(roleToSelect);
                }
            }
        } catch (err) {
            notifyError(err as any, 'Failed to load role-permission data');
        }
    };

    const { isLoading, retry } = useNamedComponentLoader('role-permission-matrix', fetchInitialData);

    const selectRole = async (role: SystemRoleForAssignment) => {
        isLoadingPermissions.value = true;
        selectedRole.value = role;
        router.replace({ query: { ...route.query, selected_role: role.id.toString() } });
        
        try {
            const response = await apiService.get<ApiResponse>(`/access-control/role-permissions?selected_role=${role.id}`);
            assignedPermissionIdsForm.value = response.data.assignedPermissionIds || [];
        } catch (err) {
            notifyError(err as any, `Failed to load permissions for role ${role.name}`);
            assignedPermissionIdsForm.value = [];
        } finally {
            isLoadingPermissions.value = false;
        }
    };

    const submitPermissions = async () => {
        if (!selectedRole.value || !canModifySelectedRolePermissions.value) return;
        isSyncing.value = true;
        const payload: RolePermissionSyncPayload = { permission_ids: assignedPermissionIdsForm.value };
        try {
            const response = await apiService.put<ApiResponse>(`/access-control/role-permissions/${selectedRole.value.id}`, payload);
            notify(response);
        } catch (err) {
            notifyError(err as any, 'Failed to sync permissions');
        } finally {
            isSyncing.value = false;
        }
    };

    const canAssignPermissions = computed(() => hasPermission('access_control.roles.assign_permissions'));
    const canModifySelectedRolePermissions = computed(() => {
        // console.log(canAssignPermissions.value);
        if (!selectedRole.value || !canAssignPermissions.value) return false;
        return actingUserIsSuperUser.value || !selectedRole.value.is_system_role;
    });

    const isPermissionDisabled = (permission: SystemPermissionForAssignment): boolean => {
        if (!canModifySelectedRolePermissions.value) return true;
        return permission.is_undelegatable_by_actor;
    };
    const getPermissionDisabledTitle = (permission: SystemPermissionForAssignment): string => {
        if (!canModifySelectedRolePermissions.value) return "Permissions for this role cannot be modified by you.";
        if (permission.is_undelegatable_by_actor) return "This permission is restricted and cannot be assigned by you.";
        return permission.name;
    };
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6 p-4 md:p-6 h-[calc(100vh-theme(space.24))] font-poppins">

        <!-- ============== -->
        <!-- = ROLES LIST = -->
        <!-- ============== -->
        <aside class="w-full md:w-1/3 lg:w-1/4 flex flex-col border border-muted rounded-2xl bg-white/60 dark:bg-black/10 shadow-xl dark:shadow-black/40 backdrop-blur-md">
            <div class="p-4 border-b border-muted flex-shrink-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Roles ({{ roles.length }})</h3>
            </div>
            <div class="flex-grow overflow-y-auto custom-scrollbar">
                <LoadingState v-if="isLoading" message="Loading roles..." />
                <nav v-else class="p-2 space-y-1">
                    <button
                        v-for="role in roles"
                        :key="role.id"
                        type="button"
                        @click="selectRole(role)"
                        :title="`Manage permissions for ${role.name}`"
                        class="group w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ease-out cursor-pointer"
                        :class="{
                            'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-800/40 scale-105': selectedRole?.id === role.id,
                            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-1000/50 hover:pl-4': selectedRole?.id !== role.id,
                        }"
                    >
                        <span class="font-semibold text-sm flex-grow transition-colors">{{ role.name }}</span>
                        <span v-if="selectedRole?.id === role.id" class="size-2 rounded-full bg-white animate-pulse"></span>
                    </button>
                    <div v-if="!roles.length && !isLoading" class="p-4 text-center text-muted italic">No roles found.</div>
                </nav>
            </div>
        </aside>

        <!-- ==================== -->
        <!-- = PERMISSIONS AREA = -->
        <!-- ==================== -->
        <section class="flex-1 flex flex-col h-full border border-muted rounded-2xl bg-white/60 dark:bg-black/5 shadow-xl dark:shadow-black/40 backdrop-blur-md overflow-hidden">
            <template v-if="selectedRole">
                <form @submit.prevent="submitPermissions" class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="p-4 border-b border-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap flex-shrink-0 bg-white/30 dark:bg-black/10">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                <GitForkIcon class="text-orange-600 dark:text-orange-400" />
                                <span>Permissions for <span class="text-orange-600 dark:text-orange-400">{{ selectedRole.name }}</span></span>
                            </h2>
                             <p v-if="!canModifySelectedRolePermissions" class="text-xs text-yellow-600 dark:text-yellow-400 mt-1 pl-10 flex items-center gap-1.5">
                                <LockIcon class="size-3" />
                                Permissions for this core role are restricted.
                            </p>
                        </div>
                        <button v-if="canAssignPermissions" type="submit" class="btn btn-primary" :disabled="isSyncing || isLoadingPermissions || !canModifySelectedRolePermissions" :title="!canModifySelectedRolePermissions ? 'Permissions for this role cannot be modified by you.' : 'Sync Permissions'">
                            <UploadCloudIcon class="size-4 mr-1.5" />
                            {{ isSyncing ? 'Syncing...' : 'Sync Permissions' }}
                        </button>
                    </div>

                    <!-- Permissions List -->
                    <div class="flex-grow overflow-y-auto p-4 space-y-8 custom-scrollbar">
                        <LoadingState v-if="isLoadingPermissions" message="Loading permissions..." />
                        <div v-else-if="!Object.keys(permissionsGrouped).length" class="text-center text-muted italic py-10">No assignable permissions found.</div>
                        
                        <div v-for="(modules, groupName) in permissionsGrouped" :key="groupName.toString()" class="space-y-6">
                            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-200 border-b-2 border-orange-500/30 pb-2">{{ groupName.toString() || 'Ungrouped' }}</h3>
                            
                            <div v-for="(permissionsList, moduleName) in modules" :key="moduleName.toString()" class="ml-0 md:ml-4 space-y-4">
                                <h4 class="font-semibold text-md text-gray-700 dark:text-gray-400">{{ moduleName.toString() || 'General' }}</h4>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div v-for="permission in permissionsList" :key="permission.id" class="h-full">
                                        <label :for="`perm_${permission.id}`"
                                            class="flex items-start gap-4 p-4 border rounded-xl transition-all h-full"
                                            :class="[
                                                isPermissionDisabled(permission) 
                                                    ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-1000' 
                                                    : 'hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer',
                                                assignedPermissionIdsForm.includes(permission.id) && !isPermissionDisabled(permission) 
                                                    ? 'border-orange-500 ring-2 ring-orange-500/50 bg-orange-500/10' 
                                                    : 'border-muted'
                                            ]"
                                            :title="getPermissionDisabledTitle(permission)">
                                            
                                            <input 
                                                type="checkbox" 
                                                :id="`perm_${permission.id}`" 
                                                v-model="assignedPermissionIdsForm" 
                                                :value="permission.id" 
                                                class="checkbox mt-1 flex-shrink-0"
                                                :disabled="isPermissionDisabled(permission)"
                                            />
                                            
                                            <div class="flex-1">
                                                <div class="font-medium text-sm text-gray-900 dark:text-gray-100">{{ permission.name }}</div>
                                                <div class="text-xs text-muted font-mono mt-1 break-all">{{ permission.key }}</div>
                                                <p v-if="permission.description" class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{{ permission.description }}</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </template>
            <!-- Placeholder when no role is selected -->
            <div v-else class="flex-grow flex items-center justify-center h-full p-10">
                <div class="text-center text-muted p-10 border-2 border-dashed border-muted rounded-2xl max-w-md bg-white/50 dark:bg-white/5">
                    <ShieldUserIcon class="w-16 h-16 mx-auto mb-4 text-orange-500/50" />
                    <p class="font-semibold text-lg">Select a Role</p>
                    <p class="text-sm">Please select a role from the list on the left to manage its assigned permissions.</p>
                </div>
            </div>
        </section>
    </div>
</template>