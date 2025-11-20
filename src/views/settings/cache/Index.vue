<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';

// Icons
import { LoaderCircleIcon, DatabaseZapIcon, RocketIcon, SparklesIcon, EraserIcon } from 'lucide-vue-next';

// State Management
const isLoading = ref(true);


interface Permissions {
    viewCache: boolean;
    clearDatabaseCache: boolean;
    manageApplicationOptimization: boolean;
    optimizeApplication: boolean;
};

// --- Composables ---
const { notify, error: notifyError } = useNotifier();

// --- State Management ---
const can = ref<Permissions>({ viewCache: true, clearDatabaseCache:false, manageApplicationOptimization: false, optimizeApplication: false }); // Default cache to true, will be confirmed by gate on backend

// Action-specific loading states for better UX
const isClearingDbCache = ref(false);
const isOptimizing = ref(false);
const isClearingOptimize = ref(false);


// --- Data Fetching ---
const fetchData = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/settings/cache');
        // The 'can' for backups is nested, let's merge it
        Object.assign(can.value, response.data.can);
    } catch (err) {
        notifyError(err as Error, 'Failed to load backup data.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchData);


// --- Methods ---

// Cache Actions
const clearDbCache = async () => {
    isClearingDbCache.value = true;
    try {
        const response = await apiService.post<ApiResponse>('/settings/cache/clear-db');
        notify(response);
    } catch (err) {
        notifyError(err as Error, 'Failed to clear database cache.');
    } finally {
        isClearingDbCache.value = false;
    }
};

const optimizeApp = async () => {
    isOptimizing.value = true;
    try {
        const response = await apiService.post<ApiResponse>('/settings/cache/optimize');
        notify(response);
    } catch (err) {
        notifyError(err as Error, 'Failed to optimize application.');
    } finally {
        isOptimizing.value = false;
    }
};

const clearOptimize = async () => {
    isClearingOptimize.value = true;
    try {
        const response = await apiService.post<ApiResponse>('/settings/cache/optimize-clear');
        notify(response);
    } catch (err) {
        notifyError(err as Error, 'Failed to clear optimization cache.');
    } finally {
        isClearingOptimize.value = false;
    }
};
</script>

<template>

    <div class="p-4 md:p-6 font-sans">
        <title>Application Optimization and cache</title>
        <header class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <DatabaseZapIcon class="text-primary" />
                Application Optimization and cache Management
            </h1>
            <p class="text-muted mt-1">Optimize application and manage cache settings.</p>
        </header>

        <!-- Tabs Navigation -->
        <!-- <div class="border-b border-muted mb-6">
            <nav class="flex -mb-px space-x-6">
                <button @click="activeTab = 'database'" :class="['py-3 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'database' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-gray-700 dark:hover:text-gray-300']">
                    Database Backups
                </button>
                <button @click="activeTab = 'cache'" :class="['py-3 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === 'cache' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-gray-700 dark:hover:text-gray-300']">
                    Cache Management
                </button>
            </nav>
        </div> -->

        <!-- Tab Content -->
        <div>
            <!-- Cache Management Panel -->
            <div class="animate-fade-in">
                 <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Application Cache Actions</h2>
                 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Card 1: Clear DB Cache -->
                    <div class="card p-5 flex flex-col items-start gap-4 group cursor-pointer rounded-xl bg-white text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/70 dark:hover:border-blue-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
                        <div class="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400"><EraserIcon class="size-6"/></div>
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200">Clear Database Cache</h3>
                        <p class="text-sm text-muted flex-grow">Removes all items from the database cache table. Useful if you are experiencing issues with cached data.</p>
                        <button @click="clearDbCache" :disabled="!can.clearDatabaseCache || isClearingDbCache" class="btn btn-info mt-auto w-full">
                            <LoaderCircleIcon v-if="isClearingDbCache" class="size-4 animate-spin mr-2"/>
                            {{ isClearingDbCache ? 'Clearing...' : 'Clear DB Cache' }}
                        </button>
                    </div>

                    <!-- Card 2: Optimize App -->
                    <div class="card p-5 flex flex-col items-start gap-4 group cursor-pointer rounded-xl bg-white text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-500/70 dark:hover:border-green-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
                        <div class="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400"><RocketIcon class="size-6"/></div>
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200">Optimize Application</h3>
                        <p class="text-sm text-muted flex-grow">Caches the configuration and route files for a significant performance boost in production environments.</p>
                         <button @click="optimizeApp" :disabled="!can.optimizeApplication || isOptimizing" class="btn btn-success mt-auto w-full">
                            <LoaderCircleIcon v-if="isOptimizing" class="size-4 animate-spin mr-2"/>
                            {{ isOptimizing ? 'Optimizing...' : 'Optimize Now' }}
                        </button>
                    </div>

                    <!-- Card 3: Clear Optimize Cache -->
                    <div class="card p-5 flex flex-col items-start gap-4 group cursor-pointer rounded-xl bg-white text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/70 dark:hover:border-blue-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
                        <div class="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400"><SparklesIcon class="size-6"/></div>
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200">Clear Optimization Cache</h3>
                        <p class="text-sm text-muted flex-grow">Removes the cached configuration and route files. Use this during development if you make changes to config or route files.</p>
                         <button @click="clearOptimize" :disabled="!can.manageApplicationOptimization || isClearingOptimize" class="btn btn-primary mt-auto w-full">
                            <LoaderCircleIcon v-if="isClearingOptimize" class="size-4 animate-spin mr-2"/>
                            {{ isClearingOptimize ? 'Clearing...' : 'Clear Optimize Cache' }}
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* A simple fade-in for tab content */
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}

/* Base card styling, adjust as per your theme */
/* .card {
    @apply bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm;
} */
</style>