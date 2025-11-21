<script setup lang="ts">
    import TableHeader from '@/components/table/TableHeader.vue';
    import TableBody from '@/components/table/TableBody.vue';
    import TableFooter from '@/components/table/TableFooter.vue';
    import { type Ref, inject, ref } from 'vue';
    import LoadingState from '../card/LoadingState.vue';

    defineSlots<{
        'add-new-button': () => any;
        'title': () => any;
        'row': (props: { row: any, columns: any[] }) => any;
        'empty-state': () => any;
        'actions-header': () => any;
        'above-table': () => any;
        'below-table': () => any;
    }>();

    const props = withDefaults(defineProps<{
        dataTableClass?: string
    }>(), {
        dataTableClass: ''
    })

    const isLoading = inject<Ref<boolean>>('isLoading', ref(false));
    const apiError = inject<Ref<any>>('apiError', ref(null));
    const dataToDisplay = inject<Ref<any[]>>('dataToDisplay', ref([]));

</script>

<template>
    <LoadingState v-if="isLoading" message="Loading Data..." />
    <div v-else>
        <slot name="above-table"></slot>

        <!-- The new data table shell provides a consistent, theme-aware container -->
        <div class="data-table-shell" :class="dataTableClass">
            <TableHeader>
                <template #add-new-button><slot name="add-new-button"></slot></template>
                <template #title><slot name="title"></slot></template>
                <template #actions-header><slot name="actions-header"></slot></template>
            </TableHeader>

            <div v-if="apiError" class="p-8 text-center text-red-500">
                <p>Error loading data: {{ apiError.message || 'Unknown error' }}</p>
            </div>
            
            <TableBody v-else>
                <template #row="{ row, columns }">
                    <slot name="row" :row="row" :columns="columns"></slot>
                </template>
                <template #empty-state>
                    <slot name="empty-state">
                        <!-- A much-improved, professional empty state -->
                        <td :colspan="100" class="text-center p-16"> 
                            <FileX2Icon class="mx-auto h-12 w-12 text-gray-400" />
                            <h3 class="mt-2 text-sm font-semibold section-title">No data available</h3>
                            <p class="mt-1 text-sm text-muted">There are no records to display at this time.</p>
                        </td>
                    </slot>
                </template>
            </TableBody>
            
            <TableFooter v-if="!apiError && dataToDisplay.length > 0" />
        </div>
        
        <slot name="below-table"></slot>
    </div>
</template>