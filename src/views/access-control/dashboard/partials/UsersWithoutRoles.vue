<script setup lang="ts">
import { UserLockIcon } from "lucide-vue-next";
import type { UserAccess } from "@/types/access-control";

defineProps<{
    can: {
        viewAnyAccess?: boolean
    } | undefined;
    usersWithoutRoles: UserAccess[];
}>();
</script>

<template>
    <div v-if="can?.viewAnyAccess"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <UserLockIcon class="size-6 text-yellow-600 dark:text-yellow-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Users Without Roles ({{ usersWithoutRoles.length }})
            </h3>
        </div>
        <p v-if="!usersWithoutRoles.length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            All users have at least one assigned role.
        </p>
        <ul v-else class="space-y-1 max-h-60 overflow-y-auto no-scrollbar pr-1">
            <li v-for="user in usersWithoutRoles" :key="user.id" class="group">
                <router-link :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }"
                    class="block p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-1000/30 transition-colors">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {{ user.username }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ user.email }}
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>