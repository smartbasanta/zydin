<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { GalleryHorizontal, Image as ImageIcon } from 'lucide-vue-next';
import { TableAddButton, TableDeleteButton, TableEditButton, TableViewButton } from '@/components/table/button';
import type { GalleryImage } from '@/types';

const { can, visibleColumns, refreshData, currentColumns } = useDataTable<GalleryImage>({
  apiEndpoint: 'dashboard.gallery.index',
  columns: [],
  tableName: 'gallery_images',
  initialSort: { key: 'order_column', direction: 'asc' }
});
provide('refreshData', refreshData);
</script>
<template>
  <div>
    <DataTable>
      <template #title>Gallery Management</template>
      <template #add-new-button v-if="can.create">
        <TableAddButton :to="{ name: 'dashboard.gallery.create' }" title="Add New Image" />
      </template>
      <template #row="{ row }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">{{ row.id }}</td>
        <td v-if="visibleColumns.image_thumbnail_url" class="px-4 py-2.5 text-muted">
          <img v-if="row.image_thumbnail_url" :src="row.image_thumbnail_url" :alt="row.caption || 'Gallery image'" class="h-10 w-16 object-cover rounded-md">
          <div v-else class="table-image-placeholder"><ImageIcon class="size-5" /></div>
        </td>
        <td v-if="visibleColumns.caption" class="px-4 py-2.5 font-medium max-w-sm truncate">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.gallery.show', params: { id: row.id } }" class="link">{{ row.caption || '(No Caption)' }}</RouterLink>
          <span v-else>{{ row.caption || '(No Caption)' }}</span>
        </td>
        <td v-if="visibleColumns.gallery_group" class="px-4 py-2.5">
            <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': row.gallery_group === 'company_culture',
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': row.gallery_group === 'employee_life'
            }">{{ row.gallery_group.replace('_', ' ') }}</span>
        </td>
        <td v-if="visibleColumns.order_column" class="px-4 py-2.5 text-muted">{{ row.order_column }}</td>
        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <TableViewButton v-if="row.can?.view" :to="{ name: 'dashboard.gallery.show', params: { id: row.id } }" />
            <TableEditButton v-if="row.can?.update" :to="{ name: 'dashboard.gallery.edit', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="row.caption || `Image #${row.id}`" delete-url="/dashboard/gallery/" @deleted="refreshData" />
          </div>
        </td>
      </template>
      <template #empty-state>
        <td :colspan="currentColumns.filter(c => c.visible !== false).length + 1" class="empty-state">
            <GalleryHorizontal class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">No Gallery Images Found</h3>
            <p class="text-sm">Add your first image to build a gallery.</p>
            <TableAddButton v-if="can.create" :to="{ name: 'dashboard.gallery.create' }" title="Add New Image" class="mt-4" />
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>