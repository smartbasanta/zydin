<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import type { ColumnDefinition } from '@/types/datatable';

import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-vue-next';

import {
  TableAddButton,
  TableDeleteButton,
  TableEditButton,
  TableViewButton
} from '@/components/table/button';

import type { SystemNotification } from '@/types/notification';

import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const { can, visibleColumns, refreshData, currentColumns:notificationColumns } = useDataTable<SystemNotification>({
  apiEndpoint: 'settings.system-notifications.index',
  columns: [],
  tableName: 'system_notifications',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'expires_at', direction: 'desc' }
});

provide('refreshData', refreshData);

</script>

<template>
  <div>
    <DataTable data-table-class="!border-none !rounded-none">
      <template #title>
        System Notification Management
      </template>

      <template #add-new-button v-if="can.create">
        <TableAddButton :to="{ name: 'settings.system-notifications.create' }" title="Create New Notification" />
      </template>

      <template #row="{ row, columns }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">
          {{ row.id }}
        </td>

        <td v-if="visibleColumns.text" class="px-4 py-2.5">
          <div class="group">
            <div>
              <RouterLink v-if="row.can_view" :to="{ name: 'settings.system-notifications.show', params: { id: row.id } }"
                class="link">
                {{ row.text }}
              </RouterLink>
              <span v-else class="font-medium">{{ row.text }}</span>
            </div>
          </div>
        </td>
        <td v-if="visibleColumns.type" class="px-4 py-2.5">
          <span :class="{
            'bg-blue-100 text-blue-800': row.type === 'info',
            'bg-green-100 text-green-800': row.type === 'success',
            'bg-yellow-100 text-yellow-800': row.type === 'warning',
            'bg-red-100 text-red-800': row.type === 'error'
          }"
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full">
            <!-- {{ row.type.charAt(0).toUpperCase() + row.type.slice(1) }} -->
              {{ row.type }}
          </span>
        </td>
        <td v-if="visibleColumns.route" class="px-4 py-2.5">
          <div>
            <div>
              {{ row.route || 'No route provided.' }}
            </div>
          </div>

        </td>
        <td v-if="visibleColumns.link" class="px-4 py-2.5">
          <div>
            <div>
              {{ row.link || 'No Associated Links.' }}
            </div>
          </div>

        </td>

        <td v-if="visibleColumns.expires_at" class="px-4 py-2.5">
          {{ row.expires_at || 'Never Expires' }}
        </td>

        <td v-if="visibleColumns.is_visible" class="px-4 py-2.5 text-center">
          <span v-if="row.is_visible"
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-850 dark:bg-green-700/30 dark:text-green-700">
            <CheckCircleIcon class="size-3.5" /> Yes
          </span>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
            <XCircleIcon class="size-3.5" /> No
          </span>
        </td>

        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <TableViewButton v-if="row.can.view"
              :to="{ name: 'settings.system-notifications.show', params: { id: row.id } }" />
            <TableEditButton v-if="row.can.update"
              :to="{ name: 'settings.system-notifications.edit', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can.delete" :item-id="row.id" :item-name="row.text"
              delete-url="/settings/system-notifications/" @deleted="refreshData" />
          </div>
        </td>
      </template>

      <template #empty-state>
        <td :colspan="notificationColumns.filter(c => c.visible !== false).length + 1" class="text-center py-10 text-muted-foreground">
          <div class="flex flex-col items-center">
            <BellIcon class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">
              No Notifications Found
            </h3>
            <p class="text-sm">
              There are no notifications matching your current filters, or no notifications have been created yet.
            </p>
            <TableAddButton v-if="can.create" :to="{ name: 'settings.system-notifications.create' }"
              title="Create New Notification" class="mt-4" />
          </div>
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>