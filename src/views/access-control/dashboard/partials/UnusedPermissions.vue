<script setup lang="ts">
import { PuzzleIcon } from "lucide-vue-next";
import type { Permission } from "@/types/access-control";

defineProps<{
    can: {
        viewAnyPermission?: boolean
    } | undefined;
    unusedPermissions: Permission[];
}>();
</script>

<template>
    <div v-if="can?.viewAnyPermission"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <PuzzleIcon class="size-6 text-gray-500 dark:text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Unused Permissions ({{ unusedPermissions.length }})
            </h3>
        </div>
        <p v-if="!unusedPermissions.length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            All permissions are currently in use.
        </p>
        <ul v-else class="space-y-1 max-h-60 overflow-y-auto no-scrollbar pr-1">
            <li v-for="perm in unusedPermissions" :key="perm.id" class="group">
                 <router-link :to="{ name: 'access-control.permissions.show', params: { id: perm.id } }"
                    class="block p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-1000/30 transition-colors">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {{ perm.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                        {{ perm.key }}
                    </div>
                 </router-link>
            </li>
        </ul>
    </div>
</template>