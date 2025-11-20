<script setup lang="ts">
    import { provide } from 'vue';
    import useDataTable from '@/composables/useDatatable';
    import DataTable from '@/components/table/DataTable.vue';
    import type { ColumnDefinition } from '@/types/datatable';
    
    import { 
        CheckCircleIcon, 
        ShieldCheckIcon, 
        XCircleIcon 
    } from 'lucide-vue-next';

    import { 
        TableAddButton, 
        TableDeleteButton, 
        TableEditButton, 
        TableViewButton 
    } from '@/components/table/button';

    import type { Role } from '@/types/access-control';   
  
    import ConfirmModal from '@/components/modal/ConfirmModal.vue';

    const roleColumns: ColumnDefinition<Role>[] = [];

    const { can, visibleColumns, refreshData } = useDataTable<Role>({
        apiEndpoint: 'access-control.roles.index',
        columns: roleColumns,
        tableName: 'roles',
        modelKeyInData: 'paginatedData',
        configKeyInData: 'config', 
        initialSort: { key: 'level', direction: 'desc' }
    });

    provide('refreshData', refreshData);

</script>

<template>
    <div>
        <DataTable data-table-class="!border-none !rounded-none">
            <template #title>
                Role Management
            </template>

            <template #add-new-button v-if="can.create">
                <TableAddButton :to="{ name: 'access-control.roles.create' }" title="Create New Role" />
            </template>
            
            <template #row="{ row, columns }">
                <td v-if="visibleColumns.id" class="px-4 py-2.5 text-muted">
                    {{ row.id }}
                </td>

                <td v-if="visibleColumns.name" class="px-4 py-2.5">
                    <div class="group">
                        <div>
                            <RouterLink v-if="row.can_view" :to="{name: 'access-control.roles.show', params: {id: row.id}}" class="link">
                                {{ row.name }}
                            </RouterLink>
                            <span v-else class="font-medium">{{ row.name }}</span>
                            <div>
                                
                            </div>
                        </div>
                        <div class="text-xs text-muted font-mono">({{ row.key }})</div>
                    </div>
                </td>

                <td v-if="visibleColumns.description" class="px-4 py-2.5">
                    <div>
                        <div>
                            {{ row.description || 'No description provided.' }}
                        </div>
                        <div class="text-muted">
                            Total Users: {{ row.users_count }}
                        </div>
                    </div>
                        
                </td>

                <td>
                    <div>
                        <div class="flex items-center gap-2">
                            <span v-if="row.color_light" class="h-5 w-5 rounded border border-muted" :style="{ backgroundColor: row.color_light }"></span>
                            <span>{{ row.color_light || 'Not set' }}</span>
                        </div>
                    </div>
                    <div class="mt-1">
                         <div class="flex items-center gap-2">
                            <span v-if="row.color_dark" class="h-5 w-5 rounded border border-nuted" :style="{ backgroundColor: row.color_dark }"></span>
                            <span>{{ row.color_dark || 'Not set' }}</span>
                        </div>
                    </div>
                </td>

                <td v-if="visibleColumns.level" class="px-4 py-2.5 text-center">
                    <span class="tabular-nums">{{ row.level }}</span>
                </td>

                <td v-if="visibleColumns.is_default" class="px-4 py-2.5 text-center">
                    <span v-if="row.is_default" class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-850 dark:bg-green-700/30 dark:text-green-700">
                        <CheckCircleIcon class="size-3.5" /> Yes
                    </span>
                    <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
                        <XCircleIcon class="size-3.5" /> No
                    </span>
                </td>
                
                <td class="px-4 py-3 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-1">
                        <TableViewButton v-if="row.can.view" :to="{ name: 'access-control.roles.show', params: { id: row.id } }" />
                        <TableEditButton v-if="row.can.update && !row.is_system_role" :to="{ name: 'access-control.roles.edit', params: { id: row.id } }" />
                        <TableDeleteButton
                        v-if="row.can.delete && !row.is_system_role && (row.users_count || 0) === 0"
                            :item-id="row.id"
                            :item-name="row.name"
                            delete-url="/access-control/roles/" 
                            @deleted="refreshData"
                        />
                    </div>
                </td>
            </template>
            
            <template #empty-state>
                 <td :colspan="roleColumns.filter(c => c.visible !== false).length + 1" class="text-center py-10 text-muted-foreground">
                    <div class="flex flex-col items-center">
                        <ShieldCheckIcon class="size-16 text-slate-400 mb-4" />
                        <h3 class="text-xl font-semibold mb-1">
                            No Roles Found
                        </h3>
                        <p class="text-sm">
                            There are no roles matching your current filters, or no roles have been created yet.
                        </p>
                        <TableAddButton v-if="can.create" :to="{ name: 'access-control.roles.create' }" title="Create New Role" class="mt-4" />
                    </div>
                </td>
            </template>

        </DataTable>
        <ConfirmModal />
    </div>
</template>