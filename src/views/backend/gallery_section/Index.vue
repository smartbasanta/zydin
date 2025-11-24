<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import { 
    GalleryHorizontal, 
    ImageIcon, 
    PlusIcon, 
    ArrowUpDownIcon,
    LayersIcon 
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { GalleryImage } from '@/types';

const { can, visibleColumns, refreshData, currentColumns: galleryColumns } = useDataTable<GalleryImage>({
  apiEndpoint: 'dashboard.gallery.index',
  columns: [],
  tableName: 'gallery_images',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'order_column', direction: 'asc' }
});

provide('refreshData', refreshData);

const formatGroup = (group: string) => {
    return group.replace(/_/g, ' ');
}
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        Gallery Management
      </template>

      <template #add-new-button v-if="can.create">
        <RouterLink :to="{ name: 'dashboard.gallery.create' }" class="btn btn-primary">
            <PlusIcon class="size-4 mr-2" />
            Add Image
        </RouterLink>
      </template>

      <template #row="{ row }">
        <!-- ID -->
        <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
          #{{ row.id }}
        </td>

        <!-- Thumbnail -->
        <td v-if="visibleColumns.image_thumbnail_url" class="table-cell">
            <div class="h-12 w-20 rounded-lg border border-muted overflow-hidden flex items-center justify-center">
                <img 
                    v-if="row.image_thumbnail_url || row.image_url" 
                    :src="row.image_thumbnail_url ?? row.image_url" 
                    :alt="row.caption || 'Gallery image'" 
                    class="h-full w-full object-cover"
                >
                <ImageIcon v-else class="size-5 text-gray-300 dark:text-gray-600" />
            </div>
        </td>

        <!-- Caption -->
        <td v-if="visibleColumns.caption" class="table-cell font-medium max-w-sm truncate">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.gallery.show', params: { id: row.id } }" 
            class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
          >
            {{ row.caption || '(No Caption)' }}
          </RouterLink>
          <span v-else>{{ row.caption || '(No Caption)' }}</span>
        </td>

        <!-- Gallery Group Badge -->
        <td v-if="visibleColumns.gallery_group" class="table-cell">
    <span 
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border"
        :class="{
            // Blue: Company Culture
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': row.gallery_group === 'company_culture',
            
            // Purple: Employee Life
            'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20': row.gallery_group === 'employee_life',
            
            // Emerald: CSR (Corporate Social Responsibility) - usually the 3rd category
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': row.gallery_group === 'corporate_social_responsibility',

            // Slate/Gray: Fallback
            'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700': !['company_culture', 'employee_life', 'corporate_social_responsibility'].includes(row.gallery_group)
        }"
    >
        <LayersIcon class="size-3 opacity-70" />
        {{ formatGroup(row.gallery_group) }}
    </span>
</td>

        <!-- Order -->
        <td v-if="visibleColumns.order_column" class="table-cell text-center">
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-mono text-muted">
                <ArrowUpDownIcon class="size-3" /> {{ row.order_column }}
            </span>
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'dashboard.gallery.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <EditButton 
                v-if="row.can?.update" 
                :to="{ name: 'dashboard.gallery.edit', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="row.caption || `Image #${row.id}`"
                delete-url="/dashboard/gallery/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="galleryColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <GalleryHorizontal class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No Gallery Images Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              Start building your visual narrative by adding the first image.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.gallery.create' }" class="btn btn-primary">
                <PlusIcon class="size-4 mr-2" />
                Add New Image
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>