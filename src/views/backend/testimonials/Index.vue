<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import { 
    MessageSquare, 
    CheckCircleIcon, 
    XCircleIcon, 
    PlusIcon, 
    UserIcon, 
    StarIcon 
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { Testimonial } from '@/types';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages();

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
        <RouterLink :to="{ name: 'dashboard.testimonials.create' }" class="btn btn-primary">
            <PlusIcon class="size-4 mr-2" />
            Add Testimonial
        </RouterLink>
      </template>

      <template #row="{ row }">
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Avatar -->
        <td v-if="visibleColumns.avatar_thumbnail_url" class="table-cell">
            <div class="h-10 w-10 rounded-full border border-muted overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                <img 
                    v-if="row.avatar_thumbnail_url" 
                    :src="row.avatar_thumbnail_url" 
                    :alt="row.name" 
                    class="h-full w-full object-cover"
                >
                <UserIcon v-else class="size-5 text-gray-300 dark:text-gray-600" />
            </div>
        </td>

        <!-- Name -->
        <td v-if="visibleColumns.name" class="table-cell font-medium">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.testimonials.show', params: { id: row.id } }" 
            class="hover:underline"          >
            {{ row.name }}
          </RouterLink>
          <span v-else>{{ row.name }}</span>
        </td>

        <!-- Role -->
        <td v-if="visibleColumns.role" class="table-cell text-sm text-muted max-w-xs truncate">
            {{ row.role }}
        </td>

        <!-- Rating -->
        <td v-if="visibleColumns.rating" class="table-cell">
            <div class="flex items-center gap-0.5">
                <StarIcon 
                    v-for="i in 5" 
                    :key="i" 
                    class="size-3.5"
                    :class="i <= row.rating ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-700'" 
                />
            </div>
        </td>

        <!-- Type Badge -->
        <td v-if="visibleColumns.type" class="table-cell">
            <span 
                class="inline-flex px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border"
                :class="{
                    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': row.type === 'customer',
                    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20': row.type === 'employee'
                }"
            >
                {{ row.type }}
            </span>
        </td>

        <!-- Featured Status -->
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
                :to="{ name: 'dashboard.testimonials.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <EditButton 
                v-if="row.can?.update" 
                :to="{ name: 'dashboard.testimonials.edit', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="`testimonial from ${row.name}`"
                delete-url="/dashboard/testimonials/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="testimonialColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Testimonials Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              Add your first testimonial to build social proof.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.testimonials.create' }" class="btn btn-primary">
                <PlusIcon class="size-4 mr-2" />
                Add New Testimonial
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>