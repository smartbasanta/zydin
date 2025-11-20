<script setup lang="ts">
    import { inject, watch, computed, type Ref, ref } from 'vue';
    import TablePagination from '@/components/table/TablePagination.vue';
    import type { PaginatedResponse } from '@/types/paginated-response';
    import type { RowsPerPageOption } from '@/types/datatable';

    const paginatedModel = inject<Ref<PaginatedResponse<any> | null>>('paginatedModel', ref(null));

    const currentRowsPerPage = inject<Ref<number>>('rowsPerPage', ref(10));
    const updateRowsPerPage = inject<(newRpp: number) => void>('updateRowsPerPage');
    const rowsPerPageOptions = inject<Ref<RowsPerPageOption[]>>('rowsPerPageOptions', ref([]));
    const isPaginated = inject<Ref<boolean>>('isPaginated', ref(false));
    const dataToDisplay = inject<Ref<any[]>>('dataToDisplay', ref([]));

    const totalRecords = computed(() => paginatedModel.value?.total ?? 0);
    const fromRecords = computed(() => paginatedModel.value?.from ?? 0);
    const toRecords = computed(() => paginatedModel.value?.to ?? 0);
    const lastPage = computed(() => paginatedModel.value?.last_page ?? 1);

    const selectedRppForInput = ref(String(currentRowsPerPage.value));

    watch(currentRowsPerPage, (newValue) => {
        selectedRppForInput.value = String(newValue);
    }, { immediate: true });

    function onRowsPerPageChange() {
        const newRpp = parseInt(selectedRppForInput.value, 10);
        if (isNaN(newRpp) || newRpp === currentRowsPerPage.value) return;

        if (updateRowsPerPage) {
            updateRowsPerPage(newRpp);
        }
    }
</script>

<template>
    <div class="flex flex-col sm:flex-row items-center gap-4 justify-between my-4 px-4">
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <!-- isPaginated && :: tara yo rakhesi suppose 200 hane bhane 200 rows napuge samma visible hudaina  -->
            <div v-if="rowsPerPageOptions.length > 0 && updateRowsPerPage" class="flex items-center gap-2">
                <label for="rows-per-page-select" class="whitespace-nowrap">Rows per page:</label>
                <select
                    id="rows-per-page-select"
                    v-model="selectedRppForInput"
                    @change="onRowsPerPageChange"
                    class="input !py-1.5 !px-2 !h-auto text-sm w-20"
                >
                    <option v-for="option in rowsPerPageOptions" :key="option.value" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <span v-if="isPaginated && paginatedModel && totalRecords > 0" class="whitespace-nowrap">
                Showing {{ fromRecords }}-{{ toRecords }} of {{ totalRecords }}
            </span>
            <span v-else-if="!isPaginated && dataToDisplay.length > 0">
                {{ dataToDisplay.length }} record<span v-if="dataToDisplay.length !== 1">s</span> displayed
            </span>
        </div>
        <TablePagination v-if="isPaginated && totalRecords > 0 && lastPage > 1" />
    </div>
</template>