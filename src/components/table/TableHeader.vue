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
    <div class="p-4 border-b border-border-color">
        <div class="flex items-center justify-between pb-3 gap-2">
            <div class="flex flex-1 items-center gap-2">
                <button v-if="refreshData" @click="resetData" class="btn-icon is-square btn-secondary-border" title="Reload Data">
                    <RefreshCwIcon class="size-4" />
                    <span class="sr-only">Reload</span>
                </button>
                <h5 class="font-semibold text-lg text-foreground">
                    <slot name="title">Table Title</slot>
                </h5>
            </div>
            <div class="flex items-center justify-end shrink-0 gap-2 sm:gap-4">
                <slot name="actions-header"></slot>
                <!-- <TableActions /> -->
            </div>
        </div>
        <div class="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
            <div class="flex items-center gap-2 sm:gap-4 w-full lg:w-auto">
                <TableSearch class="flex-grow" />
                <TableFilters v-if="hasFilterableColumns && width >= 768" class="hidden md:block" />
            </div>
            <div class="flex items-center gap-2 sm:gap-4 justify-between w-full lg:w-auto">
                <TableFilters v-if="hasFilterableColumns && width < 768" class="block md:hidden flex-grow md:flex-grow-0" />
                <div class="flex items-center lg:justify-end shrink-0">
                    <slot name="add-new-button"></slot>
                </div>
            </div>
        </div>
    </div>
</template>