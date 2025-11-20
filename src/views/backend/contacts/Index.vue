<script setup lang="ts">
import { provide, ref } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { Mail, MailOpen, MessageSquare } from 'lucide-vue-next';
import {
  TableDeleteButton,
  TableViewButton
} from '@/components/table/button';
import type { ContactSubmission } from '@/types';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';

const { can, visibleColumns, refreshData, currentColumns: submissionColumns } = useDataTable<ContactSubmission>({
  apiEndpoint: 'dashboard.contact-submissions.index',
  columns: [],
  tableName: 'contact_submissions',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'created_at', direction: 'desc' }
});

provide('refreshData', refreshData);

const { notify, error: notifyError } = useNotifier();
const isToggling = ref<number | null>(null);

const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

const toggleReadStatus = async (submission: ContactSubmission) => {
    if (isToggling.value !== null) return;
    isToggling.value = submission.id;
    try {
        await apiService.patch(`/dashboard/contact-submissions/${submission.id}/toggle-read`);
        // Instead of a full refresh, just update the local state for a smoother UX
        submission.is_read = !submission.is_read;
    } catch (err) {
        notifyError(err as any, 'Failed to update status');
    } finally {
        isToggling.value = null;
    }
};
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        Contact Submissions
      </template>

      <template #row="{ row }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">
          {{ row.id }}
        </td>

        <td v-if="visibleColumns.name" class="px-4 py-2.5 font-medium">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.contact-submissions.show', params: { id: row.id } }" class="link">
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>

        <td v-if="visibleColumns.subject" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 max-w-sm truncate">
          {{ row.subject }}
        </td>

        <td v-if="visibleColumns.is_read" class="px-4 py-2.5 text-center">
            <button 
              @click="toggleReadStatus(row)" 
              :disabled="isToggling === row.id"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer disabled:opacity-50"
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-500': row.is_read,
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-500': !row.is_read
              }"
              title="Click to toggle status"
            >
                <MailOpen v-if="row.is_read" class="size-3.5" />
                <Mail v-else class="size-3.5" />
                {{ row.is_read ? 'Read' : 'Unread' }}
            </button>
        </td>
        
        <td v-if="visibleColumns.created_at" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(row.created_at) }}
        </td>

        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <TableViewButton v-if="row.can?.view" :to="{ name: 'dashboard.contact-submissions.show', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="`submission from ${row.name}`"
              delete-url="/dashboard/contact-submissions/" @deleted="refreshData" />
          </div>
        </td>
      </template>

      <template #empty-state>
        <td :colspan="submissionColumns.filter(c => c.visible !== false).length + 1" class="text-center py-10 text-muted-foreground">
          <div class="flex flex-col items-center">
            <MessageSquare class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">
              No Submissions Yet
            </h3>
            <p class="text-sm">
              Messages from the contact form will appear here.
            </p>
          </div>
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>