<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserAccessAPI } from "@/composables/access-control/useUserAccessAPI";
import UserRolesSection from "./partials/UserRolesSection.vue";
import UserPermissionsSection from "./partials/UserPermissionsSection.vue";
import LoadingState from "@/components/card/LoadingState.vue";
import {
	ArrowLeftIcon,
	ShieldAlertIcon,
	TriangleAlert,
	UploadCloudIcon,
	CheckSquareIcon,
	KeyRoundIcon,
} from "lucide-vue-next";
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need

const route = useRoute();
const userId = route.params.id as string;

const {
	editData,
	isLoading,
	isSubmitting,
	submissionErrors,
	rolesForm,
	directPermissionsForm,
	isRolesFormDirty,
	isPermissionsFormDirty,
	updateRoles,
	syncDirectPermissions,
	revokePermission,
	restoreRevokedPermission,
} = useUserAccessAPI(userId);

const activeTab = ref<"roles" | "permissions">("roles");
const isSidebarCollapsed = ref(false);
const activeGroup = ref("");
const groupNames = computed(() => {
	return activeTab.value === "permissions" && editData.value
		? Object.keys(editData.value.allPermissionsGrouped)
		: [];
});

watch(activeTab, (newTab) => {
	if (newTab === "permissions") {
		activeGroup.value = groupNames.value[0] ?? "";
		isSidebarCollapsed.value = false;
	}
});
</script>

