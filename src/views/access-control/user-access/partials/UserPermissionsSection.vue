<script setup lang="ts">
    import { computed } from 'vue';
    import type {
        TargetUserForEdit,
        GroupedSystemPermissions,
        SystemPermissionForAssignment,
        UserDirectPermissionAssignmentItem,
    } from '@/types/access-control';
    import {
        KeyRoundIcon,
        ShieldAlertIcon,
        LockKeyholeIcon,
        NetworkIcon,
        CircleOffIcon,
        XCircleIcon,
        RotateCcwIcon,
        CalendarIcon,
        Trash2Icon
    } from 'lucide-vue-next';
    import InputError from '@/components/form/InputError.vue';

    const props = defineProps<{
        targetUser: TargetUserForEdit;
        allPermissionsGrouped: GroupedSystemPermissions;
        directPermissionsForm: { direct_permission_assignments: UserDirectPermissionAssignmentItem[] };
        formErrors: Record<string, any>;
        can: {
            assignDirectPermissions: boolean;
            revokePermission: boolean;
            restorePermission: boolean;
            actingUserIsSuperUser: boolean;
        };
        isSyncingPermissions: boolean;
        isDirty: boolean;
        activeGroup: string;
    }>();

    const emit = defineEmits(['revoke-permission', 'restore-permission']);

    const toggleDirectPermissionSelection = (permission: SystemPermissionForAssignment) => {
        if (isDirectAssignCheckboxDisabled(permission)) return;
        const indexInForm = props.directPermissionsForm.direct_permission_assignments.findIndex(
            (dpa) => dpa.id === permission.id
        );
        if (indexInForm > -1) {
            props.directPermissionsForm.direct_permission_assignments.splice(indexInForm, 1);
        } else {
            props.directPermissionsForm.direct_permission_assignments.push({
                id: permission.id,
                expires_at: null,
            });
        }
    };

    const updatePermissionExpiry = (permissionId: number, newExpiryDate: string | null) => {
        const formAssignment = props.directPermissionsForm.direct_permission_assignments.find(
            (dpa) => dpa.id === permissionId
        );
        if (formAssignment) {
            formAssignment.expires_at = newExpiryDate ? `${newExpiryDate} 23:59:59` : null;
        }
    };

    const isSelectedDirectly = (permissionId: number) =>
        props.directPermissionsForm.direct_permission_assignments.some((dpa) => dpa.id === permissionId);

    const getExpiryForPermission = (permissionId: number) => {
        const assignment = props.directPermissionsForm.direct_permission_assignments.find(
            (dpa) => dpa.id === permissionId
        );
        return assignment?.expires_at ? assignment.expires_at.split(' ')[0] : "";
    };

    // Theme-aware card styling based on status
    const getPermissionCardClasses = (permission: SystemPermissionForAssignment) => {
        // Revoked (Red)
        if (permission.effective_status_on_target === 'revoked') 
            return 'border-red-500/50 bg-red-50/50 dark:bg-red-900/10';
        // Direct (Sky)
        if (permission.effective_status_on_target === 'direct') 
            return 'border-sky-500/50 bg-sky-50/50 dark:bg-sky-900/10 ring-1 ring-sky-500/20';
        // Inherited (Amber)
        if (permission.effective_status_on_target === 'inherited') 
            return 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10';
        // Default (Neutral)
        return 'border-muted bg-card-bg hover:border-primary-300 dark:hover:border-primary-700';
    };

    const getPermissionStatusInfo = (permission: SystemPermissionForAssignment) => {
        switch (permission.effective_status_on_target) {
            case 'revoked':
                return { text: 'Revoked', icon: XCircleIcon, class: 'text-red-600 dark:text-red-400' };
            case 'direct':
                return { text: 'Directly Granted', icon: KeyRoundIcon, class: 'text-sky-600 dark:text-sky-400' };
            case 'inherited':
                return { text: 'Inherited', icon: NetworkIcon, class: 'text-amber-600 dark:text-amber-500' };
            default:
                return { text: 'Not Granted', icon: CircleOffIcon, class: 'section-title' };
        }
    };

    const isDirectAssignCheckboxDisabled = (permission: SystemPermissionForAssignment): boolean => {
        if (!props.can.assignDirectPermissions) return true;
        if (permission.is_super_user_permission_itself && !props.can.actingUserIsSuperUser) return true;
        if (permission.is_undelegatable_by_actor) return true;
        return ['revoked', 'inherited'].includes(permission.effective_status_on_target);
    };

    const canRevoke = (permission: SystemPermissionForAssignment): boolean => {
        if (!props.can.revokePermission || permission.is_super_user_permission_itself) return false;
        return permission.effective_status_on_target === 'inherited';
    };

    const canRestore = (permission: SystemPermissionForAssignment): boolean => {
        return props.can.restorePermission && permission.effective_status_on_target === 'revoked';
    };

    const handleRevoke = (permission: SystemPermissionForAssignment) => {
        const reason = prompt(`Enter reason for revoking "${permission.name}" (optional):`);
        if (reason !== null) {
            emit('revoke-permission', { permissionId: permission.id, reason });
        }
    };

    const getExpiryErrorForPermission = (permissionId: number): string | undefined => {
        const index = props.directPermissionsForm.direct_permission_assignments.findIndex(
            (dpa) => dpa.id === permissionId
        );
        if (index === -1) return undefined;
        return props.formErrors[`direct_permission_assignments.${index}.expires_at`]?.[0];
    };
