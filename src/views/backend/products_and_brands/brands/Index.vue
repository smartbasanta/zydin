<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

import {
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-vue-next';

import {
  TableAddButton,
  TableDeleteButton,
  TableEditButton,
  TableViewButton
} from '@/components/table/button';

import type { Brand } from '@/types';

const { can, visibleColumns, refreshData, currentColumns: brandColumns } = useDataTable<Brand>({
  apiEndpoint: 'dashboard.brands.index',
  columns: [], // Columns are fetched from the backend
  tableName: 'brands',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'name', direction: 'asc' }
});

provide('refreshData', refreshData);
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        Brand Management
      </template>

      <template #add-new-button v-if="can.create">
        <TableAddButton :to="{ name: 'dashboard.brands.create' }" title="Create New Brand" />
      </template>

      <template #row="{ row }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">
          {{ row.id }}
        </td>

        <td v-if="visibleColumns.image_thumbnail_url || visibleColumns.image_url" class="px-4 py-2.5">
            <img v-if="row.image_thumbnail_url || row.image_url " :src="row.image_thumbnail_url || row.image_url" :alt="row.name" class="h-10 w-10 object-contain rounded-md">
            <div v-else class="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-muted">
                <PackageIcon class="size-5" />
            </div>
        </td>
        <td v-if="visibleColumns.name" class="px-4 py-2.5 font-medium">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.brands.show', params: { id: row.id } }" class="link">
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>
        
        <td v-if="visibleColumns.description" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 max-w-sm truncate">
            {{ row.description || 'N/A' }}
        </td>

        <td v-if="visibleColumns.is_featured" class="px-4 py-2.5 text-center">
          <span v-if="row.is_featured"
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-500">
            <CheckCircleIcon class="size-3.5" /> Yes
          </span>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
            <XCircleIcon class="size-3.5" /> No
          </span>
        </td>

        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <TableViewButton v-if="row.can?.view" :to="{ name: 'dashboard.brands.show', params: { id: row.id } }" />
            <TableEditButton v-if="row.can?.update" :to="{ name: 'dashboard.brands.edit', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="row.name"
              delete-url="/dashboard/brands/" @deleted="refreshData" />
          </div>
        </td>
      </template>

      <template #empty-state>
        <td :colspan="brandColumns.filter(c => c.visible !== false).length + 1" class="text-center py-10 text-muted-foreground">
          <div class="flex flex-col items-center">
            <PackageIcon class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">
              No Brands Found
            </h3>
            <p class="text-sm">
              Create your first brand to get started.
            </p>
            <TableAddButton v-if="can.create" :to="{ name: 'dashboard.brands.create' }"
              title="Add New Brand" class="mt-4" />
          </div>
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>