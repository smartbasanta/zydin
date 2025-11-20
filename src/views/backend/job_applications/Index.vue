<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { FileTextIcon, DownloadIcon, LoaderCircleIcon } from 'lucide-vue-next';
import {
  TableDeleteButton,
  TableViewButton
} from '@/components/table/button';
import type { JobApplication } from '@/types';
import type { AxiosResponse } from 'axios';
import { apiService } from '@/services/api.service';
import { ref } from 'vue';
import { useNotifier } from '@/composables/useNotifier';

const { can, visibleColumns, refreshData, currentColumns: appColumns } = useDataTable<JobApplication>({
  apiEndpoint: 'dashboard.job-applications.index',
  columns: [],
  tableName: 'job_applications',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'created_at', direction: 'desc' }
});

provide('refreshData', refreshData);
const { error:notifyError } = useNotifier();

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

// Helper to get the correct, non-SPA download URL
const isDownloadingId = ref<number | null>(null);

const downloadResumeFile = async (applicationId: number) => {
    isDownloadingId.value = applicationId;
    try {
        const url = `/dashboard/job-applications/${applicationId}/download-resume`;

        // Use the exact same pattern as your backup download
        const response: AxiosResponse<Blob> = await apiService.get(url, {
            responseType: 'blob',
            getFullResponse: true,
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'resume.pdf'; // Default filename
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
        // Handle cases where the file might not be found (404) or permissions fail (403)
        if (err.response && err.response.data instanceof Blob && err.response.data.type.includes('application/json')) {
            const errorBlob = err.response.data;
            const errorText = await errorBlob.text();
            const errorJson = JSON.parse(errorText);
            // Assuming your backend sends a notification object on error
            if (errorJson.notification) {
                notifyError(errorJson.notification);
            } else {
                notifyError({ message: errorJson.message || 'Failed to download resume.' });
            }
        } else {
             notifyError(err as Error, 'Failed to download resume.');
        }
    } finally {
        isDownloadingId.value = null;
    }
};
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        Job Applications
      </template>

      <template #row="{ row }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">
          {{ row.id }}
        </td>
        <td v-if="visibleColumns.name" class="px-4 py-2.5 font-medium">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.job-applications.show', params: { id: row.id } }" class="link">
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>
        <td v-if="visibleColumns.job_opening" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
            {{ row.job_title }}
        </td>
        <td v-if="visibleColumns.email" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
            <a :href="`mailto:${row.email}`" class="link">{{ row.email }}</a>
        </td>
        <td v-if="visibleColumns.phone" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
            {{ row.phone }}
        </td>
        <td v-if="visibleColumns.created_at" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(row.created_at) }}
        </td>

        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <button
              v-if="row.resume_url"
              @click="downloadResumeFile(row.id)"
              :disabled="isDownloadingId === row.id"
              class="btn btn-sm btn-icon" 
              title="Download Resume"
            >
              <!-- Show loader when this specific row's resume is downloading -->
              <LoaderCircleIcon v-if="isDownloadingId === row.id" class="size-4 animate-spin" />
              <DownloadIcon v-else class="size-4" />
            </button>
            <TableViewButton v-if="row.can?.view" :to="{ name: 'dashboard.job-applications.show', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="`application from ${row.name}`"
              delete-url="/dashboard/job-applications/" @deleted="refreshData" />
          </div>
        </td>
      </template>

      <template #empty-state>
        <td :colspan="appColumns.filter(c => c.visible !== false).length + 1" class="text-center py-10 text-muted-foreground">
          <div class="flex flex-col items-center">
            <FileTextIcon class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">
              No Applications Received
            </h3>
            <p class="text-sm">
              Applications submitted through the website will appear here.
            </p>
          </div>
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>