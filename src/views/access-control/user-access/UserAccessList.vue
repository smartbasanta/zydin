<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import type { ColumnDefinition } from '@/types/datatable';
import { 
    UserCogIcon, 
    ShieldAlertIcon, 
    UserIcon,
    CalendarIcon
} from 'lucide-vue-next';

// Use universal buttons
import { EditButton } from '@/components/button';

import type { User } from '@/types/auth';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages();

const userAccessColumns: ColumnDefinition<User>[] = [
    { key: 'id', name: 'ID', sortable: true, visible: true, searchable: true, align: 'center' },
    { key: 'username', name: 'User', sortable: true, visible: true, searchable: true },
    { key: 'created_at', name: 'Joined', sortable: true, visible: true },
    { key: 'actions', name: 'Actions', sortable: false, visible: true, isAction: true, align: 'right' },
];

const { can, visibleColumns, refreshData } = useDataTable<User>({
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
    <div>
        <DataTable>
            <template #title>
                User Access Management
            </template>

            <template #row="{ row }">
                <!-- ID -->
                <td v-if="visibleColumns.id" class="table-cell text-muted font-mono text-xs">
                    #{{ row.id }}
                </td>

                <!-- User Info -->
                <td v-if="visibleColumns.username" class="table-cell">
                    <div class="flex items-center gap-3">
                        <!-- Avatar -->
                        <div class="h-10 w-10 rounded-full border border-muted overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <img 
                                :src="row.avatar_url ?? row.avatar_thumbnail_url ?? defaultProfileImage" 
                                :alt="row.username" 
                                class="h-full w-full object-cover"
                            >
                        </div>
                        
                        <!-- Details -->
                        <div class="flex flex-col">
                            <div class="flex items-center gap-2">
                                <span class="font-semibold section-title text-sm">{{ row.username }}</span>
                                
                                <!-- Super User Badge -->
                                <span v-if="row.is_super_user" 
                                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800" 
                                    title="Super User / Root Access">
                                    <ShieldAlertIcon class="size-3" /> Root
                                </span>
                            </div>
                            <span class="text-xs text-muted">{{ row.email }}</span>
                        </div>
                    </div>
                </td>

                <!-- Joined At -->
                <td v-if="visibleColumns.created_at" class="table-cell">
                    <div class="flex items-center gap-1.5 text-sm text-muted">
                        <CalendarIcon class="size-3.5 opacity-70" />
                        <span class="font-mono">{{ formatDate(row.created_at) }}</span>
                    </div>
                </td>

                <!-- Actions -->
                <td class="table-cell text-right">
                    <div class="flex items-center justify-end gap-2">
                        <EditButton 
                            v-if="row.can_view_access"
                            :to="{ name: 'access-control.user-access.edit', params: { id: row.id } }" 
                            label="Manage Access"
                            size="sm"
                        />
                        <span v-else class="text-xs text-muted italic px-2">
                            Restricted
                        </span>
                    </div>
                </td>
            </template>

            <!-- Empty State -->
            <template #empty-state>
                <td :colspan="100" class="text-center py-12">
                    <div class="flex flex-col items-center justify-center text-muted">
                        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <UserCogIcon class="size-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-bold section-title mb-1">
                            No Users Found
                        </h3>
                        <p class="text-sm mb-6 max-w-sm mx-auto">
                            There are no users matching your current filters available for management.
                        </p>
                    </div>
                </td>
            </template>
        </DataTable>
    </div>
</template>