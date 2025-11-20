<script setup lang="ts">
    import { inject, computed, ref, type Ref } from 'vue';
    import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
    import Dropdown from '@/components/menu/Dropdown.vue'; 
    import type { ColumnDefinition } from '@/types/datatable';

    const dataToDisplay = inject<Ref<any[]>>('dataToDisplay', ref([]));
    const columns = inject<Ref<ColumnDefinition[]>>('columns', ref([]));
    const visibleColumns = inject<Ref<Record<string, boolean>>>('visibleColumns', ref({}));
    const performSort = inject<(columnKey: string, direction?: 'asc' | 'desc' | null) => void>('performSort', () => {});

    const currentSort = inject<Ref<string[]>>('currentSort', ref([]));
    const currentDirection = inject<Ref<string[]>>('currentDirection', ref([]));

    const selectedRows = inject<Ref<Set<number | string>>>('selectedRows', ref(new Set()));
    const toggleRowSelection = inject<(rowIdOrAll: (number | string) | 'all') => void>('toggleRowSelection', () => {});
    const isAllSelected = inject<Ref<boolean>>('isAllSelected', ref(false));

    const displayedColumns = computed(
        () => columns.value.filter(col => visibleColumns.value[col.key] && !col.isAction)
    );
    const actionColumn = computed(
        () => columns.value.find(col => col.isAction && visibleColumns.value[col.key])
    );

    // This is correct for the <Dropdown> component usage
    const handleSort = (columnKey: string, direction: 'asc' | 'desc' | null) => {
        performSort(columnKey, direction);
        // The 'close(true)' will be called from the #menu slot prop
    };

    const isRowSelected = (row: any): boolean => selectedRows.value.has(row.id);

    const getColumnSortDirection = (columnKey: string): 'asc' | 'desc' | undefined => {
        const index = currentSort.value.indexOf(columnKey);
        if (index !== -1) {
            return currentDirection.value[index] as 'asc' | 'desc';
        }
        return undefined;
    };

    const getSortOrderIndicator = (columnKey: string): string => {
        const index = currentSort.value.indexOf(columnKey);
        if (index !== -1 && currentSort.value.length > 1) {
            return `(${index + 1})`;
        }
        return '';
    }
</script>

<template>
    <div class="overflow-x-auto">
        <table class="w-full min-w-[600px] text-sm">
            <thead class="border-b border-secondary">
                <tr class="text-muted">
                    <th class="w-12 px-4 py-3 text-left font-medium">
                        <input
                            class="checkbox primary"
                            type="checkbox"
                            :checked="isAllSelected"
                            @change="toggleRowSelection('all')"
                            :disabled="!dataToDisplay || dataToDisplay.length === 0"
                        />
                    </th>
                    <th
                        v-for="col in displayedColumns"
                        :key="col.key"
                        class="px-4 py-3 text-left font-medium whitespace-nowrap"
                        :class="[
                            { 'text-right': col.align === 'right', 'text-center': col.align === 'center' },
                            col.headerClass
                        ]"
                    >
                        <Dropdown v-if="col.sortable">
                            <template #trigger="{ toggle }">
                                <button
                                    @click="toggle()"
                                    class="btn btn-link text-sm font-normal !no-underline"
                                    :class="{ 'is-active': currentSort.includes(col.key) }"
                                >
                                    <span>{{ col.name }}</span>
                                    <ArrowUpIcon v-if="getColumnSortDirection(col.key) === 'asc'" class="size-3.5" />
                                    <ArrowDownIcon v-else-if="getColumnSortDirection(col.key) === 'desc'" class="size-3.5" />
                                    <ChevronsUpDownIcon v-else class="size-3.5 opacity-50" />
                                    <span v-if="getSortOrderIndicator(col.key)" class="text-xs opacity-70">
                                        {{ getSortOrderIndicator(col.key) }}
                                    </span>
                                </button>
                            </template>
                            <template #menu="{ close }">
                                <div class="dropdown-content py-1"> 
                                    <button
                                        data-dropdown-item 
                                        @click="performSort(col.key, 'asc'); close(true);"
                                        class="menu-dropdown-item"
                                        :class="{ 'active': getColumnSortDirection(col.key) === 'asc' }"
                                    >
                                        <ArrowUpIcon class="size-4 mr-2" /> Ascending
                                    </button>
                                    <button
                                        data-dropdown-item
                                        @click="performSort(col.key, 'desc'); close(true);"
                                        class="menu-dropdown-item"
                                        :class="{ 'active': getColumnSortDirection(col.key) === 'desc' }"
                                    >
                                        <ArrowDownIcon class="size-4 mr-2" /> Descending
                                    </button>
                                    <div v-if="getColumnSortDirection(col.key)" class="h-px bg-border-color my-1 mx-2"></div>
                                    <button
                                        v-if="getColumnSortDirection(col.key)"
                                        data-dropdown-item
                                        @click="performSort(col.key, null); close(true);"
                                        class="menu-dropdown-item"
                                    >
                                        <ChevronsUpDownIcon class="size-4 mr-2 opacity-50" /> Reset Sort
                                    </button>
                                </div>
                            </template>
                        </Dropdown>
                        <span v-else>{{ col.name }}</span>
                    </th>
                    <th v-if="actionColumn"
                        class="px-4 py-3 text-left font-medium whitespace-nowrap"
                        :class="[
                            { 'text-right': actionColumn.align === 'right', 'text-center': actionColumn.align === 'center' },
                            actionColumn.headerClass
                        ]"
                    >
                        {{ actionColumn.name }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border-color">
                <template v-if="dataToDisplay && dataToDisplay.length > 0">
                    <tr
                        v-for="row in dataToDisplay"
                        :key="row.id"
                        class="hover:bg-muted/10 transition-colors"
                        :class="{ 'bg-primary/5 font-medium': isRowSelected(row) }"
                    >
                        <td class="px-4 py-2.5">
                            <input
                                class="checkbox primary"
                                type="checkbox"
                                :checked="isRowSelected(row)"
                                @change="toggleRowSelection(row.id)"
                            />
                        </td>
                        <slot name="row" :row="row" :columns="displayedColumns"></slot>
                    </tr>
                </template>
                <tr v-else>
                     <slot name="empty-state"></slot>
                </tr>
            </tbody>
        </table>
    </div>
</template>