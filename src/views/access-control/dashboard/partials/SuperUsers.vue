<script setup lang="ts">
import { ShieldCheckIcon } from 'lucide-vue-next';
import type { User } from '@/types/auth';

defineProps<{
    can: {
        viewSuperUsers?: boolean
    } | undefined;
    superUsers: User[];
}>();
</script>

<template>
    <div v-if="can?.viewSuperUsers"
        class="bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-500 dark:border-red-600 p-6 rounded-lg shadow-lg dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <ShieldCheckIcon class="size-7 text-red-600 dark:text-red-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Super Users ({{ superUsers.length }})
            </h3>
        </div>
        <p class="text-sm text-red-800 dark:text-red-300/90 mb-4">
            These users have unrestricted access to all system features. Their access should be regularly reviewed.
        </p>
        <p v-if="!superUsers.length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            No users currently have Super User privileges.
        </p>
        <ul v-else class="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
            <li v-for="user in superUsers" :key="user.id"
                class="group flex items-center justify-between p-3 rounded-md bg-white/50 dark:bg-gray-1000/20 hover:bg-white dark:hover:bg-gray-1000/40 transition-colors">
                <div>
                    <router-link :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }"
                        class="link text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400">
                        {{ user.username }}
                    </router-link>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ user.email }}
                    </div>
                </div>
                <router-link :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }"
                    class="text-xs font-semibold text-red-700 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Review Access
                </router-link>
            </li>
        </ul>
    </div>
</template>