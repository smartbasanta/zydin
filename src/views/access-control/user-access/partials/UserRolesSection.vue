<script setup lang="ts">
    import type {
        TargetUserForEdit,
        SystemRoleForAssignment,
        UserRoleAssignmentItem,
    } from "@/types/access-control";
    import {
        CalendarIcon,
        UserIcon,
        Trash2Icon,
        ShieldIcon,
        ClockIcon
    } from "lucide-vue-next";
    import InputError from "@/components/form/InputError.vue";

    const props = defineProps<{
        targetUser: TargetUserForEdit;
        allRoles: SystemRoleForAssignment[];
        rolesForm: { role_assignments: UserRoleAssignmentItem[] };
        formErrors: Record<string, any>;
        canAssignRoles: boolean;
        actingUserIsSuperUser: boolean;
        targetUserIsSelf: boolean;
        isSyncingRoles: boolean;
        isDirty: boolean;
    }>();

    // --- Logic remains the same as it's correct ---
    const toggleRoleSelection = (roleId: number) => {
        if (isRoleDisabled(props.allRoles.find((r) => r.id === roleId)!)) return;
        const indexInForm = props.rolesForm.role_assignments.findIndex(
            (ra) => ra.id === roleId
        );
        if (indexInForm > -1) {
            props.rolesForm.role_assignments.splice(indexInForm, 1);
        } else {
            props.rolesForm.role_assignments.push({ id: roleId, expires_at: null });
        }
    };

    const updateRoleExpiry = (roleId: number, newExpiryDate: string | null) => {
        const formAssignment = props.rolesForm.role_assignments.find(
            (ra) => ra.id === roleId
        );
        if (formAssignment) {
            formAssignment.expires_at = newExpiryDate
                ? `${newExpiryDate} 23:59:59`
                : null;
        }
    };

    const isRoleSelected = (roleId: number) =>
        props.rolesForm.role_assignments.some((ra) => ra.id === roleId);
    const getRoleExpiry = (roleId: number) => {
        const assignment = props.rolesForm.role_assignments.find(
            (ra) => ra.id === roleId
        );
        return assignment?.expires_at ? assignment.expires_at.split(" ")[0] : "";
    };

    const isRoleDisabled = (role: SystemRoleForAssignment): boolean => {
        if (!props.canAssignRoles) return true;
        if (props.targetUserIsSelf && !props.actingUserIsSuperUser && role.key === "super_admin" && isRoleSelected(role.id)) return true;
        if (!props.actingUserIsSuperUser && role.key === "super_admin" && !isRoleSelected(role.id)) return true;
        return false;
    };

    const getExpiryErrorForRole = (roleId: number): string | undefined => {
        const submissionIndex = props.rolesForm.role_assignments.findIndex(
            (ra) => ra.id === roleId
        );
        if (submissionIndex === -1) return undefined;
        return props.formErrors[`role_assignments.${submissionIndex}.expires_at`]?.[0];
    };

    const getGrantorUsername = (roleId: number) =>
        props.targetUser.roles.find((r) => r.id === roleId)?.pivot?.granted_by_username;
    
    const getRoleStyle = (role: SystemRoleForAssignment) =>
        isRoleDisabled(role) || !role.color_dark ? {} : { color: role.color_dark };
</script>

<template>
    <form>
        <div class="p-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div
                    v-for="role in allRoles"
                    :key="role.id"
                    @click="toggleRoleSelection(role.id)"
                    class="relative rounded-xl p-4 flex flex-col justify-between transition-all duration-200 ease-in-out group border select-none"
                    :class="[
                        isRoleDisabled(role)
                            ? 'opacity-60 bg-gray-100 dark:bg-gray-900 cursor-not-allowed border-transparent'
                            : 'bg-primary-200/50 cursor-pointer hover:border-primary-500 hover:shadow-md',
                        isRoleSelected(role.id) && !isRoleDisabled(role)
                            ? 'border-primary-500 ring-2 ring-primary-500/30 header-bg'
                            : 'border-muted',
                    ]"
                >
                    <div>
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <!-- Custom style from DB or default theme color -->
                                <ShieldIcon class="size-4 text-muted" :style="getRoleStyle(role)" />
                                <span class="font-bold text-sm section-title" :style="getRoleStyle(role)">
                                    {{ role.name }}
                                </span>
                            </div>
                            <input
                                type="checkbox"
                                :checked="isRoleSelected(role.id)"
                                class="checkbox"
                                :disabled="isRoleDisabled(role)"
                                @click.stop
                            />
                        </div>
                        
                        <div class="mt-2 space-y-1">
                            <div class="flex items-center gap-2">
                                <code class="text-[10px] text-muted font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-muted">
                                    {{ role.key }}
                                </code>
                                <span class="text-[10px] text-muted border border-muted px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-900">
                                    Lvl: {{ role.level }}
                                </span>
                            </div>
                            
                            <div v-if="role.is_system_role" class="text-[10px] font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1">
                                <span class="size-1.5 rounded-full bg-amber-500"></span> System Role
                            </div>
                        </div>

                        <div v-if="isRoleSelected(role.id) && getGrantorUsername(role.id)" class="text-xs text-muted mt-3 pt-2 border-t border-dashed border-muted flex items-center gap-1.5">
                            <UserIcon class="size-3" /> 
                            <span class="opacity-70">Assigned by:</span> 
                            <span class="font-medium section-title">{{ getGrantorUsername(role.id) }}</span>
                        </div>
                    </div>

                    <!-- Expiry Date Picker -->
                    <div class="mt-4 pt-3 border-t border-muted" v-if="isRoleSelected(role.id) && !isRoleDisabled(role)">
                        <label :for="`role_expires_${role.id}`" class="text-xs font-semibold text-muted mb-1.5 flex items-center gap-1">
                            <ClockIcon class="size-3" /> Expires At (Optional)
                        </label>
                        <div class="relative">
                            <CalendarIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted pointer-events-none" />
                            <input
                                type="date"
                                :id="`role_expires_${role.id}`"
                                :value="getRoleExpiry(role.id)"
                                @input="updateRoleExpiry(role.id, ($event.target as HTMLInputElement).value)"
                                @click.stop
                                class="input !py-1.5 !text-xs w-full !pl-8"
                            />
                            <button
                                v-if="getRoleExpiry(role.id)"
                                @click.stop.prevent="updateRoleExpiry(role.id, null)"
                                type="button"
                                class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-muted transition-colors"
                                title="Clear Date"
                            >
                                <Trash2Icon class="size-3" />
                            </button>
                        </div>
                        <InputError :error="getExpiryErrorForRole(role.id)" class="mt-1" />
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Override generic checkbox color to match theme primary */
.checkbox:checked {
    @apply bg-primary-600 border-primary-600;
}
</style>