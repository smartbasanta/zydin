<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import type { ColumnDefinition } from '@/types/datatable';
import { ShieldUserIcon, UserCogIcon } from 'lucide-vue-next';
import { TableViewButton } from '@/components/table/button';
import type { User } from '@/types/auth';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
const userAccessColumns: ColumnDefinition<User>[] = [
    { key: 'id', name: 'ID', sortable: true, visible: true, searchable: true, align: 'center' },
    { key: 'username', name: 'User', sortable: true, visible: true, searchable: true },
    { key: 'created_at', name: 'Joined', sortable: true, visible: true },
    { key: 'actions', name: 'Actions', sortable: false, visible: true, isAction: true, align: 'right' },
];

const { dataToDisplay, can, visibleColumns, refreshData } = useDataTable<User>({
    apiEndpoint: 'access-control.user-access.index',
    columns: userAccessColumns,
    tableName: 'user_access',
    modelKeyInData: 'model',
    configKeyInData: 'config',
    initialSort: { key: 'created_at', direction: 'desc' },
});

provide('refreshData', refreshData);

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8 font-poppins">
        <DataTable data-table-class="!border-none !rounded-none !bg-transparent">
            <template #title>
                <h2 class="text-2xl font-semibold text-orange-700 dark:text-orange-300">
                    User Access Management
                </h2>
            </template>

            <!-- This table generally doesn't have an "Add New" button -->

            <template #row="{ row }"
                class="border-b border-orange-500/10 bg-white dark:bg-gray-800/50 transition-all duration-300 group relative"
                :class="[
                    row.can_view_access ? 'hover:border-l-4 hover:border-l-orange-500 hover:shadow-[0_0_10px_rgba(255,167,38,0.3)] hover:bg-orange-50/50 dark:hover:bg-orange-900/20' : 'opacity-50 cursor-not-allowed',
                    row.is_super_user ? 'animate-pulse border-l-4 border-l-red-500/50 bg-red-500/10 dark:bg-red-900/20' : ''
                ]">
                <!-- ID -->
                <td v-if="visibleColumns.id" class="px-4 py-2.5 text-center text-muted">
                    {{ row.id }}
                </td>

                <!-- User Info -->
                <td v-if="visibleColumns.username" class="px-4 py-2.5">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex-shrink-0 grid place-items-center size-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-1100 dark:to-amber-1100 font-bold">
                            <!-- {{ row.username.substring(0, 2).toUpperCase() }} -->
                            <img :src="row.avatar_url ?? row.avatar_thumbnail_url ?? defaultProfileImage" />
                        </div>
                        <div>
                            <div class="font-medium text-gray-900 dark:text-gray-100">{{ row.username }}</div>
                            <div class="text-xs text-muted">{{ row.email }}</div>
                        </div>
                    </div>
                </td>

                <!-- Joined At -->
                <td v-if="visibleColumns.created_at" class="px-4 py-2.5 text-muted whitespace-nowrap">
                    {{ formatDate(row.created_at) }}
                </td>

                <!-- Actions -->
                <td v-if="visibleColumns.actions" class="px-4 py-2.5 text-right">
                    <TableViewButton v-if="row.can_view_access"
                        :to="{ name: 'access-control.user-access.edit', params: { id: row.id } }" title="Manage Access">
                        <UserCogIcon class="size-4" />
                    </TableViewButton>
                    <span v-else class="text-xs text-muted italic">No actions available</span>
                </td>
            </template>

            <template #empty-state>
                <td :colspan="100" class="text-center py-16 text-muted">
                    <div class="flex flex-col items-center">
                        <UserCogIcon class="size-16 text-gray-400 dark:text-gray-700 mb-4" />
                        <h3 class="text-xl font-semibold mb-1 text-gray-700 dark:text-gray-300">
                            No Users to Manage
                        </h3>
                        <p class="text-sm">
                            There are no users that match your current filters, or none that you have permission to
                            manage.
                        </p>
                    </div>
                </td>
            </template>
        </DataTable>
    </div>
</template>