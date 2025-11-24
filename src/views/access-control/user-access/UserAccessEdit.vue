<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useUserAccessAPI } from "@/composables/access-control/useUserAccessAPI";
import UserRolesSection from "./partials/UserRolesSection.vue";
import UserPermissionsSection from "./partials/UserPermissionsSection.vue";
import LoadingState from "@/components/loading/LoadingState.vue";
import {
	ArrowLeftIcon,
	ShieldAlertIcon,
	TriangleAlertIcon,
	UploadCloudIcon,
	CheckSquareIcon,
	KeyRoundIcon,
    UserIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon
} from "lucide-vue-next";
import { useDefaultImages } from '@/composables/useDefaultImages';
import BackButton from "@/components/button/BackButton.vue";

const { defaultProfileImage } = useDefaultImages();
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
		if (isSidebarCollapsed.value) isSidebarCollapsed.value = false; // Auto-expand if needed
	}
});
</script>

<template>
	<LoadingState v-if="isLoading" message="Loading User Access Profile..." />

	<div v-else-if="editData" class="flex h-[calc(100vh-theme(space.20))] overflow-hidden bg-section-bg relative">
		
        <!-- Sidebar Toggle (Floating) -->
        <button 
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="absolute top-4 z-30 p-2 rounded-full shadow-lg border transition-all duration-300 bg-white dark:bg-gray-800 border-muted text-muted hover:text-primary-600 hover:border-primary-300"
            :class="isSidebarCollapsed ? 'left-4' : 'left-[15.5rem]'"
            title="Toggle Sidebar"
        >
            <PanelLeftOpenIcon v-if="isSidebarCollapsed" class="w-4 h-4" />
            <PanelLeftCloseIcon v-else class="w-4 h-4" />
        </button>

		<!-- Left Sidebar -->
		<aside 
            class="flex-shrink-0 h-full border-r border-muted section-bg section-title backdrop-blur-md transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar"
            :class="isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-72 opacity-100'"
        >
            <div class="p-6 pt-16 space-y-8">
                <!-- User Info Card -->
                <div class="flex flex-col items-center text-center">
                    <div class="relative mb-3">
                        <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                            <img 
                                :src="editData.user.avatar_url ?? editData.user.avatar_thumbnail_url ?? defaultProfileImage" 
                                :alt="editData.user.username"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div v-if="editData.can.targetUserIsSuperUserViaPermission" class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                            <ShieldAlertIcon class="size-3" /> ROOT
                        </div>
                    </div>
                    
                    <h2 class="text-lg font-bold truncate w-full">
                        {{ editData.user.username }}
                    </h2>
                    <p class="text-xs truncate w-full">
                        {{ editData.user.email }}
                    </p>
                </div>

                <!-- Navigation Tabs -->
                <div class="space-y-1">
                    <p class="text-xs font-extrabold uppercase tracking-wider mb-3 px-2">Management Area</p>
                    
                    <button @click="activeTab = 'roles'" 
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                        :class="activeTab === 'roles' 
                            ? 'ring-1 ring-primary-200 dark:ring-primary-800' 
                            : 'text-muted hover:border'"
                    >
                        <CheckSquareIcon class="size-4" />
                        Role Assignments
                    </button>
                    
                    <button @click="activeTab = 'permissions'" 
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                        :class="activeTab === 'permissions' 
                            ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 ring-1 ring-secondary-200 dark:ring-secondary-800' 
                            : 'text-muted hover:border'"
                    >
                        <KeyRoundIcon class="size-4" />
                        Direct Permissions
                    </button>
                </div>

                <!-- Contextual Actions -->
                <div class="space-y-4 pt-4 border-t border-muted">
                    <!-- Roles Actions -->
                    <div v-if="activeTab === 'roles'" class="space-y-3">
                        <button 
                            v-if="editData.can.assignRoles" 
                            @click="updateRoles" 
                            class="btn btn-primary w-full justify-center shadow-lg shadow-primary-500/20"
                            :disabled="isSubmitting || !isRolesFormDirty"
                        >
                            <UploadCloudIcon class="size-4 mr-2" />
                            {{ isSubmitting ? "Saving..." : "Save Changes" }}
                        </button>
                    </div>

                    <!-- Permissions Actions & Navigation -->
                    <div v-if="activeTab === 'permissions'" class="space-y-4">
                        <button 
                            v-if="editData.can.assignDirectPermissions" 
                            @click="syncDirectPermissions"
                            class="btn btn-primary w-full justify-center shadow-lg shadow-secondary-500/20" 
                            :disabled="isSubmitting || !isPermissionsFormDirty"
                        >
                            <UploadCloudIcon class="size-4 mr-2" />
                            {{ isSubmitting ? "Saving..." : "Save Permissions" }}
                        </button>

                        <div class="space-y-1">
                            <p class="text-xs font-bold uppercase tracking-wider mb-2 px-2">Groups</p>
                            <div class="max-h-48 overflow-y-auto custom-scrollbar pr-1 space-y-0.5">
                                <button 
                                    v-for="groupName in groupNames" 
                                    :key="groupName" 
                                    @click="activeGroup = groupName"
                                    class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate"
                                    :class="activeGroup === groupName
                                        ? 'text-white font-semibold header-bg'
                                        : 'hover:text-white hover:header-bg'"
                                >
                                    {{ groupName }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Link -->
                <div class="pt-4 border-t border-muted">
					<BackButton label="Go to user list"/>
                    <!-- <RouterLink :to="{ name: 'access-control.user-access.index' }" class="flex items-center gap-2 text-xs font-medium text-muted hover:text-primary-600 transition-colors px-2">
                        <ArrowLeftIcon class="size-3" /> Back to User List
                    </RouterLink> -->
                </div>
            </div>
		</aside>

		<!-- Main Content Area -->
		<main class="flex-1 overflow-y-auto p-6 md:p-10 transition-all duration-300">
            <div class="max-w-5xl mx-auto space-y-6">
                
                <!-- Warning Banner -->
                <div v-if="editData.can && !editData.can.actingUserIsSuperUser && (editData.can.targetUserIsSuperUserViaPermission || editData.can.targetUserHasCoreSystemRole)" 
                     class="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/50 flex gap-3 items-start"
                >
                    <TriangleAlertIcon class="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 class="text-sm font-bold text-amber-800 dark:text-amber-200">Restricted Access</h4>
                        <p class="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                            You are managing a user with high-level privileges. Some modification actions may be restricted for security.
                        </p>
                    </div>
                </div>

                <!-- Error Banner -->
                <div v-if="Object.keys(submissionErrors).length > 0"
                    class="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 flex gap-3 items-start"
                >
                    <TriangleAlertIcon class="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 class="text-sm font-bold text-red-800 dark:text-red-200">Submission Failed</h4>
                        <ul class="list-disc list-inside text-xs text-red-700 dark:text-red-300/80 mt-1 space-y-0.5">
                            <li v-for="(errors, key) in submissionErrors" :key="key">
                                <span class="font-semibold">{{ key }}:</span> {{ errors.join(", ") }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Dynamic Sections -->
                <div class="transition-opacity duration-300 ease-in-out">
                    <UserRolesSection 
                        v-if="activeTab === 'roles'" 
                        :target-user="editData.user" 
                        :all-roles="editData.allRoles"
                        :roles-form="rolesForm" 
                        :can-assign-roles="editData.can.assignRoles"
                        :acting-user-is-super-user="editData.can.actingUserIsSuperUser"
                        :target-user-is-self="editData.can.targetUserIsSelf" 
                        :is-syncing-roles="isSubmitting"
                        :form-errors="submissionErrors" 
                        :is-dirty="isRolesFormDirty" 
                    />

                    <UserPermissionsSection 
                        v-if="activeTab === 'permissions'" 
                        :target-user="editData.user"
                        :all-permissions-grouped="editData.allPermissionsGrouped"
                        :direct-permissions-form="directPermissionsForm" 
                        :can="editData.can"
                        :is-syncing-permissions="isSubmitting" 
                        :form-errors="submissionErrors"
                        :is-dirty="isPermissionsFormDirty" 
                        :active-group="activeGroup" 
                        @revoke-permission="revokePermission"
                        @restore-permission="restoreRevokedPermission" 
                    />
                </div>
            </div>
		</main>
	</div>

	<div v-else class="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-muted">
            <UserIcon class="size-8" />
        </div>
		<h3 class="text-xl font-bold section-title">User Not Found</h3>
        <p class="text-muted mt-2">The user data could not be loaded.</p>
	</div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Custom Scrollbar for sidebar lists */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-200 dark:bg-gray-700 rounded-full;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600;
}
</style>