<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import {
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TagIcon
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { Brand } from '@/types';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // Ensure you have a default brand image in your composable

const { can, visibleColumns, refreshData, currentColumns: brandColumns } = useDataTable<Brand>({
  apiEndpoint: 'dashboard.brands.index',
  columns: [],
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
        <RouterLink :to="{ name: 'dashboard.brands.create' }" class="btn btn-primary">
            <PlusIcon class="size-4 mr-2" />
            Add Brand
        </RouterLink>
      </template>

      <template #row="{ row }">
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Image -->
        <td v-if="visibleColumns.image_thumbnail_url || visibleColumns.image_url" class="table-cell">
            <div class="h-10 w-10 rounded-lg border border-muted overflow-hidden flex items-center justify-center">
                <img 
                    :src="row.image_thumbnail_url ?? row.image_url ?? zydinLogoImage" 
                    :alt="row.name" 
                    class="h-full w-full object-contain p-1"
                >
                <!-- <TagIcon v-else class="size-5 text-gray-300 dark:text-gray-600" /> -->
            </div>
        </td>

        <!-- Name -->
        <td v-if="visibleColumns.name" class="table-cell font-medium">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.brands.show', params: { id: row.id } }" 
            class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
          >
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>
        
        <!-- Description -->
        <td v-if="visibleColumns.description" class="table-cell text-sm text-muted max-w-sm truncate">
            {{ row.description || '-' }}
        </td>

        <!-- Featured Badge (Modern Emerald Style) -->
        <td v-if="visibleColumns.is_featured" class="table-cell text-center">
          <span v-if="row.is_featured"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
                   bg-emerald-50 text-emerald-700 border border-emerald-200 
                   dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircleIcon class="size-3.5" /> Featured
          </span>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full 
                   dark:bg-transparent dark:text-slate-400 dark:border-slate-700">
            No
          </span>
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'dashboard.brands.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <EditButton 
                v-if="row.can?.update" 
                :to="{ name: 'dashboard.brands.edit', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="row.name"
                delete-url="/dashboard/brands/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="brandColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <TagIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Brands Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              Start building your catalog by adding your first brand.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.brands.create' }" class="btn btn-primary">
                <PlusIcon class="size-4 mr-2" />
                Add New Brand
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>