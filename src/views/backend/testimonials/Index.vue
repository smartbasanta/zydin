<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { StarIcon, UserSquare, CheckCircleIcon, XCircleIcon, MessageSquare } from 'lucide-vue-next';
import {
  TableAddButton,
  TableDeleteButton,
  TableEditButton,
  TableViewButton
} from '@/components/table/button';
import type { Testimonial } from '@/types';

const { can, visibleColumns, refreshData, currentColumns: testimonialColumns } = useDataTable<Testimonial>({
  apiEndpoint: 'dashboard.testimonials.index',
  columns: [],
  tableName: 'testimonials',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'created_at', direction: 'desc' }
});

provide('refreshData', refreshData);
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        Testimonial Management
      </template>

      <template #add-new-button v-if="can.create">
        <TableAddButton :to="{ name: 'dashboard.testimonials.create' }" title="Create New Testimonial" />
      </template>

      <template #row="{ row }">
        <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">{{ row.id }}</td>

        <td v-if="visibleColumns.avatar_thumbnail_url" class="px-4 py-2.5 text-muted">
          <img v-if="row.avatar_thumbnail_url" :src="row.avatar_thumbnail_url" :alt="row.name" class="h-10 w-10 object-cover rounded-full">
          <div v-else class="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-muted">
            <UserSquare class="size-5" />
          </div>
        </td>

        <td v-if="visibleColumns.name" class="px-4 py-2.5 font-medium">
          <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.testimonials.show', params: { id: row.id } }" class="link">
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>

        <td v-if="visibleColumns.role" class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{{ row.role }}</td>

        <td v-if="visibleColumns.rating" class="px-4 py-2.5">
            <div class="flex items-center">
                <StarIcon v-for="i in row.rating" :key="i" class="h-4 w-4 text-yellow-400 fill-current" />
                <StarIcon v-for="i in 5 - row.rating" :key="i" class="h-4 w-4 text-gray-300 dark:text-gray-600" />
            </div>
        </td>

        <td v-if="visibleColumns.type" class="px-4 py-2.5 text-sm">
            <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': row.type === 'customer',
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': row.type === 'employee'
            }">{{ row.type }}</span>
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
            <TableViewButton v-if="row.can?.view" :to="{ name: 'dashboard.testimonials.show', params: { id: row.id } }" />
            <TableEditButton v-if="row.can?.update" :to="{ name: 'dashboard.testimonials.edit', params: { id: row.id } }" />
            <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="`testimonial from ${row.name}`"
              delete-url="/dashboard/testimonials/" @deleted="refreshData" />
          </div>
        </td>
      </template>

      <template #empty-state>
        <td :colspan="testimonialColumns.filter(c => c.visible !== false).length + 1" class="text-center py-10 text-muted-foreground">
          <div class="flex flex-col items-center">
            <MessageSquare class="size-16 text-slate-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1">No Testimonials Found</h3>
            <p class="text-sm">Create your first testimonial to get started.</p>
            <TableAddButton v-if="can.create" :to="{ name: 'dashboard.testimonials.create' }"
              title="Add New Testimonial" class="mt-4" />
          </div>
        </td>
      </template>
    </DataTable>
    <ConfirmModal />
  </div>
</template>