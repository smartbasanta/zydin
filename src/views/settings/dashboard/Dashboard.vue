<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { RouterLink } from 'vue-router';
import LoadingState from '@/components/card/LoadingState.vue';

// Icons
import { 
    DatabaseZapIcon, 
    ShieldCheckIcon, 
    LayersIcon, 
    HardDriveDownloadIcon, 
    BellRingIcon,
    ArrowRightIcon,
    SettingsIcon
} from 'lucide-vue-next';

interface SettingsPermissions {
    viewSettingsDashboard: boolean;
    viewAnyBackup: boolean;
    viewCache: boolean;
    viewSystemNotifications: boolean;
}

interface SettingsDashboardData {
    can: SettingsPermissions;
}

const { error: notifyError } = useNotifier();
const dashboardData = ref<SettingsDashboardData | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

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

const can = computed(() => dashboardData.value?.can);
</script>

<template>
    <div class="p-6 md:p-8 space-y-8 font-sans bg-section-bg min-h-[calc(100vh-theme(space.20))]">
        
        <!-- Page Header -->
        <header class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <SettingsIcon class="size-6" />
                </div>
                <h1 class="text-2xl font-bold section-title">System Settings</h1>
            </div>
            <p class="text-muted ml-14 max-w-2xl">
                Manage global system configurations, notifications, backups, and performance optimization.
            </p>
        </header>

        <!-- Loading State -->
        <LoadingState v-if="isLoading" message="Loading Settings..." />

        <!-- Main Content -->
        <main v-else-if="dashboardData && can?.viewSettingsDashboard" class="animate-fade-in-up">
            
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                <!-- System Notifications Module -->
                <RouterLink 
                    v-if="can?.viewSystemNotifications" 
                    to="/settings/system-notifications"
                    class="settings-card group"
                >
                    <div class="flex justify-between items-start">
                        <div class="icon-box bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <BellRingIcon class="size-6" />
                        </div>
                        <ArrowRightIcon class="size-5 text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    
                    <div class="mt-4">
                        <h3 class="text-lg font-bold section-title group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            System Notifications
                        </h3>
                        <p class="text-sm text-muted mt-2 leading-relaxed">
                            Configure alerts, manage notification templates, and view delivery logs.
                        </p>
                    </div>
                </RouterLink>

                <!-- Database & Backup Module -->
                <RouterLink 
                    v-if="can?.viewAnyBackup" 
                    to="/settings/database"
                    class="settings-card group"
                >
                    <div class="flex justify-between items-start">
                        <div class="icon-box bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                            <HardDriveDownloadIcon class="size-6" />
                        </div>
                        <ArrowRightIcon class="size-5 text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    
                    <div class="mt-4">
                        <h3 class="text-lg font-bold section-title group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Database & Backups
                        </h3>
                        <p class="text-sm text-muted mt-2 leading-relaxed">
                            Monitor database health, create snapshots, and manage recovery points.
                        </p>
                    </div>
                </RouterLink>

                <!-- Cache & Optimization Module -->
                <RouterLink 
                    v-if="can?.viewCache" 
                    to="/settings/cache"
                    class="settings-card group"
                >
                    <div class="flex justify-between items-start">
                        <div class="icon-box bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <DatabaseZapIcon class="size-6" />
                        </div>
                        <ArrowRightIcon class="size-5 text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    
                    <div class="mt-4">
                        <h3 class="text-lg font-bold section-title group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Performance & Cache
                        </h3>
                        <p class="text-sm text-muted mt-2 leading-relaxed">
                            Clear application caches, optimize routes, and manage system performance.
                        </p>
                    </div>
                </RouterLink>

            </div>

            <!-- Empty State: No Access -->
            <div v-if="!can?.viewAnyBackup && !can?.viewCache && !can?.viewSystemNotifications" class="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-muted rounded-2xl bg-white/50 dark:bg-gray-900/20">
                <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-muted mb-4">
                    <ShieldCheckIcon class="size-10" />
                </div>
                <h3 class="text-lg font-bold section-title">Restricted Access</h3>
                <p class="text-muted mt-2 max-w-md">
                    You do not have permissions to access any system configuration modules. Please contact your administrator.
                </p>
            </div>
        </main>

        <!-- Error State -->
        <div v-else class="flex flex-col items-center justify-center h-96 text-center">
            <div class="p-4 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 mb-4">
                <ShieldCheckIcon class="size-10" />
            </div>
            <h2 class="text-xl font-bold section-title mb-2">
                {{ hasError ? "System Error" : "Access Denied" }}
            </h2>
            <p class="text-muted mb-6 max-w-md">
                {{ hasError ? "We encountered an issue loading the settings dashboard." : "You do not have permission to view this area." }}
            </p>
            <button v-if="hasError" @click="fetchDashboardData" class="btn btn-primary">
                Retry Connection
            </button>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.settings-card {
    @apply block p-6 rounded-2xl border transition-all duration-300;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-sm);
}

.settings-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    /* Note: Border color on hover is handled via group-hover classes on the specific text for a cleaner look, 
       or you can add a generic border-primary-300 here if preferred. */
    @apply border-gray-300 dark:border-gray-600;
}

.icon-box {
    @apply flex items-center justify-center size-12 rounded-xl transition-transform duration-300 group-hover:scale-110;
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>