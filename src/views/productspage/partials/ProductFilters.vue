<script setup lang="ts">
import type { Brand } from '@/types';
import { FilterIcon, XIcon } from 'lucide-vue-next';
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
// Use defineModel for two-way binding with the parent's activeFilters
const activeFilters = defineModel<ActiveFilters>('filters');

defineProps<{
    availableFilters: AvailableFilters;
    resetFilters: () => void;
}>();
</script>

<template>
    <aside class="sticky p-6 border rounded-lg top-24 bg-primary-50/50 dark:bg-primary-1100/50 border-primary-100 dark:border-primary-900">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-primary-200 dark:border-primary-900">
            <h3 class="flex items-center gap-2 text-xl font-bold font-grotesk text-primary-900 dark:text-white">
                <FilterIcon class="w-5 h-5" />
                Filter Products
            </h3>
            <button @click="resetFilters" class="btn bg-secondary-500 hover:bg-secondary-900 text-sm font-semibold transition-colors text-primary-1200">
                Reset All
            </button>
        </div>
        
        <!-- Add a check to ensure activeFilters is defined before rendering the form -->
        <div v-if="activeFilters" class="space-y-6">
            <!-- Search Filter -->
            <div>
                <label for="search" class="label">Keyword Search</label>
                <input type="text" id="search" v-model="activeFilters.search" placeholder="e.g., Paclitaxel" class="input">
            </div>

            <!-- Type Filter -->
            <div>
                <label for="type" class="label">Product Type</label>
                <select id="type" v-model="activeFilters.type" class="input">
                    <option value="">All Types</option>
                    <option v-for="type in availableFilters.types" :key="type" :value="type">{{ type.toUpperCase() }}</option>
                </select>
            </div>

            <!-- Brand Filter (for FF products) -->
            <div v-if="activeFilters.type !== 'api'">
                <label for="brand" class="label">Brand</label>
                <select id="brand" v-model="activeFilters.brand_id" class="input">
                    <option value="">All Brands</option>
                    <option v-for="brand in availableFilters.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>

            <!-- Category Filter (for API products) -->
            <div v-if="activeFilters.type !== 'ff'">
                <label for="category" class="label">API Category</label>
                <select id="category" v-model="activeFilters.category" class="input">
                    <option value="">All Categories</option>
                    <option v-for="cat in availableFilters.categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>
        </div>
    </aside>
</template>