</script>

<template>
    <form class="p-4">
        <!-- Permissions list -->
        <div v-if="allPermissionsGrouped[activeGroup]" class="space-y-8">
            <div
                v-for="(permissionsList, moduleName) in allPermissionsGrouped[activeGroup]"
                :key="moduleName"
                class="space-y-3"
            >
                <h4 class="text-xs font-bold uppercase tracking-wider section-title flex items-center gap-2 border-b border-muted pb-1">
                    <div class="size-1.5 rounded-full bg-primary-500"></div>
                    {{ moduleName }}
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        v-for="permission in permissionsList"
                        :key="permission.id"
                        class="relative p-4 border rounded-xl flex flex-col h-full transition-all duration-200 group select-none"
                        :class="getPermissionCardClasses(permission)"
                    >
                        <!-- Permission Header -->
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex-1 min-w-0 pr-2">
                                <span class="font-bold text-sm section-title block truncate" :title="permission.name">
                                    {{ permission.name }}
                                </span>
                                <code class="text-[10px] section-title font-mono block truncate mt-0.5" :title="permission.key">
                                    {{ permission.key }}
                                </code>
                            </div>
                            
                            <!-- Special Status Icons -->
                            <div v-if="permission.is_super_user_permission_itself || permission.is_undelegatable_by_actor">
                                <ShieldAlertIcon
                                    v-if="permission.is_super_user_permission_itself"
                                    class="size-4 text-red-500"
                                    title="Super User Permission"
                                />
                                <LockKeyholeIcon
                                    v-else
                                    class="size-4 text-amber-500"
                                    title="Restricted"
                                />
                            </div>
                        </div>

                        <!-- Status Info -->
                        <div class="mt-auto pt-3 flex items-center justify-between border-t border-dashed border-muted/50">
                            <div class="flex items-center gap-1.5 text-xs font-medium" :class="getPermissionStatusInfo(permission).class">
                                <component :is="getPermissionStatusInfo(permission).icon" class="size-3.5" />
                                {{ getPermissionStatusInfo(permission).text }}
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-2">
                                <!-- Direct Assignment Checkbox -->
                                <label 
                                    v-if="!['revoked', 'inherited'].includes(permission.effective_status_on_target)"
                                    :for="`direct_perm_${permission.id}`"
                                    class="flex items-center gap-2 cursor-pointer"
                                    :class="{ 'opacity-50 cursor-not-allowed': isDirectAssignCheckboxDisabled(permission) }"
                                >
                                    <span class="text-xs section-title">Direct</span>
                                    <input
                                        type="checkbox"
                                        :id="`direct_perm_${permission.id}`"
                                        :checked="isSelectedDirectly(permission.id)"
                                        @change="toggleDirectPermissionSelection(permission)"
                                        class="checkbox checkbox-sm"
                                        :disabled="isDirectAssignCheckboxDisabled(permission)"
                                    />
                                </label>

                                <!-- Revoke Button -->
                                <button
                                    v-if="canRevoke(permission)"
                                    @click="handleRevoke(permission)"
                                    type="button"
                                    class="btn btn-icon p-1.5 size-7 rounded-full hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30"
                                    title="Revoke inherited permission"
                                >
                                    <XCircleIcon class="size-4" />
                                </button>

                                <!-- Restore Button -->
                                <button
                                    v-if="canRestore(permission)"
                                    @click="$emit('restore-permission', permission.id)"
                                    type="button"
                                    class="btn btn-icon p-1.5 size-7 rounded-full hover:bg-green-100 text-green-600 dark:hover:bg-green-900/30"
                                    title="Restore revoked permission"
                                >
                                    <RotateCcwIcon class="size-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Expiry Field (Only for Direct assignments) -->
                        <div
                            v-if="isSelectedDirectly(permission.id) && !isDirectAssignCheckboxDisabled(permission)"
                            class="mt-3 pt-2 border-t border-muted"
                        >
                            <div class="relative">
                                <CalendarIcon class="absolute left-2 top-1/2 -translate-y-1/2 size-3 section-title pointer-events-none" />
                                <input
                                    type="date"
                                    :id="`perm_expires_${permission.id}`"
                                    :value="getExpiryForPermission(permission.id)"
                                    @input="updatePermissionExpiry(permission.id, ($event.target as HTMLInputElement).value)"
                                    class="input !py-1 !text-[10px] w-full !pl-7 !h-7"
                                    placeholder="Expires"
                                />
                                <button
                                    v-if="getExpiryForPermission(permission.id)"
                                    @click.stop.prevent="updatePermissionExpiry(permission.id, null)"
                                    type="button"
                                    class="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 section-title transition-colors"
                                    title="Clear Date"
                                >
                                    <Trash2Icon class="size-3" />
                                </button>
                            </div>
                            <InputError :error="getExpiryErrorForPermission(permission.id)" class="mt-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-16 section-title text-center border-2 border-dashed border-muted rounded-xl bg-gray-50/50 dark:bg-gray-900/10">
            <KeyRoundIcon class="size-10 opacity-30 mb-2" />
            <p>No permissions found for this group.</p>
        </div>
    </form>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.checkbox:checked {
    @apply bg-sky-500 border-sky-500;
}
</style>