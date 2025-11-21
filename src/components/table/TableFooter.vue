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
    <!-- The root element is now styled as a proper footer, matching the header's design -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 border-t border-muted">
        
        <!-- Left Side: Record count and rows-per-page selector -->
        <div class="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted">
            <div v-if="rowsPerPageOptions.length > 0 && updateRowsPerPage" class="flex items-center gap-2">
                <label for="rows-per-page-select" class="whitespace-nowrap">Rows:</label>
                <select
                    id="rows-per-page-select"
                    v-model="selectedRppForInput"
                    @change="onRowsPerPageChange"
                    class="input !py-1 !px-2 !w-20 text-sm"
                >
                    <option v-for="option in rowsPerPageOptions" :key="option.value" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>

            <!-- Record count text -->
            <span v-if="isPaginated && paginatedModel && totalRecords > 0" class="whitespace-nowrap">
                Showing
                <strong class="font-semibold section-title">{{ fromRecords }}</strong>-<strong class="font-semibold section-title">{{ toRecords }}</strong>
                of
                <strong class="font-semibold section-title">{{ totalRecords }}</strong>
            </span>
            <span v-else-if="!isPaginated && dataToDisplay.length > 0">
                <strong class="font-semibold section-title">{{ dataToDisplay.length }}</strong> 
                record<span v-if="dataToDisplay.length !== 1">s</span> displayed
            </span>
        </div>

        <!-- Right Side: Pagination controls -->
        <TablePagination v-if="isPaginated && totalRecords > 0 && lastPage > 1" />
    </div>
</template>

<style scoped>
/* No scoped styles are needed as all styling comes from global, theme-aware classes. */
@reference "@/assets/css/main.css";

</style>