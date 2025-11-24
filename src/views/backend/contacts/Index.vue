<script setup lang="ts">
import { provide, ref } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import { 
    MailIcon, 
    MailOpenIcon, 
    MessageSquareIcon, 
    Loader2Icon 
} from 'lucide-vue-next';

// Use universal buttons
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

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

const formatDate = (dateString: string) => new Date(dateString).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

const toggleReadStatus = async (submission: ContactSubmission) => {
    if (isToggling.value !== null) return;
    isToggling.value = submission.id;
    try {
        await apiService.patch(`/dashboard/contact-submissions/${submission.id}/toggle-read`);
        submission.is_read = !submission.is_read;
        // Optional: Notify user of status change
        // notify({ title: 'Status Updated', message: `Marked as ${submission.is_read ? 'Read' : 'Unread'}` });
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
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Name -->
        <td v-if="visibleColumns.name" class="table-cell font-medium">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.contact-submissions.show', params: { id: row.id } }" 
            class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
          >
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>

        <!-- Subject -->
        <td v-if="visibleColumns.subject" class="table-cell text-sm text-muted max-w-sm truncate">
          {{ row.subject }}
        </td>

        <!-- Status Toggle (Interactive Badge) -->
        <td v-if="visibleColumns.is_read" class="table-cell text-center">
            <button 
              @click="toggleReadStatus(row)" 
              :disabled="isToggling === row.id"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
              :class="{
                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 focus:ring-emerald-500': row.is_read,
                'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 focus:ring-amber-500': !row.is_read,
                'opacity-70 cursor-wait': isToggling === row.id
              }"
              title="Click to toggle status"
            >
                <Loader2Icon v-if="isToggling === row.id" class="size-3.5 animate-spin" />
                <template v-else>
                    <MailOpenIcon v-if="row.is_read" class="size-3.5" />
                    <MailIcon v-else class="size-3.5" />
                </template>
                {{ row.is_read ? 'Read' : 'Unread' }}
            </button>
        </td>
        
        <!-- Date -->
        <td v-if="visibleColumns.created_at" class="table-cell text-sm text-muted font-mono whitespace-nowrap">
            {{ formatDate(row.created_at) }}
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'dashboard.contact-submissions.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="`submission from ${row.name}`"
                delete-url="/dashboard/contact-submissions/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="submissionColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquareIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Submissions Yet
            </h3>
            <p class="text-sm max-w-xs mx-auto">
              Messages from the contact form will appear here.
            </p>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>