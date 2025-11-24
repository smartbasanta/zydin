<script setup lang="ts">
import { provide } from 'vue';
import useDataTable from '@/composables/useDatatable';
import DataTable from '@/components/table/DataTable.vue';
import { 
    ShieldCheckIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    PlusIcon, 
    UsersIcon, 
    PaletteIcon,
    LockIcon
} from 'lucide-vue-next';

// Use the new universal buttons
import { EditButton } from '@/components/button';
import ViewButton from '@/components/button/ViewButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';

import type { Role } from '@/types/access-control';

const { can, visibleColumns, refreshData, currentColumns: roleColumns } = useDataTable<Role>({
    apiEndpoint: 'access-control.roles.index',
    columns: [],
    tableName: 'roles',
    modelKeyInData: 'paginatedData',
    configKeyInData: 'config',
    initialSort: { key: 'level', direction: 'desc' }
});

provide('refreshData', refreshData);
</script>

<template>
    <div>
        <DataTable>
            <template #title>
                Role Management
            </template>

            <template #add-new-button v-if="can.create">
                <RouterLink :to="{ name: 'access-control.roles.create' }" class="btn btn-primary">
                    <PlusIcon class="size-4 mr-2" />
                    Create Role
                </RouterLink>
            </template>
            
            <template #row="{ row }">
                <!-- ID -->
                <td v-if="visibleColumns.id" class="table-cell section-title font-mono text-xs">
                    #{{ row.id }}
                </td>

                <!-- Name & Key -->
                <td v-if="visibleColumns.name" class="table-cell">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <RouterLink 
                                v-if="row.can?.view" 
                                :to="{name: 'access-control.roles.show', params: {id: row.id}}" 
                                class="font-bold section-title hover:underline"
                            >
                                {{ row.name }}
                            </RouterLink>
                            <span v-else class="font-bold section-title">{{ row.name }}</span>
                            
                            <span v-if="row.is_system_role" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase text-amber-700 border border-amber-200 dark:text-amber-400 dark:border-amber-800" title="System Role (Protected)">
                                <LockIcon class="size-3 mr-1" /> System
                            </span>
                        </div>
                        <!-- <span class="text-xs font-mono section-title mt-0.5 px-1 rounded w-fit border border-muted">
                            {{ row.key }}
                        </span> -->
                    </div>
                </td>

                <!-- Description & Users -->
                <td v-if="visibleColumns.description" class="table-cell">
                    <div class="flex flex-col gap-1.5">
                        <span class="text-sm section-title line-clamp-1 max-w-xs" :title="row.description">
                            {{ row.description || '-' }}
                        </span>
                        <div class="flex items-center gap-1.5 text-xs font-medium text-secondary-600 dark:text-secondary-400">
                            <UsersIcon class="size-3.5" />
                            {{ row.users_count }} {{ row.users_count === 1 ? 'User' : 'Users' }}
                        </div>
                    </div>
                </td>

                <!-- Theme Colors -->
                <td v-if="visibleColumns.color_light || visibleColumns.color_dark" class="table-cell">
                    <div class="flex flex-col gap-1.5">
                        <div class="flex items-center gap-2 text-xs text-muted">
                            <span 
                                class="size-4 rounded-full border border-muted shadow-sm" 
                                :style="{ backgroundColor: row.color_light || '#ffffff' }"
                            ></span>
                            Light
                        </div>
                        <div class="flex items-center gap-2 text-xs text-muted">
                            <span 
                                class="size-4 rounded-full border border-muted shadow-sm" 
                                :style="{ backgroundColor: row.color_dark || '#1f2937' }"
                            ></span>
                            Dark
                        </div>
                    </div>
                </td>

                <!-- Level -->
                <td v-if="visibleColumns.level" class="table-cell text-center">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-sm border border-muted">
                        {{ row.level }}
                    </span>
                </td>

                <!-- Default Status -->
                <td v-if="visibleColumns.is_default" class="table-cell text-center">
                    <span v-if="row.is_default"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
                               bg-emerald-50 text-emerald-700 border border-emerald-200 
                               dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <CheckCircleIcon class="size-3.5" /> Yes
                    </span>
                    <span v-else
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full 
                               dark:bg-transparent dark:text-slate-400 dark:border-slate-700">
                        <XCircleIcon class="size-3.5" /> No
                    </span>
                </td>
                
                <!-- Actions -->
                <td class="table-cell text-right">
                    <div class="flex items-center justify-end gap-2">
                        <ViewButton 
                            v-if="row.can?.view" 
                            :to="{ name: 'access-control.roles.show', params: { id: row.id } }" 
                            icon-only 
                            size="sm" 
                        />
                        <EditButton 
                            v-if="row.can?.update && !row.is_system_role" 
                            :to="{ name: 'access-control.roles.edit', params: { id: row.id } }" 
                            icon-only 
                            size="sm" 
                        />
                        <DeleteModel 
                            v-if="row.can?.delete && !row.is_system_role && (row.users_count || 0) === 0"
                            :item-id="row.id" 
                            :item-name="row.name"
                            delete-url="/access-control/roles/" 
                            icon-only 
                            size="sm" 
                            @deleted="refreshData" 
                        />
                        <!-- Disabled Delete for System/In-use Roles -->
                        <button 
                            v-else-if="row.can?.delete" 
                            disabled 
                            class="p-2 rounded-lg border border-transparent text-gray-300 dark:text-gray-700 cursor-not-allowed" 
                            :title="row.is_system_role ? 'System roles cannot be deleted' : 'Cannot delete role with assigned users'"
                        >
                            <XCircleIcon class="size-4" />
                        </button>
                    </div>
                </td>
            </template>
            
            <!-- Empty State -->
            <template #empty-state>
                 <td :colspan="roleColumns.filter(c => c.visible !== false).length + 1" class="text-center py-12">
                    <div class="flex flex-col items-center justify-center text-muted">
                        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheckIcon class="size-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-bold section-title mb-1">
                            No Roles Found
                        </h3>
                        <p class="text-sm mb-6 max-w-xs mx-auto">
                            Start by creating a new role to define user access levels.
                        </p>
                        <RouterLink v-if="can.create" :to="{ name: 'access-control.roles.create' }" class="btn btn-primary">
                            <PlusIcon class="size-4 mr-2" />
                            Create New Role
                        </RouterLink>
                    </div>
                </td>
            </template>

        </DataTable>
    </div>
</template>