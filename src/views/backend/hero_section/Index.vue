<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { CheckCircleIcon, XCircleIcon, ImageIcon } from 'lucide-vue-next';
import { TableAddButton, TableDeleteButton, TableEditButton, TableViewButton } from '@/components/table/button';
import type { HeroSlide } from '@/types';

const { can, visibleColumns, refreshData, currentColumns } = useDataTable<HeroSlide>({
  apiEndpoint: 'dashboard.hero-slides.index',
  columns:[],
  tableName: 'hero_slides',
  initialSort: { key: 'order_column', direction: 'asc' }
});
provide('refreshData', refreshData);
</script>
<template>
  <div>
    <DataTable>
      <template #title>Hero Section Slides</template>
      <template #add-new-button v-if="can.create">
        <TableAddButton :to="{ name: 'dashboard.hero-slides.create' }" title="Add New Slide" />
      </template>
      <template #row="{ row }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">{{ row.id }}</td>
        <td v-if="visibleColumns.image_thumbnail_url" class="px-4 py-2.5 text-muted">
          <img v-if="row.image_thumbnail_url" :src="row.image_thumbnail_url" :alt="row.title" class="h-10 w-16 object-cover rounded-md">
          <div v-else class="table-image-placeholder"><ImageIcon class="size-5" /></div>
        </td>
        <td v-if="visibleColumns.title" class="px-4 py-2.5 font-medium">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.hero-slides.show', params: { id: row.id } }" class="link">{{ row.title }}</RouterLink>
          <span v-else>{{ row.title }}</span>
        </td>
        <td v-if="visibleColumns.is_active" class="px-4 py-2.5 text-center">
          <span v-if="row.is_active" class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-500"><CheckCircleIcon class="size-3.5" /> Active</span>
          <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"><XCircleIcon class="size-3.5" /> Inactive</span>
        </td>
        <td v-if="visibleColumns.order_column" class="px-4 py-2.5 text-muted">{{ row.order_column }}</td>
        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <TableViewButton v-if="row.can?.view" :to="{ name: 'dashboard.hero-slides.show', params: { id: row.id } }" />
            <TableEditButton v-if="row.can?.update" :to="{ name: 'dashboard.hero-slides.edit', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="row.title" delete-url="/dashboard/hero-slides/" @deleted="refreshData" />
          </div>
        </td>
      </template>
      <template #empty-state>
        <td :colspan="currentColumns.filter(c => c.visible !== false).length + 1" class="empty-state">
          <div class="flex flex-col items-center">
            <ImageIcon class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">No Hero Slides Found</h3>
            <p class="text-sm">Create your first slide to populate the homepage hero section.</p>
            <TableAddButton v-if="can.create" :to="{ name: 'dashboard.hero-slides.create' }" title="Add New Slide" class="mt-4" />
          </div>
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>