<script setup lang="ts">
import { provide, ref } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import { 
    FileTextIcon, 
    DownloadIcon, 
    LoaderCircleIcon, 
    MailIcon, 
    PhoneIcon, 
    BriefcaseIcon 
} from 'lucide-vue-next';

// Use universal buttons
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { JobApplication } from '@/types';
import type { AxiosResponse } from 'axios';
import { apiService } from '@/services/api.service';
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
const { error: notifyError } = useNotifier();

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

// Helper to get the correct, non-SPA download URL
const isDownloadingId = ref<number | null>(null);

const downloadResumeFile = async (applicationId: number) => {
    isDownloadingId.value = applicationId;
    try {
        const url = `/dashboard/job-applications/${applicationId}/download-resume`;

        const response: AxiosResponse<Blob> = await apiService.get(url, {
            responseType: 'blob',
            getFullResponse: true,
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'resume.pdf';
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
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Applicant Name -->
        <td v-if="visibleColumns.name" class="table-cell font-medium">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.job-applications.show', params: { id: row.id } }" 
            class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
          >
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>

        <!-- Job Position -->
        <td v-if="visibleColumns.job_opening" class="table-cell text-sm text-muted">
            <div class="flex items-center gap-1.5">
                <BriefcaseIcon class="size-3.5 opacity-70" />
                {{ row.job_title }}
            </div>
        </td>

        <!-- Email -->
        <td v-if="visibleColumns.email" class="table-cell">
            <a :href="`mailto:${row.email}`" class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary-600 transition-colors">
                <MailIcon class="size-3.5 opacity-70" />
                {{ row.email }}
            </a>
        </td>

        <!-- Phone -->
        <td v-if="visibleColumns.phone" class="table-cell text-sm text-muted">
            <div class="flex items-center gap-1.5">
                <PhoneIcon class="size-3.5 opacity-70" />
                {{ row.phone }}
            </div>
        </td>

        <!-- Date -->
        <td v-if="visibleColumns.created_at" class="table-cell text-sm text-muted font-mono">
            {{ formatDate(row.created_at) }}
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <!-- Resume Download Button (Styled to match ViewButton) -->
            <button
              v-if="row.resume_url"
              @click="downloadResumeFile(row.id)"
              :disabled="isDownloadingId === row.id"
              class="group relative inline-flex items-center justify-center p-2.5 rounded-xl border transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-slate-500/40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:border-slate-500/50 dark:hover:border-slate-400/50 hover:text-slate-700 dark:hover:text-slate-300 hover:shadow-md hover:-translate-y-0.5"
              title="Download Resume"
            >
                <span class="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <component 
                    :is="isDownloadingId === row.id ? LoaderCircleIcon : DownloadIcon" 
                    class="relative z-10 size-5 transition-transform duration-300 group-hover:scale-110"
                    :class="{ 'animate-spin': isDownloadingId === row.id }"
                />
            </button>

            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'dashboard.job-applications.show', params: { id: row.id } }" 
                icon-only
                size="sm"
            />
            
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="`application from ${row.name}`"
                delete-url="/dashboard/job-applications/" 
                icon-only
                size="sm"
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="appColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileTextIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Applications Received
            </h3>
            <p class="text-sm max-w-xs mx-auto">
              Applications submitted via the careers page will appear here.
            </p>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>