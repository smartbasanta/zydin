<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { RouterLink } from 'vue-router';


// Layout & Child Components
// import Header from './partials/Header.vue';
// import StatsNodes from './partials/StatsNodes.vue';
import Card from '../partials/Card.vue';
import LoadingState from '@/components/card/LoadingState.vue';

// Icons
import { DatabaseZapIcon, BellRingIcon, ShieldCheckIcon, LayersIcon, HardDriveDownloadIcon, BellDot } from 'lucide-vue-next';
interface SettingsPermissions {
    viewSettingsDashboard: boolean
    viewAnyBackup: boolean;
    viewCache: boolean;
    viewSystemNotifications: boolean;
    // manage_countries: boolean;
    // manage_system_notifications: boolean;
}

interface SettingsDashboardData {
    can: SettingsPermissions;
}

// --- Composables & State ---
const { error: notifyError } = useNotifier();
const dashboardData = ref<SettingsDashboardData | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

// --- Data Fetching ---
const fetchDashboardData = async () => {
    isLoading.value = true;
    hasError.value = false;
    try {
        const response = await apiService.get<ApiResponse>('/settings');
        dashboardData.value = response.data;
    } catch (err: any) {
        hasError.value = true;
        notifyError(err, 'Failed to load settings dashboard data.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchDashboardData);

// --- Computed properties for cleaner template access ---
// const stats = computed(() => dashboardData.value?.stats);
const can = computed(() => dashboardData.value?.can);
</script>

<template>
    <LoadingState v-if="isLoading" message="Loading Settings Dashboard..." />

    <div v-else-if="dashboardData && can?.viewSettingsDashboard" class="min-h-screen p-4 sm:p-6 lg:p-8">
    <!-- <div v-else-if="dashboardData && (can?.viewCache || can?.viewAnyBackup)" class="min-h-screen p-4 sm:p-6 lg:p-8"> -->
        <!-- <Header /> -->

        <!-- <StatsNodes :stats="stats" /> -->

        <main class="mt-10">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Management Modules</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Notifications Card -->
                 <RouterLink v-if="can?.viewSystemNotifications" to="/settings/system-notifications">
                    <div class="group block cursor-pointer rounded-xl bg-white p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/70 dark:hover:border-blue-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
                        <div class="flex items-center gap-4">
                            <BellDot class="size-12 text-blue-500" />
                            <div class="block text-start">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    System Notifications
                                </h3>
                                <p class="mt-1 text-md text-gray-500 dark:text-gray-400">
                                    Manage System notifications.
                                </p>
                            </div>
                        </div>
                    </div>
                </RouterLink>

                <!-- Backup Card -->
                <!-- <RouterLink v-if="can?.viewAnyBackup" to="/settings/database">
                    <Card title="Backup & Maintenance" description="Manage database backups and restore.">
                        <HardDriveDownloadIcon class="size-12 text-blue-500" />
                    </Card>
                </RouterLink> -->
                <RouterLink v-if="can?.viewAnyBackup" to="/settings/database">
                    <div class="group block cursor-pointer rounded-xl bg-white p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/70 dark:hover:border-indigo-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
                        <div class="flex items-center gap-4">
                            <HardDriveDownloadIcon class="size-12 text-indigo-500" />
                            <div class="block text-start">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Database Backup & Maintenance
                                </h3>
                                <p class="mt-1 text-md text-gray-500 dark:text-gray-400">
                                    Manage application database and backups.
                                </p>
                            </div>
                        </div>
                    </div>
                </RouterLink>

                <!-- Cache Card -->
                <RouterLink v-if="can?.viewCache" to="/settings/cache">
                    <div class="group block cursor-pointer rounded-xl bg-white p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-500/70 dark:hover:border-green-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
                        <div class="flex items-center gap-4">
                            <LayersIcon class="size-12 text-green-500" />
                            <div class="block text-start">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Optimization and cache
                                </h3>
                                <p class="mt-1 text-md text-gray-500 dark:text-gray-400">
                                    Manage application optimization and cache.
                                </p>
                            </div>
                        </div>
                    </div>
                </RouterLink>

                <!-- Placeholder Card for when no modules are accessible -->
                <div v-if="!can?.viewAnyBackup && !can?.viewCache" class="sm:col-span-2 lg:col-span-3">
                    <div class="card-neutral flex flex-col items-center justify-center text-center p-10">
                        <ShieldCheckIcon class="size-16 text-muted mb-4" />
                        <h3 class="font-semibold text-lg">No Modules Assigned</h3>
                        <p class="text-muted mt-1">You do not have permissions to manage any settings modules.</p>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- Fallback / Error State -->
    <div v-else class="flex items-center justify-center h-screen">
        <div class="text-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {{ hasError ? "Something Went Wrong" : "Access Denied" }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
                {{ hasError ? "We couldn’t load the dashboard data." : "You do not have permission to view the settings dashboard." }}
            </p>
            <button v-if="hasError" @click="fetchDashboardData" class="btn primary">
                Try Again
            </button>
        </div>
    </div>
</template>

<style scoped></style>