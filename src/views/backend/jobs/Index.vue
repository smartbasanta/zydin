<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

import { BriefcaseIcon, CheckCircleIcon, XCircleIcon } from 'lucide-vue-next';

import {
    TableAddButton,
    TableDeleteButton,
    TableEditButton,
    TableViewButton
} from '@/components/table/button';

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
                <TableAddButton :to="{ name: 'dashboard.jobs.create' }" title="Create Job Opening" />
            </template>

            <template #row="{ row }">
                <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">
                    {{ row.id }}
                </td>
                <td v-if="visibleColumns.title" class="px-4 py-2.5 font-medium">
                    <RouterLink v-if="row.can?.view" :to="{ name: 'dashboard.jobs.show', params: { id: row.id } }"
                        class="link">
                        {{ row.title }}
                    </RouterLink>
                    <span v-else>{{ row.title }}</span>
                </td>
                <td v-if="visibleColumns.department" class="px-4 py-2.5">
                    {{ row.department }}
                </td>
                <td v-if="visibleColumns.location" class="px-4 py-2.5">
                    {{ row.location || 'N/A' }}
                </td>
                <td v-if="visibleColumns.type" class="px-4 py-2.5">
                    <span class="px-2 py-1 text-xs font-semibold uppercase rounded-full" :class="{
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': row.type === 'Full-time',
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': row.type === 'Internship',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': row.type === 'Part-time',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': row.type === 'Contract'
                    }">
                        {{ row.type }}
                    </span>
                </td>
                <td v-if="visibleColumns.is_active" class="px-4 py-2.5 text-center">
                    <span v-if="row.is_active"
                        class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-500">
                        <CheckCircleIcon class="size-3.5" /> Active
                    </span>
                    <span v-else
                        class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
                        <XCircleIcon class="size-3.5" /> Inactive
                    </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-1">
                        <TableViewButton v-if="row.can?.view"
                            :to="{ name: 'dashboard.jobs.show', params: { id: row.id } }" />
                        <TableEditButton v-if="row.can?.update"
                            :to="{ name: 'dashboard.jobs.edit', params: { id: row.id } }" />
                        <TableDeleteButton v-if="row.can?.delete" :item-id="row.id" :item-name="row.title"
                            delete-url="/dashboard/jobs/" @deleted="refreshData" />
                    </div>
                </td>
            </template>

            <template #empty-state>
                <td :colspan="jobOpeningColumns.filter(c => c.visible !== false).length + 1"
                    class="text-center py-10 text-muted-foreground">
                    <div class="flex flex-col items-center">
                        <BriefcaseIcon class="size-16 text-slate-400 mb-4" />
                        <h3 class="text-xl font-semibold mb-1">
                            No Job Openings Found
                        </h3>
                        <p class="text-sm">
                            Create your first job opening to attract candidates.
                        </p>
                        <TableAddButton v-if="can.create" :to="{ name: 'dashboard.jobs.create' }"
                            title="Create Job Opening" class="mt-4" />
                    </div>
                </td>
            </template>
        </DataTable>
        <ConfirmModal />
    </div>
</template>