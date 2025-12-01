<script setup lang="ts">
import type { AxiosResponse } from 'axios';
import { ref, onMounted, computed } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';

// Icons
import { 
    DownloadIcon, 
    LoaderCircleIcon, 
    DatabaseIcon, 
    HardDriveDownloadIcon,
    CalendarIcon,
    FileCodeIcon
} from 'lucide-vue-next';

import LoadingState from '@/components/card/LoadingState.vue';
import DeleteModel from '@/components/button/DeleteModel.vue'; // 1. Import DeleteModel

interface Backup {
    name: string;
    path: string;
    size: number;
    last_modified: number;
};

interface Permissions {
    viewAnyBackup: boolean;
    createBackup: boolean;
    downloadBackup: boolean;
    deleteBackup: boolean;
    restoreDatabase: boolean;
};

const { notify, error: notifyError } = useNotifier();

const backups = ref<Backup[]>([]);
const can = ref<Permissions>({ viewAnyBackup:false, createBackup: false, downloadBackup: false, deleteBackup: false, restoreDatabase:false });
const isLoading = ref(true);

const isCreatingBackup = ref(false);
// const isDeletingBackupPath = ref<string | null>(null); // Removed: Handled by DeleteModel
const isDownloadingPath = ref<string | null>(null);

const fetchData = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/settings/database/backups');
        backups.value = response.data.backups || [];
        Object.assign(can.value, response.data.can);
    } catch (err) {
        notifyError(err as Error, 'Failed to load backup data.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchData);

const createBackup = async () => {
    isCreatingBackup.value = true;
    try {
        const response = await apiService.post<ApiResponse>('/settings/database/backup');
        backups.value = response.data.backups;
        notify(response);
    } catch (err) {
        notifyError(err as Error, 'Failed to create backup.');
    } finally {
        isCreatingBackup.value = false;
    }
};

// 2. New Handler for DeleteModel event
// DeleteModel emits the ID (path) we passed to it on success
const onBackupDeleted = (deletedPathEncoded: string | number) => {
    // Because we passed encoded URL, we might need to decode, 
    // but filtering by the original path logic is safer if we just reload or filter carefully.
    // Since the API usually returns the fresh list on delete, or we just filter:
    const path = decodeURIComponent(String(deletedPathEncoded));
    backups.value = backups.value.filter(b => b.path !== path);
};

const downloadBackupFile = async (path: string) => {
    isDownloadingPath.value = path;
    try {
        const url = `/settings/database/backup/download?path=${encodeURIComponent(path)}`;
        const response: AxiosResponse<Blob> = await apiService.get(url, {
            responseType: 'blob',
            getFullResponse: true,
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'download.sql';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=['"]?([^'"]+)['"]?$/);
            if (filenameMatch && filenameMatch[1]) {
                filename = decodeURIComponent(filenameMatch[1]);
            }
        }

        const blob = response.data;
        const blobUrl = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', filename);
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);

    } catch (err: any) {
        if (err.response && err.response.data instanceof Blob && err.response.data.type.includes('application/json')) {
            const errorBlob = err.response.data;
            const errorText = await errorBlob.text();
            const errorJson = JSON.parse(errorText);
            notify({ notification: errorJson.notification });
        } else {
             notifyError(err as Error, 'Failed to download backup.');
        }
    } finally {
        isDownloadingPath.value = null;
    }
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
};

const sortedBackups = computed(() => {
    return [...backups.value].sort((a, b) => b.last_modified - a.last_modified);
});
</script>

<template>
    <div class="p-6 md:p-8 space-y-8">
        
        <!-- Header -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold section-title flex items-center gap-3">
                    <HardDriveDownloadIcon class="text-primary-500" />
                    Database Backups
                </h1>
                <p class="text-muted mt-1 max-w-2xl">
                    Create snapshots of your database, manage archives, and restore data if needed.
                </p>
            </div>
            
            <button 
                v-if="can.createBackup" 
                @click="createBackup" 
                :disabled="isCreatingBackup" 
                class="btn btn-primary shadow-lg shadow-primary-500/20"
            >
                <LoaderCircleIcon v-if="isCreatingBackup" class="size-4 animate-spin mr-2" />
                <DatabaseIcon v-else class="size-4 mr-2" />
                {{ isCreatingBackup ? 'Creating...' : 'Create Backup' }}
            </button>
        </header>

        <!-- Main Content -->
        <div class="animate-fade-in">
            <div class="data-table-shell">
                <div class="p-4 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                    <h3 class="font-bold section-title text-sm uppercase tracking-wide">Backup History</h3>
                    <span class="text-xs text-muted">{{ sortedBackups.length }} Archives</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-section-bg">
                            <tr>
                                <th class="px-6 py-3 font-semibold text-muted uppercase tracking-wider w-1/2">Filename</th>
                                <th class="px-6 py-3 font-semibold text-muted uppercase tracking-wider">Size</th>
                                <th class="px-6 py-3 font-semibold text-muted uppercase tracking-wider">Created At</th>
                                <th class="px-6 py-3 font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody class="divide-y divide-muted">
                            <tr v-if="isLoading">
                                <td colspan="4" class="py-12">
                                    <LoadingState message="Loading backup archives..." />
                                </td>
                            </tr>
                            
                            <template v-else-if="sortedBackups.length > 0">
                                <tr 
                                    v-for="backup in sortedBackups" 
                                    :key="backup.path"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <!-- Name -->
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                                <FileCodeIcon class="size-4" />
                                            </div>
                                            <span class="font-mono text-sm font-medium section-title truncate max-w-xs" :title="backup.name">
                                                {{ backup.name }}
                                            </span>
                                        </div>
                                    </td>

                                    <!-- Size -->
                                    <td class="px-6 py-4 font-mono text-xs text-muted">
                                        {{ formatBytes(backup.size) }}
                                    </td>

                                    <!-- Date -->
                                    <td class="px-6 py-4 text-muted text-sm">
                                        <div class="flex items-center gap-2">
                                            <CalendarIcon class="size-3.5 opacity-70" />
                                            {{ formatDate(backup.last_modified) }}
                                        </div>
                                    </td>

                                    <!-- Actions -->
                                    <td class="px-6 py-4 whitespace-nowrap text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <button 
                                                v-if="can.downloadBackup" 
                                                @click="downloadBackupFile(backup.path)" 
                                                :disabled="isDownloadingPath === backup.path"
                                                class="group relative inline-flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md"
                                                title="Download SQL File"
                                            >
                                                <LoaderCircleIcon v-if="isDownloadingPath === backup.path" class="size-4 animate-spin" />
                                                <DownloadIcon v-else class="size-4" />
                                            </button>
                                            
                                            <!-- 
                                                3. Utilizing DeleteModel 
                                                Note on delete-url: We pass '?path=' so the DeleteModel 
                                                constructs '/settings/database/backup?path=/the/path'
                                                which works for passing file paths via URL safely.
                                            -->
                                            <DeleteModel 
                                                v-if="can.deleteBackup"
                                                :item-id="encodeURIComponent(backup.path)"
                                                :item-name="backup.name"
                                                delete-url="/settings/database/backup?path="
                                                icon-only
                                                confirm-message="Are you sure you want to permanently delete this backup? This action cannot be undone."
                                                @deleted="onBackupDeleted"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            
                            <tr v-else>
                                <td colspan="4" class="py-16 text-center">
                                    <div class="flex flex-col items-center justify-center text-muted">
                                        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                            <DatabaseIcon class="size-8 text-gray-400" />
                                        </div>
                                        <h3 class="text-lg font-bold section-title mb-1">No Backups Found</h3>
                                        <p class="text-sm max-w-xs mx-auto">
                                            Create your first backup to ensure your data is safe.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
</style>