<template>
	<LoadingState v-if="isLoading" message="Loading User Access Profile..." />

	<div v-else-if="editData" class="flex min-h-screen bg-gray-50 dark:bg-gray-1150">
		<!-- Left Sidebar (Glassmorphism) -->
		<aside :class="[
			'transition-all duration-500 ease-in-out border-r border-orange-500/20 p-4 sticky top-0 h-[calc(100vh-80px)] overflow-y-auto z-20 backdrop-blur-md bg-orange-100/30 dark:bg-gray-800/30 ',
			isSidebarCollapsed
				? 'w-0 opacity-0 pointer-events-none'
				: 'w-64',
		]">
			<!-- User Info -->
			<div class="flex items-center gap-4 mb-6">
				<div
					class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-lg font-bold text-white ring-2 ring-orange-500/50">
					<!-- {{ editData.user.username.substring(0, 2).toUpperCase() }} -->
					<img :src="editData.user.avatar_url ?? editData.user.avatar_thumbnail_url ?? defaultProfileImage" />

				</div>
				<div class="text-sm leading-tight">
					<h2 class="font-semibold text-orange-700 dark:text-orange-300">
						{{ editData.user.username }}
					</h2>
					<p class="text-gray-600 dark:text-gray-400 text-xs">
						{{ editData.user.email }}
					</p>
					<div v-if="editData.can.targetUserIsSuperUserViaPermission" class="mt-1">
						<span
							class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-700 dark:text-red-300">
							<ShieldAlertIcon class="size-3" /> SUPER USER
						</span>
					</div>
				</div>
			</div>

			<!-- Back Link -->
			<RouterLink :to="{ name: 'access-control.user-access.index' }"
				class="btn ghost border border-orange-500/30 text-sm w-full mb-6 hover:bg-orange-500/20 text-orange-700 dark:text-orange-300">
				<ArrowLeftIcon class="size-4 mr-1" /> Back to List
			</RouterLink>

			<!-- Tab Switch -->
			<div class="space-y-2 mb-6">
				<button @click="activeTab = 'roles'" :class="[
					'w-full px-3 py-2 text-left rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer',
					activeTab === 'roles'
						? 'bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-lg shadow-orange-500/30'
						: 'hover:bg-orange-500/20 text-orange-700 dark:text-orange-300',
				]">
					Role Assignments
				</button>
				<button @click="activeTab = 'permissions'" :class="[
					'w-full px-3 py-2 text-left rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer',
					activeTab === 'permissions'
						? 'bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-md shadow-orange-500/20'
						: 'hover:bg-orange-500/20 text-orange-700 dark:text-orange-300',
				]">
					Direct Permissions
				</button>
			</div>

			<!-- Section Headers and Buttons -->
			<div class="space-y-4">
				<div v-if="activeTab === 'roles'" class="space-y-2">
					<h3 class="text-lg font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300">
						<CheckSquareIcon class="size-5" /> Role Assignments
					</h3>
					<button v-if="editData.can.assignRoles" @click="updateRoles" class="btn w-full text-sm btn-success"
						:disabled="isSubmitting || !isRolesFormDirty">
						<UploadCloudIcon class="size-4 mr-1.5" />
						{{ isSubmitting ? "Updating..." : "Update Roles" }}
					</button>
				</div>
				<div v-if="activeTab === 'permissions'" class="space-y-2">
					<h3 class="text-lg font-medium flex items-center gap-2 text-secondary">
						<KeyRoundIcon class="size-5" />
						{{ activeGroup || "Direct Permissions" }}
					</h3>
					<button v-if="editData.can.assignDirectPermissions" @click="syncDirectPermissions"
						class="btn w-full btn-success text-sm " :disabled="isSubmitting || !isPermissionsFormDirty">
						<UploadCloudIcon class="size-4 mr-1.5" />
						{{
							isSubmitting ? "Updating..." : "Update Permissions"
						}}
					</button>
					<div class="mt-4 space-y-2">
						<p class="text-xs text-gray-600 dark:text-gray-400">
							Permission Groups
						</p>
						<div class="space-y-1">
							<button v-for="groupName in groupNames" :key="groupName" @click="activeGroup = groupName"
								type="button" :class="[
									'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer',
									activeGroup === groupName
										? 'bg-gradient-to-r bg-orange-500/20 text-orange-700 dark:text-orange-300  shadow-sm shadow-orange-500/30'
										: 'hover:bg-orange-500/20 text-orange-700 dark:text-orange-300',
								]">
								{{ groupName }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</aside>

		<!-- Sidebar Toggle Button -->
		<button @click="isSidebarCollapsed = !isSidebarCollapsed"
			class="absolute top-4 left-2 z-30 bg-orange-100/50 dark:bg-gray-800/50 border border-orange-500/30 rounded-full p-1.5 shadow-lg hover:bg-orange-200/50 dark:hover:bg-gray-700/50 transition-all duration-300">
			<svg v-if="!isSidebarCollapsed" class="w-4 h-4 text-orange-700 dark:text-orange-300" fill="none"
				stroke="currentColor" viewBox="0 0 24 24">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			<svg v-else class="w-4 h-4 text-orange-700 dark:text-orange-300" fill="none" stroke="currentColor"
				viewBox="0 0 24 24">
				<path d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<!-- Main Content -->
		<main class="flex-1 overflow-y-auto p-8 space-y-8">
			<!-- Warning Message -->
			<div v-if="
				editData.can &&
				!editData.can.actingUserIsSuperUser &&
				(editData.can.targetUserIsSuperUserViaPermission ||
					editData.can.targetUserHasCoreSystemRole)
			" class="p-4 rounded-lg border border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-900/20 text-sm shadow-sm shadow-amber-500/20">
				<p class="font-medium mb-1">⚠️ Limited Management</p>
				<p class="text-xs leading-snug">
					You are managing a user with high-level privileges. Some
					actions may be restricted.
				</p>
			</div>

			<!-- Submission Errors -->
			<div v-if="Object.keys(submissionErrors).length > 0"
				class="p-4 rounded-lg border border-red-500/30 text-red-700 dark:text-red-300 bg-red-50/50 dark:bg-red-900/20 text-sm shadow-sm shadow-red-500/20">
				<p class="font-medium mb-1 flex items-center gap-2">
					<TriangleAlert class="size-4" /> Submission Error
				</p>
				<ul class="list-disc list-inside pl-2 text-xs space-y-0.5 mt-1">
					<li v-for="(errors, key) in submissionErrors" :key="key">
						{{ key }}: {{ errors.join(", ") }}
					</li>
				</ul>
			</div>

			<!-- Main Sections -->
			<UserRolesSection v-if="activeTab === 'roles'" :target-user="editData.user" :all-roles="editData.allRoles"
				:roles-form="rolesForm" :can-assign-roles="editData.can.assignRoles"
				:acting-user-is-super-user="editData.can.actingUserIsSuperUser"
				:target-user-is-self="editData.can.targetUserIsSelf" :is-syncing-roles="isSubmitting"
				:form-errors="submissionErrors" :is-dirty="isRolesFormDirty" />

			<UserPermissionsSection v-if="activeTab === 'permissions'" :target-user="editData.user"
				:all-permissions-grouped="editData.allPermissionsGrouped"
				:direct-permissions-form="directPermissionsForm" :can="editData.can"
				:is-syncing-permissions="isSubmitting" :form-errors="submissionErrors"
				:is-dirty="isPermissionsFormDirty" :active-group="activeGroup" @revoke-permission="revokePermission"
				@restore-permission="restoreRevokedPermission" />
		</main>
	</div>

	<div v-else class="p-8 text-center text-gray-600 dark:text-gray-400">
		User data could not be loaded.
	</div>
</template>
