<script setup lang="ts">
    import { ShieldCheckIcon, KeyIcon, UsersIcon, ClockIcon } from "lucide-vue-next";
    import type { DashboardStat } from "@/types/access-control";

    defineProps<{
        stats: DashboardStat | undefined;
        expiringThresholdDays: number;
    }>();
</script>

<template>
    <section v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div
            class="relative group bg-white dark:bg-gray-1050 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-900 hover:border-sky-500/70 dark:hover:border-sky-600/70 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/10 dark:shadow-black/30">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Total Roles
                    </p>
                    <ShieldCheckIcon class="size-7 text-sky-500 opacity-70 group-hover:opacity-100" />
                </div>
                <p class="text-4xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {{ stats.total_roles }}
                </p>
            </div>
            <div class="w-full h-px bg-gray-300 dark:bg-gray-800 group-hover:bg-sky-600/50 dark:group-hover:bg-sky-700/50 mt-4 mb-2 transition-colors"></div>
            <p class="text-xs text-gray-500 dark:text-gray-600 group-hover:text-sky-600 dark:group-hover:text-sky-500 transition-colors">
                Configured Roles
            </p>
        </div>
        <div
            class="relative group bg-white dark:bg-gray-1050 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-900 hover:border-purple-500/70 dark:hover:border-purple-600/70 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/10 dark:shadow-black/30">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Total Permissions
                    </p>
                    <KeyIcon class="size-7 text-purple-500 opacity-70 group-hover:opacity-100" />
                </div>
                <p class="text-4xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {{ stats.total_permissions }}
                </p>
            </div>
            <div class="w-full h-px bg-gray-300 dark:bg-gray-800 group-hover:bg-purple-600/50 dark:group-hover:bg-purple-700/50 mt-4 mb-2 transition-colors"></div>
            <p class="text-xs text-gray-500 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-purple-500 transition-colors">
                Defined Permissions
            </p>
        </div>
        <div
            class="relative group bg-white dark:bg-gray-1050 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-900 hover:border-green-500/70 dark:hover:border-green-600/70 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/10 dark:shadow-black/30">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Total Users
                    </p>
                    <UsersIcon class="size-7 text-green-850 opacity-70 group-hover:opacity-100" />
                </div>
                <p class="text-4xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-850 dark:group-hover:text-green-700 transition-colors">
                    {{ stats.total_users }}
                </p>
            </div>
            <div class="w-full h-px bg-gray-300 dark:bg-gray-800 group-hover:bg-green-600/50 dark:group-hover:bg-green-700/50 mt-4 mb-2 transition-colors"></div>
            <p class="text-xs text-gray-500 dark:text-gray-700 group-hover:text-green-900 dark:group-hover:text-green-800 transition-colors">
                Registered Users
            </p>
        </div>
        <div
            class="relative group bg-white dark:bg-gray-1050 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-900 hover:border-amber-500/70 dark:hover:border-amber-600/70 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/10 dark:shadow-black/30">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Expiring Soon
                    </p>
                    <ClockIcon class="size-7 text-amber-500 opacity-70 group-hover:opacity-100" />
                </div>
                <p class="text-4xl font-bold text-blue-600 dark:text-blue-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {{ stats.expiring_assignments_count }}
                </p>
            </div>
            <div class="w-full h-px bg-gray-300 dark:bg-gray-800 group-hover:bg-amber-600/50 dark:group-hover:bg-amber-700/50 mt-4 mb-2 transition-colors"></div>
            <p
                v-if="stats.expiring_assignments_count > 0"
                class="text-xs text-gray-500 dark:text-gray-600 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                In next {{ expiringThresholdDays }} days
            </p>
            <p
                v-else
                class="text-xs text-gray-500 dark:text-gray-600 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                No assignments expiring
            </p>
        </div>
    </section>
</template>