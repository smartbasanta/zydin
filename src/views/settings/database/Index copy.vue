<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';

// Icons
import { DownloadIcon, TrashIcon, LoaderCircleIcon, DatabaseZapIcon, DatabaseIcon } from 'lucide-vue-next';

// Components
import LoadingState from '@/components/card/LoadingState.vue';

// --- Type Definitions ---
interface Backup {
    name: string;
    path: string;
    size: number;
    last_modified: number; // Unix timestamp
};

interface Permissions {
    viewAnyBackup: boolean;
    createBackup: boolean;
    downloadBackup: boolean;
    deleteBackup: boolean;
    restoreDatabase: boolean;
};

// --- Composables ---
const { notify, error: notifyError } = useNotifier();

// --- State Management ---
const backups = ref<Backup[]>([]);
const can = ref<Permissions>({ viewAnyBackup:false, createBackup: false, downloadBackup: false, deleteBackup: false, restoreDatabase:false }); // Default cache to true, will be confirmed by gate on backend
const isLoading = ref(true);

// Action-specific loading states for better UX
const isCreatingBackup = ref(false);
const isDeletingBackupPath = ref<string | null>(null);


// --- Data Fetching ---
const fetchData = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/settings/database/backups');
        backups.value = response.data.backups || [];
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

// Database Actions
const createBackup = async () => {
    isCreatingBackup.value = true;
    try {
        const response = await apiService.post<ApiResponse>('/settings/database/backup');
        backups.value = response.data.backups; // The backend returns the updated list
        notify(response);
    } catch (err) {
        notifyError(err as Error, 'Failed to create backup.');
    } finally {
        isCreatingBackup.value = false;
    }
};

const deleteBackup = async (path: string) => {
    if (!confirm('Are you sure you want to permanently delete this backup? This action cannot be undone.')) {
        return;
    }
    isDeletingBackupPath.value = path;
    try {
        // Axios delete method sends payload in a 'data' object
        const response = await apiService.delete<ApiResponse>('/settings/database/backup', { data: { path } });
        // Remove from list locally for instant UI update
        backups.value = backups.value.filter(b => b.path !== path);
        notify(response);
    } catch (err) {
        notifyError(err as Error, 'Failed to delete backup.');
    } finally {
        isDeletingBackupPath.value = null;
    }
};

const getDownloadUrl = (path: string) => {
    // Generates a URL for the <a> tag. Assumes your apiService baseUrl is set up.
    // This hits the named GET route we defined.
    return `/api/settings/database/backup/download?path=${encodeURIComponent(path)}`;
};

// --- Computed Properties & Helpers ---
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
};

const sortedBackups = computed(() => {
    return [...backups.value].sort((a, b) => b.last_modified - a.last_modified);
});
</script>

<template>
    <div class="p-4 md:p-6 font-sans">
        <title>Backup & Maintenance</title>
        <header class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <DatabaseZapIcon class="text-primary" />
                Backup & Maintenance
            </h1>
            <p class="text-muted mt-1">Manage database backups and application cache settings.</p>
        </header>

        <!-- Tab Content -->
        <div>
            <!-- Database Backup Panel -->
            <div class="animate-fade-in">
                <div class="flex flex-col sm:flex-row py-2 items-center justify-between mb-4 gap-4">
                    <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Available Backups</h2>
                    <button v-if="can.createBackup" @click="createBackup" :disabled="isCreatingBackup" class="btn btn-primary w-full sm:w-auto">
                        <LoaderCircleIcon v-if="isCreatingBackup" class="size-4 animate-spin mr-2" />
                        <DatabaseIcon v-else class="size-4 mr-2" />
                        {{ isCreatingBackup ? 'Creating Backup...' : 'Create New Backup' }}
                    </button>
                </div>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Size</th>
                                <th>Date Created</th>
                                <th class="whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoading">
                                <td colspan="4">
                                    <LoadingState message="Loading backups..." />
                                </td>
                            </tr>
                            <template v-else-if="sortedBackups.length > 0">
                                <tr v-for="backup in sortedBackups" :key="backup.path">
                                    <td class="font-mono text-sm">{{ backup.name }}</td>
                                    <td>{{ formatBytes(backup.size) }}</td>
                                    <td>{{ formatDate(backup.last_modified) }}</td>
                                    <td class="whitespace-nowrap text-right">
                                        <div class="flex gap-2 justify-end">
                                            <a target="_blank" v-if="can.downloadBackup" :href="getDownloadUrl(backup.path)" class="btn btn-success py-2 px-3">
                                                <DownloadIcon class="size-4" />
                                            </a>
                                            <button v-if="can.deleteBackup" @click="deleteBackup(backup.path)" :disabled="isDeletingBackupPath === backup.path" class="btn btn-danger py-2 px-3">
                                                <LoaderCircleIcon v-if="isDeletingBackupPath === backup.path" class="size-4 animate-spin" />
                                                <TrashIcon v-else class="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <tr v-else class="bg-gray-100 dark:bg-gray-900">
                                <td colspan="4" class="py-6 px-2 text-center text-muted">No backups found.</td>
                            </tr>
                        </tbody>
                    </table>
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