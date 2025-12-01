<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';

// Icons
import { 
    LoaderCircleIcon, 
    DatabaseZapIcon, 
    RocketIcon, 
    SparklesIcon, 
    EraserIcon,
    ServerIcon
} from 'lucide-vue-next';

import LoadingState from '@/components/card/LoadingState.vue';

interface Permissions {
    viewCache: boolean;
    clearDatabaseCache: boolean;
    manageApplicationOptimization: boolean;
    optimizeApplication: boolean;
};

const { notify, error: notifyError } = useNotifier();

const can = ref<Permissions>({ viewCache: true, clearDatabaseCache:false, manageApplicationOptimization: false, optimizeApplication: false });
const isLoading = ref(true);

// Action states
const isClearingDbCache = ref(false);
const isOptimizing = ref(false);
const isClearingOptimize = ref(false);

const fetchData = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/settings/cache');
        Object.assign(can.value, response.data.can);
    } catch (err) {
        notifyError(err as Error, 'Failed to load settings.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchData);

// Actions
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
    <div class="p-6 md:p-8 font-sans space-y-8">
        
        <!-- Header -->
        <header>
            <h1 class="text-2xl font-bold section-title flex items-center gap-3">
                <ServerIcon class="text-emerald-500" />
                Performance & Cache
            </h1>
            <p class="text-muted mt-1 max-w-2xl">
                Manage application caching layers and optimization routines to ensure peak performance.
            </p>
        </header>

        <LoadingState v-if="isLoading" message="Loading settings..." />

        <!-- Main Content -->
        <div v-else class="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Card 1: Clear DB Cache (Maintenance - Amber) -->
            <div class="action-card group border-amber-200 dark:border-amber-900/50">
                <div class="flex-1">
                    <div class="icon-box bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <DatabaseZapIcon class="size-6" />
                    </div>
                    <h3 class="card-title group-hover:text-amber-700 dark:group-hover:text-amber-400">
                        Clear Database Cache
                    </h3>
                    <p class="card-desc">
                        Flush the query cache. Use this if you notice stale data or inconsistencies in the application.
                    </p>
                </div>
                
                <button 
                    @click="clearDbCache" 
                    :disabled="!can.clearDatabaseCache || isClearingDbCache" 
                    class="btn w-full btn-secondary"
                >
                    <LoaderCircleIcon v-if="isClearingDbCache" class="size-4 animate-spin mr-2"/>
                    <EraserIcon v-else class="size-4 mr-2" />
                    {{ isClearingDbCache ? 'Clearing...' : 'Clear Cache' }}
                </button>
            </div>

            <!-- Card 2: Optimize App (Performance - Emerald) -->
            <div class="action-card group border-emerald-200 dark:border-emerald-900/50">
                <div class="flex-1">
                    <div class="icon-box bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <RocketIcon class="size-6" />
                    </div>
                    <h3 class="card-title group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        Optimize Application
                    </h3>
                    <p class="card-desc">
                        Cache configuration and routes. Recommended for production environments to significantly boost speed.
                    </p>
                </div>
                
                <button 
                    @click="optimizeApp" 
                    :disabled="!can.optimizeApplication || isOptimizing" 
                    class="btn w-full btn-primary"
                >
                    <LoaderCircleIcon v-if="isOptimizing" class="size-4 animate-spin mr-2"/>
                    <SparklesIcon v-else class="size-4 mr-2" />
                    {{ isOptimizing ? 'Optimizing...' : 'Run Optimization' }}
                </button>
            </div>

            <!-- Card 3: Clear Optimization (Reset - Sky) -->
            <div class="action-card group border-sky-200 dark:border-sky-900/50">
                <div class="flex-1">
                    <div class="icon-box bg-gradient-secondary">
                        <EraserIcon class="size-6" />
                    </div>
                    <h3 class="card-title">
                        Clear Optimization
                    </h3>
                    <p class="card-desc">
                        Remove cached config/routes. Necessary during development or after making configuration changes.
                    </p>
                </div>
                
                <button 
                    @click="clearOptimize" 
                    :disabled="!can.manageApplicationOptimization || isClearingOptimize" 
                    class="btn w-full bg-gradient-secondary "
                >
                    <LoaderCircleIcon v-if="isClearingOptimize" class="size-4 animate-spin mr-2"/>
                    <RotateCcwIcon v-else class="size-4 mr-2" />
                    {{ isClearingOptimize ? 'Clearing...' : 'Reset Caches' }}
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.action-card {
    @apply flex flex-col p-6 rounded-2xl border section-bg section-title shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1;
}

.icon-box {
    @apply p-3 w-fit rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110;
}

.card-title {
    @apply text-lg font-bold section-title mb-2 transition-colors;
}

.card-desc {
    @apply text-sm section-title leading-relaxed mb-6;
}
</style>