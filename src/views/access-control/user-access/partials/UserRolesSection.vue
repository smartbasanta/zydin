<script setup lang="ts">
    import type {
        TargetUserForEdit,
        SystemRoleForAssignment,
        UserRoleAssignmentItem,
    } from "@/types/access-control";
    import {
        CheckSquareIcon,
        CalendarIcon,
        UserIcon,
        Trash2Icon,
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
        if (
            props.targetUserIsSelf &&
            !props.actingUserIsSuperUser &&
            role.key === "super_admin" &&
            isRoleSelected(role.id)
        )
            return true;
        if (
            !props.actingUserIsSuperUser &&
            role.key === "super_admin" &&
            !isRoleSelected(role.id)
        )
            return true;
        return false;
    };

    const getRoleDisabledTitle = (role: SystemRoleForAssignment): string => {
        if (isRoleDisabled(role)) {
            if (!props.canAssignRoles)
                return "You cannot assign roles to this user.";
            if (role.key === "super_admin")
                return props.targetUserIsSelf
                    ? "Cannot remove your own Super Admin role."
                    : "Only a Super User can assign this role.";
        }
        return `Assign or remove the '${role.name}' role.`;
    };

    const getExpiryErrorForRole = (roleId: number): string | undefined => {
        const submissionIndex = props.rolesForm.role_assignments.findIndex(
            (ra) => ra.id === roleId
        );
        if (submissionIndex === -1) return undefined;
        return props.formErrors[
            `role_assignments.${submissionIndex}.expires_at`
        ]?.[0];
    };

    const getGrantorUsername = (roleId: number) =>
        props.targetUser.roles.find((r) => r.id === roleId)?.pivot
            ?.granted_by_username;
    const getRoleStyle = (role: SystemRoleForAssignment) =>
        isRoleDisabled(role) || !role.color_dark ? {} : { color: role.color_dark };
</script>

<template>
	<form>
		<div class="p-4">
			<div
				class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
			>
				<div
					v-for="role in allRoles"
					:key="role.id"
					@click="toggleRoleSelection(role.id)"
					class="relative border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 ease-in-out group"
					:class="[
						isRoleDisabled(role)
							? 'opacity-60 bg-gray-100 dark:bg-gray-1000 cursor-not-allowed'
							: 'bg-white dark:bg-gray-1100 hover:border-orange-500 cursor-pointer',
						isRoleSelected(role.id) && !isRoleDisabled(role)
							? 'border-orange-500 ring-2 ring-orange-500/50'
							: 'border-muted',
					]"
				>
					<div>
						<div class="flex justify-between items-start">
							<div
								class="font-semibold text-md"
								:style="getRoleStyle(role)"
							>
								{{ role.name }}
							</div>
							<input
								type="checkbox"
								:checked="isRoleSelected(role.id)"
								class="checkbox"
								:disabled="isRoleDisabled(role)"
								@click.stop
							/>
						</div>
						<div class="text-xs text-muted font-mono mt-0.5">
							{{ role.key }}
						</div>
						<div class="text-xs mt-1">
							<span
								v-if="role.is_system_role"
								class="font-semibold text-amber-600 dark:text-amber-500"
								>(System)</span
							>
							<span class="text-muted ml-1"
								>Lvl: {{ role.level }}</span
							>
						</div>
						<div
							v-if="
								isRoleSelected(role.id) &&
								getGrantorUsername(role.id)
							"
							class="text-xs text-secondary mt-2 flex items-center gap-1.5"
						>
							<UserIcon class="size-3" /> Assigned by:
							{{ getGrantorUsername(role.id) }}
						</div>
					</div>
					<div
						class="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-800/50"
						v-if="isRoleSelected(role.id) && !isRoleDisabled(role)"
					>
						<label
							:for="`role_expires_${role.id}`"
							class="text-xs text-muted mb-1 block"
							>Expires At (Optional)</label
						>
						<div class="relative">
							<CalendarIcon
								class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400"
							/>
							<input
								type="date"
								:id="`role_expires_${role.id}`"
								:value="getRoleExpiry(role.id)"
								@input="
									updateRoleExpiry(
										role.id,
										($event.target as HTMLInputElement)
											.value
									)
								"
								@click.stop
								class="input input-sm text-xs w-full !pl-8"
							/>
							<button
								v-if="getRoleExpiry(role.id)"
								@click.stop.prevent="
									updateRoleExpiry(role.id, null)
								"
								type="button"
								class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
							>
								<Trash2Icon class="size-3.5 text-gray-500" />
							</button>
						</div>
						<InputError
							:error="getExpiryErrorForRole(role.id)"
							class="mt-1"
						/>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>
