<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  LinkIcon,
  RouteIcon,
  CalendarIcon
} from 'lucide-vue-next';

// Use universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { SystemNotification } from '@/types/notification';

const { can, visibleColumns, refreshData, currentColumns: notificationColumns } = useDataTable<SystemNotification>({
  apiEndpoint: 'settings.system-notifications.index',
  columns: [],
  tableName: 'system_notifications',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'expires_at', direction: 'desc' }
});

provide('refreshData', refreshData);

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never Expires';
    return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
};
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        System Notifications
      </template>

      <template #add-new-button v-if="can.create">
        <RouterLink :to="{ name: 'settings.system-notifications.create' }" class="btn btn-primary">
            <PlusIcon class="size-4 mr-2" />
            Create Notification
        </RouterLink>
      </template>

      <template #row="{ row }">
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Text/Message -->
        <td v-if="visibleColumns.text" class="table-cell font-medium max-w-xs">
            <RouterLink 
                v-if="row.can_view" 
                :to="{ name: 'settings.system-notifications.show', params: { id: row.id } }" 
                class="block truncate text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
                :title="row.text"
            >
                {{ row.text }}
            </RouterLink>
            <span v-else class="block truncate" :title="row.text">{{ row.text }}</span>
        </td>

        <!-- Type Badge -->
        <td v-if="visibleColumns.type" class="table-cell">
          <span 
            class="inline-flex px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border"
            :class="{
                'text-sky-700 border-sky-200 dark:text-sky-400 dark:border-sky-800': row.type === 'info',
                'text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800': row.type === 'success',
                'text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800': row.type === 'warning',
                'text-rose-700 border-rose-200 dark:text-rose-400 dark:border-rose-800': row.type === 'error',
            }"
          >
              {{ row.type }}
          </span>
        </td>

        <!-- Route -->
        <td v-if="visibleColumns.route" class="table-cell text-sm text-muted">
            <div v-if="row.route" class="flex items-center gap-1.5 max-w-[150px]" :title="row.route">
                <RouteIcon class="size-3.5 opacity-70 shrink-0" />
                <span class="truncate font-mono text-xs">{{ row.route }}</span>
            </div>
            <span v-else class="text-xs text-muted/50">-</span>
        </td>

        <!-- Link -->
        <td v-if="visibleColumns.link" class="table-cell text-sm text-muted">
            <div v-if="row.link" class="flex items-center gap-1.5 max-w-[150px]" :title="row.link">
                <LinkIcon class="size-3.5 opacity-70 shrink-0" />
                <span class="truncate font-mono text-xs">{{ row.link }}</span>
            </div>
            <span v-else class="text-xs text-muted/50">-</span>
        </td>

        <!-- Expires At -->
        <td v-if="visibleColumns.expires_at" class="table-cell text-sm text-muted">
             <div class="flex items-center gap-1.5 whitespace-nowrap">
                <CalendarIcon class="size-3.5 opacity-70" />
                <span>{{ formatDate(row.expires_at) }}</span>
            </div>
        </td>

        <!-- Visibility -->
        <td v-if="visibleColumns.is_visible" class="table-cell text-center">
          <span v-if="row.is_visible"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
                   bg-emerald-50 text-emerald-700 border border-emerald-200 
                   dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircleIcon class="size-3.5" /> Visible
          </span>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full 
                   dark:bg-transparent dark:text-slate-400 dark:border-slate-700">
            <XCircleIcon class="size-3.5" /> Hidden
          </span>
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'settings.system-notifications.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <EditButton 
                v-if="row.can?.update" 
                :to="{ name: 'settings.system-notifications.edit', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="row.text"
                delete-url="/settings/system-notifications/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="notificationColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BellIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Notifications Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              There are no notifications matching your current filters, or no notifications have been created yet.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'settings.system-notifications.create' }" class="btn btn-primary">
                <PlusIcon class="size-4 mr-2" />
                Create Notification
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>