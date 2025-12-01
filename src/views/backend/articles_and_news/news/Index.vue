<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import { 
    NewspaperIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    PlusIcon, 
    ImageIcon,
    MegaphoneIcon 
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { NewsUpdate } from '@/types';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages();

const { can, visibleColumns, refreshData, currentColumns: newsUpdateColumns } = useDataTable<NewsUpdate>({
  apiEndpoint: 'dashboard.news.index',
  columns: [],
  tableName: 'news_updates',
  modelKeyInData: 'paginatedData',
  configKeyInData: 'config',
  initialSort: { key: 'publish_date', direction: 'desc' }
});

provide('refreshData', refreshData);

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<template>
  <div>
    <DataTable>
      <template #title>
        News & Updates
      </template>

      <template #add-new-button v-if="can.create">
        <RouterLink :to="{ name: 'dashboard.news.create' }" class="btn btn-primary">
            <PlusIcon class="size-4 mr-2" />
            Create Post
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
                    :alt="row.title" 
                    class="h-full w-full object-cover"
                >
                <!-- <ImageIcon v-else class="size-5 text-gray-300 dark:text-gray-600" /> -->
            </div>
        </td>

        <!-- Title -->
        <td v-if="visibleColumns.title" class="table-cell font-medium max-w-xs truncate">
          <RouterLink 
            v-if="row.can?.view" 
            :to="{ name: 'dashboard.news.show', params: { id: row.id } }" 
            class="hover:underline"          >
            {{ row.title }}
          </RouterLink>
          <span v-else>{{ row.title }}</span>
        </td>

        <!-- Source Badge -->
        <td v-if="visibleColumns.source" class="table-cell">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              <MegaphoneIcon class="size-3" />
              {{ row.source || 'Internal' }}
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
        
        <!-- Publish Date -->
        <td v-if="visibleColumns.publish_date" class="table-cell text-sm text-muted font-mono">
            {{ formatDate(row.publish_date) }}
        </td>

        <!-- Actions -->
        <td class="table-cell text-right">
          <div class="flex items-center justify-end gap-2">
            <ViewButton 
                v-if="row.can?.view" 
                :to="{ name: 'dashboard.news.show', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <EditButton 
                v-if="row.can?.update" 
                :to="{ name: 'dashboard.news.edit', params: { id: row.id } }" 
                icon-only 
                size="sm" 
            />
            <DeleteModel 
                v-if="row.can?.delete" 
                :item-id="row.id" 
                :item-name="row.title"
                delete-url="/dashboard/news/" 
                icon-only 
                size="sm" 
                @deleted="refreshData" 
            />
          </div>
        </td>
      </template>

      <!-- Empty State -->
      <template #empty-state>
        <td :colspan="newsUpdateColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
          <div class="flex flex-col items-center justify-center text-muted">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <NewspaperIcon class="size-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold section-title mb-1">
              No News Updates Found
            </h3>
            <p class="text-sm mb-6 max-w-xs mx-auto">
              Keep your audience informed by creating your first news post.
            </p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.news.create' }" class="btn btn-primary">
                <PlusIcon class="size-4 mr-2" />
                Create New Post
            </RouterLink>
          </div>
        </td>
      </template>
    </DataTable>
  </div>
</template>