<script setup lang="ts">
    import { SearchIcon } from 'lucide-vue-next';
    import { ref, inject, type Ref } from 'vue';

    const localSearchTerm = inject<Ref<string>>('localSearchTerm');
    const performBackendSearch = inject<() => void>('performBackendSearch');

    const inputFieldRef = ref<HTMLInputElement | null>(null);

    const handleSubmit = () => {
        if (performBackendSearch) {
            performBackendSearch();
        }
    };
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex-1">
        <div class="relative flex flex-1">
            <div class="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
                <SearchIcon class="size-5 text-muted" />
            </div>
            <input
                v-if="localSearchTerm !== undefined"
                type="search"
                ref="inputFieldRef"
                id="searchTable"
                v-model="localSearchTerm" 
                class="input !pl-10 !pr-[calc(theme(spacing.20)+theme(spacing.4))]"
                placeholder="Type to filter..."
                aria-label="Search table"
            />
            <input 
                v-else type="search" disabled
                class="input !pl-10 !pr-[calc(theme(spacing.20)+theme(spacing.1.5))]"
                placeholder="Search unavailable"
            />
            <div class="absolute top-0 right-0 h-full">
                <button 
                    type="submit" 
                    class="btn btn-secondary !rounded-l-none h-full px-3 sm:px-4 text-sm"
                    :disabled="!performBackendSearch"
                    title="Search Server"
                >
                    <span class="hidden sm:inline">Search</span>
                    <SearchIcon class="sm:hidden size-4"/>
                </button>
            </div>
        </div>
    </form>
</template>