<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import { 
    ImageIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    PlusIcon, 
    ArrowUpDownIcon 
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { HeroSlide } from '@/types';
import { useDefaultImages } from '@/composables/useDefaultImages';
const { can, visibleColumns, refreshData, currentColumns: slideColumns } = useDataTable<HeroSlide>({
  apiEndpoint: 'dashboard.hero-slides.index',
  columns: [],
  tableName: 'hero_slides',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'order_column', direction: 'asc' }
});
const { defaultSlideImage } = useDefaultImages();

provide('refreshData', refreshData);
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        Hero Section Slides
      </template>

      <template #add-new-button v-if="can.create">
        <RouterLink :to="{ name: 'dashboard.hero-slides.create' }" class="btn btn-primary">
            <PlusIcon class="size-4 mr-2" />
            Add Slide
        </RouterLink>
      </template>

      <template #row="{ row }">
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Image -->
        <td v-if="visibleColumns.image_thumbnail_url || visibleColumns.image_url" class="table-cell">
            <div class="h-12 w-20 rounded-lg border border-muted overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                <img 
                    :src="row.image_thumbnail_url ?? row.image_url ?? defaultSlideImage" 
                    :alt="row.title" 
                    class="h-full w-full object-cover"
                >
                <!-- <ImageIcon v-else class="size-5 text-gray-300 dark:text-gray-600" /> -->
            </div>
        </td>

        <!-- Title -->
        <td v-if="visibleColumns.title" class="table-cell font-medium">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.hero-slides.show', params: { id: row.id } }" 
            class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
          >
            {{ row.title }}
          </RouterLink>
          <span v-else>{{ row.title }}</span>
        </td>

        <!-- Status Badge -->
        <td v-if="visibleColumns.is_active" class="table-cell text-center">
          <span v-if="row.is_active"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
                   bg-emerald-50 text-emerald-700 border border-emerald-200 
                   dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircleIcon class="size-3.5" /> Active
          </span>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full 
                   dark:bg-transparent dark:text-slate-400 dark:border-slate-700">
            <XCircleIcon class="size-3.5" /> Inactive
          </span>
        </td>

        <!-- Order -->
        <td v-if="visibleColumns.order_column" class="table-cell text-center">
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono section-title">
                <ArrowUpDownIcon class="size-3" /> {{ row.order_column }}
            </span>
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'dashboard.hero-slides.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <EditButton 
                v-if="row.can?.update" 
                :to="{ name: 'dashboard.hero-slides.edit', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="row.title"
                delete-url="/dashboard/hero-slides/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="slideColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ImageIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Slides Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              Create your first slide to populate the homepage hero section.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.hero-slides.create' }" class="btn btn-primary">
                <PlusIcon class="size-4 mr-2" />
                Add New Slide
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>