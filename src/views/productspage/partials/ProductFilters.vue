<script setup lang="ts">
import type { Brand } from '@/types';
import { FilterIcon, RefreshCwIcon } from 'lucide-vue-next';
import { watch } from 'vue';

interface ActiveFilters {
    type: string;
    brand_id: string;
    category: string;
    search: string;
    page: number;
}

interface AvailableFilters {
    types: string[];
    brands: Brand[];
    categories: string[];
}

const activeFilters = defineModel<ActiveFilters>('filters');

defineProps<{
    availableFilters: AvailableFilters;
    resetFilters: () => void;
}>();

// Watch for type changes to reset dependent filters
watch(() => activeFilters.value?.type, (newType) => {
    if (!activeFilters.value) return;
    if (newType === 'api') {
        activeFilters.value.brand_id = '';
    } else if (newType === 'ff') {
        activeFilters.value.category = '';
    }
});
</script>

<template>
    <!-- 
        Updated container: 
        - Uses 'card-backdrop' for consistent theme styling.
        - Adjusted 'top-28' to account for the height of the new sticky header.
    -->
    <aside class="sticky top-28 card-backdrop p-8">
        <!-- Header Section -->
        <div class="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-muted">
            <h3 class="flex items-center gap-2 text-lg font-bold section-title">
                <FilterIcon class="w-5 h-5 text-primary-500" />
                Filters
            </h3>
            <button 
                @click="resetFilters" 
                class="btn btn-xs btn-secondary"
                title="Reset all filters"
            >
                <RefreshCwIcon class="w-3.5 h-3.5 mr-1.5" />
                Reset
            </button>
        </div>
        
        <!-- Filter Form -->
        <div v-if="activeFilters" class="space-y-5">
            <!-- Search Filter -->
            <div>
                <label for="search" class="label mb-1.5">Keyword Search</label>
                <div class="relative">
                    <input 
                        type="text" 
                        id="search" 
                        v-model="activeFilters.search" 
                        placeholder="e.g. Paclitaxel..." 
                        class="input w-full"
                    >
                </div>
            </div>

            <!-- Type Filter -->
            <div>
                <label for="type" class="label mb-1.5">Product Type</label>
                <select id="type" v-model="activeFilters.type" class="input w-full">
                    <option value="">All Types</option>
                    <option v-for="type in availableFilters.types" :key="type" :value="type">
                        {{ type === 'api' ? 'Active Ingredients (API)' : 'Finished Formulations' }}
                    </option>
                </select>
            </div>

            <!-- Brand Filter (for FF products) -->
            <transition name="fade">
                <div v-if="activeFilters?.type !== 'api'">
                    <label for="brand" class="label mb-1.5">Brand</label>
                    <select id="brand" v-model="activeFilters.brand_id" class="input w-full">
                        <option value="">All Brands</option>
                        <option v-for="brand in availableFilters.brands" :key="brand.id" :value="brand.id">
                            {{ brand.name }}
                        </option>
                    </select>
                </div>
            </transition>

            <!-- Category Filter (for API products) -->
            <transition name="fade">
                <div v-if="activeFilters?.type !== 'ff'">
                    <label for="category" class="label mb-1.5">Therapeutic Category</label>
                    <select id="category" v-model="activeFilters.category" class="input w-full">
                        <option value="">All Categories</option>
                        <option v-for="cat in availableFilters.categories" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>
            </transition>
        </div>
    </aside>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Simple fade transition for conditional inputs */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>