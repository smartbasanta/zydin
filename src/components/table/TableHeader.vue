<script setup lang="ts">
    // import TableActions from '@/components/table/TableActions.vue';
    import TableSearch from '@/components/table/TableSearch.vue';
    import TableFilters from '@/components/table/TableFilters.vue';
    import { RefreshCwIcon } from 'lucide-vue-next';
    import { computed, inject, onMounted, onUnmounted, ref, type Ref } from 'vue';
    import type { ColumnDefinition } from '@/types/datatable';
    import router from '@/router';
    const resetFiltersAndSearch = inject<() => void>('resetFiltersAndSearch');

    const refreshData = inject<() => void>('refreshData');
    const columns = inject<Ref<ColumnDefinition<any>[]>>('columns', ref([]));

    defineSlots<{
        'add-new-button': () => any;
        'title': () => any;
        'actions-header': () => any;
    }>();

    const width = ref(window.innerWidth);
    function onResize() { width.value = window.innerWidth; }

    onMounted(() => window.addEventListener('resize', onResize));
    onUnmounted(() => window.removeEventListener('resize', onResize));

    const hasFilterableColumns = computed(() => columns.value.some(col => col.filterable));

    const resetData = () => {
        resetFiltersAndSearch?.();
    }

</script>

<template>
    <div class="p-4 md:px-6 border-b border-muted">
        <!-- Top Row: Title and Global Actions -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <div class="flex items-center gap-2">
                <button v-if="refreshData" @click="resetData" class="btn btn-icon btn-secondary" title="Reload and Reset">
                    <RefreshCwIcon class="size-4" />
                </button>
                <div>
                    <h2 class="text-xl font-bold section-title">
                        <slot name="title">Data Records</slot>
                    </h2>
                     <p class="text-sm text-muted">Manage and review all records.</p>
                </div>
            </div>
            <div class="flex items-center justify-end shrink-0 gap-2">
                <slot name="actions-header"></slot>
                <slot name="add-new-button"></slot>
            </div>
        </div>

        <!-- Bottom Row: Search and Filters -->
        <div class="flex flex-col md:flex-row items-center gap-4">
            <TableSearch class="w-full md:max-w-xs" />
            <TableFilters v-if="hasFilterableColumns" />
        </div>
    </div>
</template>