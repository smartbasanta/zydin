import { ref, computed, watch, provide, type Ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiService } from '@/services/api.service';
import type { PaginatedResponse, PaginationLink } from '@/types/paginated-response';
import type { UseDataTableConfig, ColumnDefinition, RowsPerPageOption, DataTableApiResponse } from '@/types/datatable';
import type { ApiResponse } from '@/types/api'; // Your generic API response type
import type { ModelCan } from '@/types/abilities';

export default function useDataTable<T extends { id: number | string }>(config: UseDataTableConfig<T>) {
    const {
        apiEndpoint,
        columns: propColumns,
        initialFilters: configInitialFilters = {},
        tableName,
        initialRowsPerPage: configInitialRpp,
        rowsPerPageOptions: configRppOptions,
        isSimplePagination = false,
        modelKeyInData = 'paginatedData',
        configKeyInData = 'config',
        initialSort: configInitialSort,
    } = config;

    const router = useRouter();
    const route = useRoute();

    // --- Core State ---
    const can = ref<ModelCan>({});
    const isLoading = ref<boolean>(true);
    const apiError = ref<any>(null);
    
    // Holds the raw paginated data from API (e.g., response.data.paginatedData)
    const paginatedModel = ref<PaginatedResponse<T> | null>(null); 
    
    const localSearchTerm = ref<string>(''); // For live local filtering input
    const backendSearchTerm = ref<string>(''); // Term used for the last backend search

    const currentColumns = ref<ColumnDefinition<T>[]>(propColumns) as Ref<ColumnDefinition<T>[]>;
    const visibleColumns = ref<Record<string, boolean>>({});
    currentColumns.value.forEach((col) => {
        visibleColumns.value[col.key] = col.visible ?? true;
    });

    const selectedRows = ref<Set<number | string>>(new Set());
    
    const defaultSortKey = configInitialSort?.key || currentColumns.value.find(c => c.sortable)?.key || 'id';
    const defaultSortDir = configInitialSort?.direction || 'asc';

    const currentSort = ref<string[]>([defaultSortKey]);
    const currentDirection = ref<string[]>([defaultSortDir]);
    
    const filters = ref<Record<string, any>>({}); // For column-specific filters

    const defaultRppOptions: RowsPerPageOption[] = [
        { value: '5', text: '5' }, { value: '10', text: '10' }, { value: '15', text: '15' },
        { value: '20', text: '20' }, { value: '25', text: '25' }, { value: '50', text: '50' }, 
        { value: '100', text: '100' }
    ];
    const rppOptions = ref<RowsPerPageOption[]>(configRppOptions || defaultRppOptions);
    const currentRowsPerPage = ref<number>(configInitialRpp || parseInt(defaultRppOptions[1]?.value || '10', 10));

    const currentPage = ref<number>(1);

    // --- Computed Properties ---
    const dataToDisplay = computed<T[]>(() => {
        const sourceData = paginatedModel.value?.data;

        if (!sourceData) {
            return [] as T[];
        }

        // Direct assertion. This assumes that `sourceData` is structurally compatible with `T[]`
        // even if its elements are reactive proxies.
        const data = sourceData as T[]; 

        if (!localSearchTerm.value || backendSearchTerm.value === localSearchTerm.value) {
            return data;
        }
        return data.filter(row => deepSearch(row, localSearchTerm.value));
    });

    const isPaginated = computed(() => {
        if (!paginatedModel.value) return false;
        // Ensure per_page is treated as a number
        const perPageNumber = typeof paginatedModel.value.per_page === 'string' 
            ? parseInt(paginatedModel.value.per_page, 10) 
            : paginatedModel.value.per_page;
        
        return paginatedModel.value.total > perPageNumber;
    });

    const paginationInfo = computed(() => {
        if (!paginatedModel.value) return null;
        const { data, ...pagination } = paginatedModel.value;
        return pagination;
    });

    const deepSearch = (item: any, searchTermToUse: string): boolean => {
        // (Keep your existing deepSearch implementation)
        if (!searchTermToUse) return true;
        const term = searchTermToUse.toLowerCase();
        if (item === null || item === undefined) return false;
        if (typeof item === 'string') return item.toLowerCase().includes(term);
        if (typeof item === 'number' && !isNaN(item)) return String(item).toLowerCase().includes(term);
        if (typeof item === 'object') {
            return Object.values(item).some(value => deepSearch(value, term));
        }
        return String(item).toLowerCase().includes(term);
    };

    // --- Methods ---
    const updateQueryInUrl = (params: Record<string, any>) => {
        router.replace({ query: { ...route.query, ...params } }).catch(err => {
            if (err.name !== 'NavigationDuplicated') console.error(err);
        });
    };
    
    const applyFilters = async (additionalParams: Record<string, any> = {}, syncUrl = true) => {
        isLoading.value = true;
        apiError.value = null;
        selectedRows.value.clear(); // Clear selection on data change

        const queryParamsToSend: Record<string, any> = {
            page: paginatedModel.value?.current_page || 1,
            ...filters.value,
            ...additionalParams,
        };

        if (currentSort.value.length > 0) {
            queryParamsToSend.sort = currentSort.value.join(',');
            queryParamsToSend.direction = currentDirection.value.join(',');
        }

        if (backendSearchTerm.value) {
            queryParamsToSend.search = backendSearchTerm.value;
        } else {
            delete queryParamsToSend.search;
        }
        
        queryParamsToSend.per_page = currentRowsPerPage.value; // Use per_page for Laravel default

        // Clean up empty params
        Object.keys(queryParamsToSend).forEach(key => {
            if (queryParamsToSend[key] === null || queryParamsToSend[key] === undefined || queryParamsToSend[key] === '') {
                delete queryParamsToSend[key];
            }
        });

        try {
            const response = await apiService.get<ApiResponse<DataTableApiResponse<T>>>(router.resolve({ name: apiEndpoint }).href, {params: queryParamsToSend} );
            // const response = await apiService.get<ApiResponse<DataTableApiResponse<T>>>(apiEndpoint, { params: queryParamsToSend });
            
            if (response.data) {
                const apiData = response.data;
                can.value = apiData.can ?? {};

                paginatedModel.value = apiData[modelKeyInData] as PaginatedResponse<T>;

                // Optionally update columns, rppOptions from API if provided
                if (apiData.columns) {
                    currentColumns.value = apiData.columns;
                    const newVisible: Record<string,boolean> = {};
                    apiData.columns.forEach(col => newVisible[col.key] = col.visible ?? true);
                    visibleColumns.value = newVisible;
                }
                if (apiData.config) {
                    if(apiData.config.rowsPerPageOptions) rppOptions.value = apiData.config.rowsPerPageOptions;
                    if(apiData.config.initialRowsPerPage) currentRowsPerPage.value = apiData.config.initialRowsPerPage; // Backend preference takes precedence
                    // initialFilters from API response can be used to set filters.value if needed on first load
                }
                
                // Sync local search input if backend search was performed
                if (queryParamsToSend.search !== undefined) {
                    localSearchTerm.value = queryParamsToSend.search;
                }
            } else {
                 paginatedModel.value = null; // Or some default empty paginated structure
            }

            if (syncUrl) {
                updateQueryInUrl(queryParamsToSend);
            }

        } catch (error) {
            console.error(`Failed to fetch data for ${tableName}:`, error);
            apiError.value = error;
            // Potentially show a notification to the user via a store or composable
        } finally {
            isLoading.value = false;
        }
    };

    const initializeFromUrlOrConfig = () => {
        const query = route.query;
        filters.value = { ...configInitialFilters };
        
        Object.keys(query).forEach(key => {
            if (key === 'page') currentPage.value = Number(query.page) || 1;
            else if (key === 'per_page') currentRowsPerPage.value = Number(query.per_page) || currentRowsPerPage.value;
            else if (key === 'search') backendSearchTerm.value = localSearchTerm.value = String(query.search || '');
            else if (key === 'sort') currentSort.value = String(query.sort).split(',');
            else if (key === 'direction') currentDirection.value = String(query.direction).split(',');
            else {
                // Check if it's a known filterable column before adding
                if (propColumns.some(c => c.key === key && c.filterable)) {
                     filters.value[key] = query[key];
                } else if (configInitialFilters.hasOwnProperty(key)) {
                    filters.value[key] = query[key];
                }
            }
        });

         // If configInitialFilters has items not in URL, they are already in filters.value
         // If URL has items not in configInitialFilters, they are now in filters.value
    };


    const performBackendSearch = () => {
        backendSearchTerm.value = localSearchTerm.value;
        applyFilters({ page: 1 }); // Reset to page 1 for new search
    };

    const performSort = (columnKey: string, directionInput?: 'asc' | 'desc' | '' | null) => {
        const index = currentSort.value.indexOf(columnKey);
        
        if (directionInput === null || directionInput === '') { // Remove sort for this column
            if (index !== -1) {
                currentSort.value.splice(index, 1);
                currentDirection.value.splice(index, 1);
            }
        } else {
            const dir = directionInput || (currentDirection.value[index] === 'asc' ? 'desc' : 'asc'); // Toggle if no specific direction
            if (index === -1) { // New sort column (becomes primary sort)
                currentSort.value = [columnKey, ...currentSort.value];
                currentDirection.value = [dir, ...currentDirection.value];
            } else { // Existing sort column, update direction or move to primary if multi-sort is advanced
                 currentSort.value.splice(index, 1);
                 currentDirection.value.splice(index, 1);
                 currentSort.value.unshift(columnKey);
                 currentDirection.value.unshift(dir);
            }
        }
        // Trim multi-sort arrays if they become too long (e.g., max 3)
        // currentSort.value = currentSort.value.slice(0, 3);
        // currentDirection.value = currentDirection.value.slice(0, 3);

        applyFilters({ page: 1 });
    };

    const updateColumnFilter = (key: string, value: any) => {
        filters.value = { ...filters.value, [key]: value };
        applyFilters({ page: 1 });
    };

    const resetFiltersAndSearch = () => {
        localSearchTerm.value = '';
        backendSearchTerm.value = '';
        filters.value = { ...configInitialFilters }; // Reset to initial config filters or empty
        currentSort.value = [defaultSortKey]; // Reset to default sort
        currentDirection.value = [defaultSortDir];
        applyFilters({ page: 1 });
    };

    const updateRowsPerPage = (newRpp: number) => {
        currentRowsPerPage.value = newRpp;
        applyFilters({ page: 1 });
    };

    const goToPageByUrl = (url: string | null) => {
        if (!url) return;
        try {
            const urlObject = new URL(url);
            const page = urlObject.searchParams.get('page');
            if (page) {
                applyFilters({ page: parseInt(page, 10) });
            }
        } catch (e) {
            console.error("Invalid pagination URL:", url, e);
        }
    };
    
    const refreshData = () => {
        // Re-applies filters with current parameters, effectively refreshing
        applyFilters({}, false); // false to not push same URL again if not needed
    };

    // --- Row Selection ---
    const isAllSelected = computed(() => {
        const currentDisplayItems = dataToDisplay.value;
        if (!currentDisplayItems || currentDisplayItems.length === 0) return false;
        return currentDisplayItems.every(row => selectedRows.value.has(row.id));
    });

    const toggleRowSelection = (rowIdOrAll: (number | string) | 'all') => {
        const currentDisplayIds = dataToDisplay.value.map(row => row.id);
        if (rowIdOrAll === 'all') {
            const allCurrentlyVisibleSelected = currentDisplayIds.length > 0 && currentDisplayIds.every(id => selectedRows.value.has(id));
            if (allCurrentlyVisibleSelected) {
                currentDisplayIds.forEach(id => selectedRows.value.delete(id));
            } else {
                currentDisplayIds.forEach(id => selectedRows.value.add(id));
            }
        } else {
            if (selectedRows.value.has(rowIdOrAll)) {
                selectedRows.value.delete(rowIdOrAll);
            } else {
                selectedRows.value.add(rowIdOrAll);
            }
        }
    };
    
    // --- Lifecycle and Watchers ---
    onMounted(() => {
        initializeFromUrlOrConfig();
        applyFilters({}, false); // Initial fetch, don't push URL again if initializedFromUrl
    });

    watch( // Watch for external route changes (e.g., browser back/forward)
        () => route.query,
        (newQuery, oldQuery) => {
            // Basic check to avoid re-fetch if applyFilters already updated the URL
            // This can be made more robust by comparing specific relevant query params
            if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
                 initializeFromUrlOrConfig();
                 applyFilters({}, false); // Don't sync URL again, it's the source of truth
            }
        },
        { deep: true }
    );

    // Provide to child components
    provide('can', can);
    provide('isLoading', isLoading);
    provide('apiError', apiError);
    provide('paginatedModel', paginatedModel as Ref<PaginatedResponse<T> | null>);
    provide('dataToDisplay', dataToDisplay);
    provide('columns', currentColumns); 
    provide('visibleColumns', visibleColumns);
    provide('rowsPerPage', currentRowsPerPage);
    provide('updateRowsPerPage', updateRowsPerPage);
    provide('rowsPerPageOptions', rppOptions);
    provide('tableName', tableName);
    provide('isPaginated', isPaginated);
    provide('isSimplePagination', isSimplePagination);
    provide('localSearchTerm', localSearchTerm);
    provide('performBackendSearch', performBackendSearch);
    provide('currentSort', currentSort);
    provide('currentDirection', currentDirection);
    provide('currentPage', currentPage);
    provide('performSort', performSort);
    provide('selectedRows', selectedRows);
    provide('isAllSelected', isAllSelected);
    provide('toggleRowSelection', toggleRowSelection);
    provide('apiEndpoint', apiEndpoint);
    // provide('bulkDeleteRoute', bulkDeleteRoute); 
    provide('filters', filters);
    provide('updateColumnFilter', updateColumnFilter);
    provide('resetFiltersAndSearch', resetFiltersAndSearch);
    provide('goToPageByUrl', goToPageByUrl); // For TablePagination
    provide('refreshData', refreshData); // For reload button
    provide('applyFilters', applyFilters); // For reload button

    return {
        can,
        isLoading,
        apiError,
        paginatedModel,
        dataToDisplay,
        localSearchTerm,
        backendSearchTerm,
        visibleColumns,
        isPaginated,
        performBackendSearch,
        filters,
        selectedRows,
        isAllSelected,
        toggleRowSelection,
        updateColumnFilter,
        resetFiltersAndSearch,
        currentSort,
        currentDirection,
        performSort,
        currentRowsPerPage,
        updateRowsPerPage,
        goToPageByUrl,
        refreshData,
        currentPage,
        paginationInfo, // Expose computed pagination details
        currentColumns, // Expose current columns
        applyFilters // Expose for direct use if needed
    };
}