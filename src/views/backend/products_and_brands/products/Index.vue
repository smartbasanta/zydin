<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
// We don't need the global ConfirmModal anymore since DeleteModel handles it internally
// import ConfirmModal from '@/components/modal/ConfirmModal.vue';

import {
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { Product } from '@/types';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages();

const { can, visibleColumns, refreshData, currentColumns: productColumns } = useDataTable<Product>({
  apiEndpoint: 'dashboard.products.index',
  columns: [], // Assuming your composable fetches columns or they are defined elsewhere
  tableName: 'products',
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
        Product Management
      </template>

      <template #add-new-button v-if="can.create">
        <!-- Using standard btn classes instead of specific TableAddButton component -->
        <RouterLink :to="{ name: 'dashboard.products.create' }" class="btn btn-primary">
          <PlusIcon class="size-4 mr-2" />
          Add Product
        </RouterLink>
      </template>

      <template #row="{ row }">
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Image -->
        <td v-if="visibleColumns.image_thumbnail_url || visibleColumns.image_url" class="table-cell">
          <div
            class="h-10 w-10 rounded-lg border border-muted overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
            <img
              :src="row.image_thumbnail_url ?? row.image_url ?? (row.type === 'api' ? defaultProductAPIImage : defaultProductFFImage)"
              :alt="row.name" class="h-full w-full object-cover">
          </div>
        </td>

        <!-- Name -->
        <td v-if="visibleColumns.name" class="table-cell font-medium">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.products.show', params: { id: row.id } }"
            class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400">
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>

        <!-- Generic Name -->
        <td v-if="visibleColumns.generic_name" class="table-cell text-muted">
          {{ row.generic_name || '-' }}
        </td>

        <!-- Type Badge -->
        <td v-if="visibleColumns.type" class="table-cell">
          <span class="inline-flex px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border"
            :class="{
              // API: Clean Sky Blue
              'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20': row.type === 'api',

              // FF: Rich Violet
              'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20': row.type === 'ff'
            }">
            {{ row.type }}
          </span>
        </td>

        <!-- Brand -->
        <td v-if="visibleColumns.brand" class="table-cell">
          {{ row.brand?.name || '-' }}
        </td>

        <!-- Category -->
        <td v-if="visibleColumns.category" class="table-cell">
          {{ row.category || '-' }}
        </td>

        <!-- Therapeutic Area -->
        <td v-if="visibleColumns.therapeutic_area" class="table-cell">
          {{ row.therapeutic_area || '-' }}
        </td>

        <!-- Featured Status -->
        <td v-if="visibleColumns.is_featured" class="table-cell text-center">
          <!-- Featured: Vibrant but clean -->
          <span v-if="row.is_featured" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
           bg-emerald-50 text-emerald-700 border border-emerald-200 
           dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircleIcon class="size-3.5" />
            Featured
          </span>

          <!-- Not Featured: Subtle and recessive -->
          <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full 
           dark:bg-transparent dark:text-slate-400 dark:border-slate-700">
            No
          </span>
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton v-if="row.can?.view" :to="{ name: 'dashboard.products.show', params: { id: row.id } }" icon-only
              size="sm" />
            <EditButton v-if="row.can?.update" :to="{ name: 'dashboard.products.edit', params: { id: row.id } }"
              icon-only size="sm" />
            <DeleteModel v-if="row.can?.delete" :item-id="row.id" :item-name="row.name"
              delete-url="/dashboard/products/" icon-only size="sm" @deleted="refreshData" />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="100" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <PackageIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Products Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              Get started by adding your first product to the inventory.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.products.create' }" class="btn btn-primary">
              <PlusIcon class="size-4 mr-2" />
              Add New Product
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>