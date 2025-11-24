<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';

import { 
    BriefcaseIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    PlusIcon,
    MapPinIcon,
    BuildingIcon
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { JobOpening } from '@/types';

const { can, visibleColumns, refreshData, currentColumns: jobOpeningColumns } = useDataTable<JobOpening>({
    apiEndpoint: 'dashboard.jobs.index',
    columns: [],
    tableName: 'job_openings',
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
                Job Openings
            </template>

            <template #add-new-button v-if="can.create">
                <RouterLink :to="{ name: 'dashboard.jobs.create' }" class="btn btn-primary">
                    <PlusIcon class="size-4 mr-2" />
                    Create Job
                </RouterLink>
            </template>

            <template #row="{ row }">
                <!-- ID -->
                <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
                    #{{ row.id }}
                </td>

                <!-- Title -->
                <td v-if="visibleColumns.title" class="table-cell font-medium max-w-xs truncate">
                    <RouterLink 
                        v-if="row.can?.view" 
                        :to="{ name: 'dashboard.jobs.show', params: { id: row.id } }"
                        class="text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400"
                    >
                        {{ row.title }}
                    </RouterLink>
                    <span v-else>{{ row.title }}</span>
                </td>

                <!-- Department -->
                <td v-if="visibleColumns.department" class="table-cell text-sm text-muted">
                    <div class="flex items-center gap-1.5">
                        <BuildingIcon class="size-3.5 opacity-70" />
                        {{ row.department }}
                    </div>
                </td>

                <!-- Location -->
                <td v-if="visibleColumns.location" class="table-cell text-sm text-muted">
                    <div class="flex items-center gap-1.5">
                        <MapPinIcon class="size-3.5 opacity-70" />
                        {{ row.location || 'Remote' }}
                    </div>
                </td>

                <!-- Job Type Badge -->
                <td v-if="visibleColumns.type" class="table-cell">
                    <span 
                        class="inline-flex px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border"
                        :class="{
                            // Full-time: Blue
                            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': row.type === 'Full-time',
                            
                            // Internship: Purple
                            'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20': row.type === 'Internship',
                            
                            // Part-time: Green
                            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': row.type === 'Part-time',
                            
                            // Contract: Amber/Yellow
                            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20': row.type === 'Contract'
                        }"
                    >
                        {{ row.type }}
                    </span>
                </td>

                <!-- Active Status Badge -->
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

                <!-- Actions -->
                <td class="table-cell text-right">
                    <div class="flex items-center justify-end gap-2">
                        <ViewButton 
                            v-if="row.can?.view" 
                            :to="{ name: 'dashboard.jobs.show', params: { id: row.id } }" 
                            icon-only 
                            size="sm" 
                        />
                        <EditButton 
                            v-if="row.can?.update" 
                            :to="{ name: 'dashboard.jobs.edit', params: { id: row.id } }" 
                            icon-only 
                            size="sm" 
                        />
                        <DeleteModel 
                            v-if="row.can?.delete" 
                            :item-id="row.id" 
                            :item-name="row.title"
                            delete-url="/dashboard/jobs/" 
                            icon-only 
                            size="sm" 
                            @deleted="refreshData" 
                        />
                    </div>
                </td>
            </template>

            <!-- Empty State -->
            <template #empty-state>
                <td :colspan="jobOpeningColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
                    <div class="flex flex-col items-center justify-center text-muted">
                        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <BriefcaseIcon class="size-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-bold section-title mb-1">
                            No Job Openings Found
                        </h3>
                        <p class="text-sm mb-6 max-w-xs mx-auto">
                            Start hiring by creating your first job opening.
                        </p>
                        <RouterLink v-if="can.create" :to="{ name: 'dashboard.jobs.create' }" class="btn btn-primary">
                            <PlusIcon class="size-4 mr-2" />
                            Create Job Opening
                        </RouterLink>
                    </div>
                </td>
            </template>
        </DataTable>
    </div>
</template>