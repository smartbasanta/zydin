import type { PaginatedResponse } from '@/types/paginated-response';
import type { ModelCan } from './abilities';

export interface FilterOption {
    value: string | number;
    label: string;
}

export type FilterType = 'text' | 'select' | 'date' | 'number' | 'checkbox' | 'radio'; 

export interface ColumnDefinition<T = any> {
    key: string;
    name: string;
    sortable?: boolean;
    filterable?: boolean;
    filterType?: FilterType;
    filterOptions?: FilterOption[];
    visible?: boolean;
    searchable?: boolean;
    align?: 'left' | 'center' | 'right';
    headerClass?: string;
    cellClass?: string | ((row: T) => string); 
    isAction?: boolean;

    // Optional formatter for how data in this cell should be displayed
    // formatter?: (value: any, row: T) => string | number | JSX.Element; 
}

export interface RowsPerPageOption {
    value: string;
    text: string;
}

export interface UseDataTableConfig<T extends { id: number | string }> {
    apiEndpoint: string;
    columns: ColumnDefinition<T>[];
    initialFilters?: Record<string, any>;
    initialRowsPerPage?: number;
    rowsPerPageOptions?: RowsPerPageOption[];
    tableName: string;
    modelKeyInData?: string;
    configKeyInData?: string; 
    isSimplePagination?: boolean;
    initialSort?: { key: string; direction: 'asc' | 'desc' };
    searchDebounceMs?: number;
}

export interface KnownDataTableApiResponseProperties<T> {
    columns?: ColumnDefinition<T>[];
    config?: {
        tableName: string;
        rowsPerPageOptions: RowsPerPageOption[];
        initialRowsPerPage: number;
        initialFilters: Record<string, any>;
        defaultSort?: { key: string; direction: 'asc' | 'desc' };
    };
    can?: ModelCan
}

export type DataTableApiResponse<T> = KnownDataTableApiResponseProperties<T> & {
    [modelKey: string]: PaginatedResponse<T>;
};