<!-- src/views/access-control/user-access/partials/UserPermissionsSection.vue -->
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
  return assignment?.expires_at ? assignment.expires_at.split(' ')[0] : null;
};

const getPermissionCardClasses = (permission: SystemPermissionForAssignment) => {
  if (permission.effective_status_on_target === 'revoked') return '!border-red-600/50 bg-red-500/5 dark:bg-red-900/10';
  if (permission.effective_status_on_target === 'direct') return '!border-sky-500/60 bg-sky-500/5 dark:bg-sky-900/10';
  if (permission.effective_status_on_target === 'inherited') return '!border-amber-500/50 bg-amber-500/5 dark:bg-amber-900/10';
  return 'border-muted bg-white dark:bg-gray-1100';
};

const getPermissionStatusInfo = (permission: SystemPermissionForAssignment) => {
  switch (permission.effective_status_on_target) {
    case 'revoked':
      return { text: 'Revoked', icon: XCircleIcon, class: 'text-red-600 dark:text-red-400' };
    case 'direct':
      return { text: 'Directly Granted', icon: KeyRoundIcon, class: 'text-sky-600 dark:text-sky-400' };
    case 'inherited':
      return { text: 'Inherited from Role', icon: NetworkIcon, class: 'text-amber-600 dark:text-amber-500' };
    default:
      return { text: 'Not Granted', icon: CircleOffIcon, class: 'text-muted' };
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
  <form class="space-y-8">
    <!-- Permissions list -->
    <div v-if="allPermissionsGrouped[activeGroup]" class="space-y-6">
      <div
        v-for="(permissionsList, moduleName) in allPermissionsGrouped[activeGroup]"
        :key="moduleName"
        class="space-y-3"
      >
        <h4 class="font-semibold text-md text-gray-700 dark:text-gray-400">{{ moduleName }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="permission in permissionsList"
            :key="permission.id"
            class="p-3 border rounded-xl space-y-3 flex flex-col h-full transition-all"
            :class="getPermissionCardClasses(permission)"
          >
            <!-- Permission info -->
            <div class="flex-grow">
              <div class="flex justify-between items-start">
                <span class="font-medium text-sm text-gray-900 dark:text-gray-100">{{ permission.name }}</span>
                <ShieldAlertIcon
                  v-if="permission.is_super_user_permission_itself"
                  class="size-4 text-red-500"
                  title="Super User Permission"
                />
                <LockKeyholeIcon
                  v-else-if="permission.is_undelegatable_by_actor"
                  class="size-4 text-orange-500"
                  title="Restricted"
                />
              </div>
              <div class="text-xs text-muted font-mono mt-0.5 break-all">{{ permission.key }}</div>
            </div>

            <!-- Permission status -->
            <div class="text-xs font-semibold flex items-center" :class="getPermissionStatusInfo(permission).class">
              <component :is="getPermissionStatusInfo(permission).icon" class="size-4 mr-1.5" />
              <span>{{ getPermissionStatusInfo(permission).text }}</span>
            </div>

            <!-- Controls -->
            <div
              class="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700/50"
            >
              <label
                :for="`direct_perm_${permission.id}`"
                class="flex items-center space-x-2 text-sm"
                :class="!isDirectAssignCheckboxDisabled(permission) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'"
              >
                <input
                  type="checkbox"
                  :id="`direct_perm_${permission.id}`"
                  :checked="isSelectedDirectly(permission.id)"
                  @change="toggleDirectPermissionSelection(permission)"
                  class="checkbox checkbox-sm"
                  :disabled="isDirectAssignCheckboxDisabled(permission)"
                />
                <span>Direct</span>
              </label>

              <!-- Actions -->
              <div class="flex items-center gap-1">
                <button
                  v-if="canRevoke(permission)"
                  @click="handleRevoke(permission)"
                  type="button"
                  class="btn btn-icon btn-soft-destructive !p-1.5 size-7"
                  title="Revoke inherited permission"
                >
                  <XCircleIcon class="size-4" />
                </button>
                <button
                  v-if="canRestore(permission)"
                  @click="$emit('restore-permission', permission.id)"
                  type="button"
                  class="btn btn-icon btn-soft-success !p-1.5 size-7"
                  title="Restore revoked permission"
                >
                  <RotateCcwIcon class="size-4" />
                </button>
              </div>
            </div>

            <!-- Expiry -->
            <div
              v-if="isSelectedDirectly(permission.id) && !isDirectAssignCheckboxDisabled(permission)"
              class="ml-8 relative"
            >
              <label :for="`perm_expires_${permission.id}`" class="text-xs text-muted mb-1 block">Expires At (Optional)</label>
              <input
                type="date"
                :id="`perm_expires_${permission.id}`"
                :value="getExpiryForPermission(permission.id)"
                @input="updatePermissionExpiry(permission.id, ($event.target as HTMLInputElement).value)"
                class="input input-sm text-xs w-full"
              />
              <InputError :error="getExpiryErrorForPermission(permission.id)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-muted italic p-4 text-center">No permissions found for this group.</div>
  </form>
</template>