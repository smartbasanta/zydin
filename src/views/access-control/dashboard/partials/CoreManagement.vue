<script setup lang="ts">
    import { PuzzleIcon, ShieldCheckIcon, KeyIcon, GitForkIcon, UserLockIcon, ChevronsRightIcon } from "lucide-vue-next";
    import { useRouter } from "vue-router";

    const router = useRouter();

    defineProps<{
        can: {
            viewAnyRole?: boolean;
            viewAnyPermission?: boolean;
            viewRolePermissions?: boolean;
            viewAnyAccess?: boolean
        } | undefined;
    }>();

    const navigateTo = (routeName: string) => {
        router.push({ name: routeName });
    };
</script>

<template>
    <div v-if="can"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-5">
            <PuzzleIcon class="size-7 text-blue-600 dark:text-blue-400" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Core Management</h3>
        </div>
        <nav class="space-y-1">
            <button v-if="can.viewAnyRole" @click="navigateTo('access-control.roles.index')" class="cursor-pointer w-full flex items-center justify-between p-3 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-1000/50 transition-colors duration-200 group text-sky-600 dark:text-sky-400">
                <span class="flex items-center gap-3">
                    <ShieldCheckIcon class="size-5" /> Manage Roles
                </span>
                <ChevronsRightIcon class="size-5 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-current transition-all" />
            </button>
            <button v-if="can.viewAnyPermission" @click="navigateTo('access-control.permissions.index')" class="cursor-pointer w-full flex items-center justify-between p-3 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-1000/50 transition-colors duration-200 group text-green-850 dark:text-green-700">
                 <span class="flex items-center gap-3">
                    <KeyIcon class="size-5" /> View Permissions
                </span>
                <ChevronsRightIcon class="size-5 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-current transition-all" />
            </button>
            <button v-if="can.viewRolePermissions" @click="navigateTo('access-control.role-permission.index')" class="cursor-pointer w-full flex items-center justify-between p-3 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-1000/50 transition-colors duration-200 group text-purple-600 dark:text-purple-400">
                 <span class="flex items-center gap-3">
                    <GitForkIcon class="size-5" /> Role & Permissions
                </span>
                <ChevronsRightIcon class="size-5 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-current transition-all" />
            </button>
            <button v-if="can.viewAnyAccess" @click="navigateTo('access-control.user-access.index')" class="cursor-pointer w-full flex items-center justify-between p-3 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-1000/50 transition-colors duration-200 group text-blue-600 dark:text-blue-400">
                 <span class="flex items-center gap-3">
                    <UserLockIcon class="size-5" /> Manage User Access
                </span>
                <ChevronsRightIcon class="size-5 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-current transition-all" />
            </button>
        </nav>
    </div>
</template>