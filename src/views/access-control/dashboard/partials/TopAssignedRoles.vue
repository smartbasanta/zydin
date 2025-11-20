<script setup lang="ts">
import { TrendingUpIcon, UsersIcon } from "lucide-vue-next";
import { computed } from "vue"; // Import computed
import type { Role } from "@/types/access-control";

const props = defineProps<{
    can: {
        viewAnyRole?: boolean
    } | undefined;
    topRoles: Role[];
}>();

// Create a safe computed property to find the maximum user count for the progress bar scaling.
const maxUserCount = computed(() => {
    // If the array is empty, return 1 to prevent division by zero.
    if (!props.topRoles || props.topRoles.length === 0) {
        return 1;
    }
    // Safely map over the roles, providing 0 as a fallback for any undefined user_count.
    const counts = props.topRoles.map(role => role.users_count ?? 0);
    const max = Math.max(...counts);

    // If the maximum count is 0, still return 1 to avoid division by zero (0 / 1 = 0).
    return max > 0 ? max : 1;
});

</script>

<template>
    <div v-if="can?.viewAnyRole"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-4">
            <TrendingUpIcon class="size-6 text-gray-500 dark:text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Top Assigned Roles
            </h3>
        </div>
        <p v-if="!topRoles.length" class="text-sm text-gray-500 dark:text-gray-400 italic">
            No roles have been assigned to users yet.
        </p>
        <ul v-else class="space-y-3">
            <li v-for="role in topRoles" :key="role.id">
                <router-link :to="{ name: 'access-control.roles.show', params: { id: role.id } }" class="group block">
                    <div class="flex items-center justify-between mb-1 text-sm">
                        <span class="font-medium text-gray-800 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {{ role.name }}
                        </span>
                        <span class="flex items-center gap-1.5 font-semibold text-gray-600 dark:text-gray-400">
                           <UsersIcon class="size-4" />
                           <!-- FIX 1: Provide a fallback of 0 for display purposes -->
                           {{ role.users_count ?? 0 }}
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <!-- 
                            FIX 2: Use the safe computed 'maxUserCount' for the denominator 
                            and the nullish coalescing operator for the numerator.
                            This entire expression is now type-safe.
                        -->
                        <div class="bg-sky-500 h-1.5 rounded-full group-hover:bg-sky-400 transition-colors"
                             :style="{ width: `${((role.users_count ?? 0) / maxUserCount * 100)}%` }">
                        </div>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>