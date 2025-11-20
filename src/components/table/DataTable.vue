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
    <LoadingState v-if="isLoading" />
    <div v-else>
        <slot name="above-table"></slot>
        <div class="data-table" :class="dataTableClass">
            <TableHeader>
                <template #add-new-button>
                    <slot name="add-new-button"></slot>
                </template>
                <template #title>
                    <slot name="title"></slot>
                </template>
                <template #actions-header>
                    <slot name="actions-header"></slot>
                </template>
            </TableHeader>

            <div v-if="isLoading" class="p-6 text-center text-muted-foreground">
                <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2">Loading data...</p>
            </div>
            <div v-else-if="apiError" class="p-6 text-center text-red-500">
                <p>Error loading data: {{ apiError.message || 'Unknown error' }}</p>
                <!-- TODO :: retry button here -->
            </div>
            <TableBody v-else>
                <template #row="{ row, columns }">
                    <slot name="row" :row="row" :columns="columns"></slot>
                </template>
                <template #empty-state>
                    <slot name="empty-state">
                        <td :colspan="100" class="text-center py-10 text-muted-foreground"> 
                            No data available.
                        </td>
                    </slot>
                </template>
            </TableBody>
            <TableFooter v-if="!isLoading && !apiError && dataToDisplay.length > 0" />
        </div>
        <slot name="below-table"></slot>
    </div>
</template>