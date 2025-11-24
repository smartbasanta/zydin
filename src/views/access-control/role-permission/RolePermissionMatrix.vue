<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { apiService } from '@/services/api.service';
    import type { SystemRoleForAssignment, SystemPermissionForAssignment, GroupedSystemPermissions, RolePermissionSyncPayload } from '@/types/access-control';
    import { useNotifier } from '@/composables/useNotifier';
    import { usePermissions } from '@/composables/access-control/usePermissions';
    import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
    import { 
        UploadCloudIcon, 
        ShieldCheckIcon, 
        GitForkIcon, 
        LockIcon,
        CheckCircle2Icon,
        SearchIcon
    } from 'lucide-vue-next';
    import type { ApiResponse } from '@/types/api';
    import LoadingState from '@/components/loading/LoadingState.vue';

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
    const roleSearch = ref('');

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

    const filteredRoles = computed(() => {
        if (!roleSearch.value) return roles.value;
        return roles.value.filter(r => r.name.toLowerCase().includes(roleSearch.value.toLowerCase()));
    });

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
        if (!selectedRole.value || !canAssignPermissions.value) return false;
        return actingUserIsSuperUser.value || !selectedRole.value.is_system_role;
    });

    const isPermissionDisabled = (permission: SystemPermissionForAssignment): boolean => {
        if (!canModifySelectedRolePermissions.value) return true;
        return permission.is_undelegatable_by_actor;
    };
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-6 p-6 md:p-8 h-[calc(100vh-theme(space.20))]">

        <!-- LEFT: Roles Sidebar -->
        <aside class="w-full lg:w-1/4 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-muted shadow-sm overflow-hidden">
            <!-- Search Header -->
            <div class="p-4 border-b border-muted bg-gray-50/50 dark:bg-gray-800/30">
                <h3 class="text-lg font-bold text-primary-50 mb-3">Select Role</h3>
                <div class="relative">
                    <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input 
                        v-model="roleSearch"
                        type="text" 
                        placeholder="Filter roles..." 
                        class="input pl-9 w-full text-sm !py-2"
                    />
                </div>
            </div>

            <!-- Roles List -->
            <div class="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                <LoadingState v-if="isLoading" message="Loading roles..." />
                
                <template v-else>
                    <button
                        v-for="role in filteredRoles"
                        :key="role.id"
                        @click="selectRole(role)"
                        class="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative"
                        :class="selectedRole?.id === role.id 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800' 
                            : 'text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'"
                    >
                        <div class="flex-1">
                            <span class="font-semibold text-sm block">{{ role.name }}</span>
                            <span v-if="role.is_system_role" class="text-[10px] uppercase tracking-wider text-muted font-medium">System Role</span>
                        </div>
                        
                        <!-- Active Indicator -->
                        <div v-if="selectedRole?.id === role.id" class="size-2 rounded-full bg-primary-500 shadow-sm"></div>
                    </button>

                    <div v-if="!filteredRoles.length" class="p-8 text-center text-muted text-sm">
                        No roles found.
                    </div>
                </template>
            </div>
        </aside>

        <!-- RIGHT: Permissions Workspace -->
        <section class="flex-1 flex flex-col rounded-2xl border border-muted bg-white dark:bg-gray-900 shadow-sm overflow-hidden relative">
            <template v-if="selectedRole">
                <!-- Sticky Header -->
                <div class="p-5 border-b border-muted bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 flex items-center justify-between sticky top-0">
                    <div>
                        <h2 class="text-xl font-bold text-primary-50 flex items-center gap-2">
                            <ShieldCheckIcon class="size-5 text-primary-500" />
                            Permissions for <span class="text-primary-600 dark:text-primary-400">{{ selectedRole.name }}</span>
                        </h2>
                        <div v-if="!canModifySelectedRolePermissions" class="flex items-center gap-1.5 mt-1 text-xs text-amber-600 dark:text-amber-500 font-medium">
                            <LockIcon class="size-3" />
                            Read-only mode: System Role permissions are locked.
                        </div>
                    </div>

                    <button 
                        v-if="canAssignPermissions" 
                        @click="submitPermissions"
                        class="btn btn-primary" 
                        :disabled="isSyncing || isLoadingPermissions || !canModifySelectedRolePermissions"
                    >
                        <component :is="isSyncing ? 'Loader2Icon' : UploadCloudIcon" class="size-4 mr-2" :class="{'animate-spin': isSyncing}" />
                        {{ isSyncing ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>

                <!-- Permissions Content -->
                <div class="flex-grow overflow-y-auto p-6 custom-scrollbar bg-card-bg">
                    <LoadingState v-if="isLoadingPermissions" message="Fetching permissions..." />
                    
                    <div v-else-if="!Object.keys(permissionsGrouped).length" class="flex flex-col items-center justify-center h-64 text-center">
                        <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                            <GitForkIcon class="size-6 text-muted" />
                        </div>
                        <p class="text-muted">No assignable permissions found.</p>
                    </div>
                    
                    <div v-else class="space-y-10">
                        <div v-for="(modules, groupName) in permissionsGrouped" :key="groupName.toString()" class="relative">
                            <!-- Group Title -->
                            <h3 class="text-lg font-bold text-primary-50 mb-6 pb-2 border-b border-muted sticky top-0 z-20">
                                {{ groupName.toString() || 'General' }}
                            </h3>
                            
                            <div class="space-y-8 pl-2">
                                <div v-for="(permissionsList, moduleName) in modules" :key="moduleName.toString()">
                                    <h4 class="text-sm font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                                        <div class="w-1.5 h-1.5 rounded-full bg-secondary-400"></div>
                                        {{ moduleName.toString() || 'Core' }}
                                    </h4>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        <div v-for="permission in permissionsList" :key="permission.id" class="relative h-full">
                                            <label 
                                                :for="`perm_${permission.id}`"
                                                class="flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 h-full cursor-pointer select-none"
                                                :class="[
                                                    // Disabled State
                                                    isPermissionDisabled(permission) 
                                                        ? 'opacity-50 bg-gray-50 dark:bg-gray-800 border-transparent cursor-not-allowed'
                                                        : 'bg-white dark:bg-gray-800/50 border-muted hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md',
                                                    // Active State
                                                    assignedPermissionIdsForm.includes(permission.id) && !isPermissionDisabled(permission)
                                                        ? 'ring-2 ring-primary-500 border-transparent bg-primary-50/50 dark:bg-primary-900/10'
                                                        : ''
                                                ]"
                                            >
                                                <div class="pt-0.5">
                                                    <input 
                                                        type="checkbox" 
                                                        :id="`perm_${permission.id}`" 
                                                        v-model="assignedPermissionIdsForm" 
                                                        :value="permission.id" 
                                                        class="checkbox"
                                                        :disabled="isPermissionDisabled(permission)"
                                                    />
                                                </div>
                                                
                                                <div class="flex-1 min-w-0">
                                                    <div class="font-semibold text-sm text-primary-50 mb-0.5">{{ permission.name }}</div>
                                                    <code class="text-[10px] text-muted bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded border border-muted break-all font-mono inline-block mb-1">
                                                        {{ permission.key }}
                                                    </code>
                                                    <p v-if="permission.description" class="text-xs text-muted mt-1 leading-snug line-clamp-2">
                                                        {{ permission.description }}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Empty State (No Role Selected) -->
            <div v-else class="flex-grow flex flex-col items-center justify-center p-10 text-center">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner">
                    <ShieldCheckIcon class="size-10 text-muted" />
                </div>
                <h2 class="text-2xl font-bold section-title mb-2">Select a Role to Manage</h2>
                <p class="text-muted max-w-md">
                    Choose a role from the sidebar to view and configure its permissions matrix.
                </p>
            </div>
        </section>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.checkbox {
    @apply rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:checked:bg-primary-500;
}
</style>