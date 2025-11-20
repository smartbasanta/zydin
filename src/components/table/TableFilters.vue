<script setup lang="ts">
    import { computed, inject, ref, type Ref, watch } from 'vue';
    import { FilterIcon } from 'lucide-vue-next';
    import Dropdown from '@/components/menu/Dropdown.vue';
    import type { ColumnDefinition } from '@/types/datatable';

    const columns = inject<Ref<ColumnDefinition[]>>('columns', ref([]));
    const filters = inject<Ref<Record<string, any>>>('filters', ref({}));
    const applyFilters  = inject<() => void>('applyFilters'); 

    const updateColumnFilter = inject<(key: string, value: any) => void>('updateColumnFilter'); 
    const resetFiltersAndSearch = inject<() => void>('resetFiltersAndSearch'); 

    const localFilterValues = ref<Record<string, any>>({});

    watch(filters, (newFilters) => {
        localFilterValues.value = { ...newFilters };
    }, { immediate: true, deep: true });

    const filterableColumns = computed(() => columns.value.filter(col => col.filterable));

    const activeFilterCount = computed(() => {
        return Object.entries(filters.value).filter(([key, value]) => 
            !['search', 'per_page', 'sort', 'direction', 'page'].includes(key) && 
            value !== null && value !== undefined && value !== ''
        ).length;
    });

    const handleApplyFiltersInMenu = (closeDropdown: () => void) => {
    
        let changed = false;
        for (const key in localFilterValues.value) {
            if (filterableColumns.value.some(c => c.key === key)) {
                if (filters.value[key] !== localFilterValues.value[key]) {
                    // Update the main filters ref directly. applyFilters will read from it.
                    filters.value[key] = localFilterValues.value[key]; 
                    changed = true;
                }
            }
        }
    
        if (changed && updateColumnFilter) { 
        
            if (applyFilters ) applyFilters (); 
            else { 
                for (const key in localFilterValues.value) {
                    if (filterableColumns.value.some(c => c.key === key) && filters.value[key] !== localFilterValues.value[key]) {
                        updateColumnFilter(key, localFilterValues.value[key]);
                    }
                }
            }
        }
        closeDropdown();
    };

    const handleResetFiltersInMenu = (closeDropdown: () => void) => {
        if (resetFiltersAndSearch) {
            resetFiltersAndSearch(); 
        }
    
        closeDropdown();
    };
</script>

<template>
    <div class="flex items-center">
        <Dropdown v-if="filterableColumns.length > 0">
            <template #trigger="{ toggle }">
                <button @click="toggle()" class="btn btn-secondary">
                    <FilterIcon class="size-4 mr-1.5" />
                    Filter
                    <span v-if="activeFilterCount > 0" 
                        class="ml-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                        {{ activeFilterCount }}
                    </span>
                </button>
            </template>
            <template #menu="{ close }">
                <div class="dropdown-content p-4 max-h-[70vh] overflow-y-auto">
                    <div v-for="col in filterableColumns" :key="col.key" class="mb-4">
                        <label :for="`filter-${col.key}`" class="block text-sm font-medium mb-1 text-foreground">{{ col.name }}</label>
                        
                        <input 
                            v-if="!col.filterType || col.filterType === 'text' || col.filterType === 'number'" 
                            :id="`filter-${col.key}`"
                            :type="col.filterType === 'number' ? 'number' : 'text'"
                            v-model="localFilterValues[col.key]" 
                            class="input w-full"
                            :placeholder="`Filter by ${col.name}...`"
                            @keyup.enter="handleApplyFiltersInMenu(close)"
                        />

                        <select 
                            v-else-if="col.filterType === 'select'" 
                            :id="`filter-${col.key}`"
                            v-model="localFilterValues[col.key]" 
                            class="input w-full"
                        >
                            <option value="">All {{ col.name }}</option>
                            <option v-for="option in col.filterOptions" :key="String(option.value)" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>

                        <input 
                            v-else-if="col.filterType === 'date'" 
                            :id="`filter-${col.key}`"
                            type="date" 
                            v-model="localFilterValues[col.key]" 
                            class="input w-full"
                        />
                        <!-- TODO :: other filter types (checkbox, radio) as needed -->
                    </div>
                    <div v-if="filterableColumns.length === 0" class="text-sm text-muted-foreground">
                        No filters available.
                    </div>
                    <div v-if="filterableColumns.length > 0" class="flex gap-2 mt-4 pt-3 border-t border-border-color">
                        <button 
                            @click="handleApplyFiltersInMenu(close)" 
                            class="btn primary w-full flex-1"
                        >
                            Apply Filters
                        </button>
                        <button 
                            @click="handleResetFiltersInMenu(close)" 
                            class="btn outline w-full flex-1"
                        >
                            Reset All
                        </button>
                    </div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>