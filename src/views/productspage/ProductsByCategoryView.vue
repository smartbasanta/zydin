<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from './partials/ProductCard.vue';
import ProductFilters from './partials/ProductFilters.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useProductsAPI } from '@/composables/fetch-public-apis/useProductsAPI';
// import Pagination from '@/components/common/Pagination.vue';

const { 
    products, 
    pagination,
    availableFilters, 
    activeFilters, 
    isLoading, 
    fetchProducts, 
    resetFilters 
} = useProductsAPI();

const route = useRoute();

const setFilterFromRoute = () => {
    // PRE-SET THE FILTER based on the route query param
    if (route.query.name) {
        activeFilters.category = route.query.name as string;
    } else {
        fetchProducts();
    }
};

onMounted(setFilterFromRoute);
watch(() => route.query.name, setFilterFromRoute);

const categoryName = computed(() => {
    return activeFilters.category || 'All Categories';
});
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Page Header -->
        <header class="py-20 text-center text-white bg-primary-900 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <p class="mb-2 text-lg font-semibold tracking-wider text-secondary-400">API Product Catalog</p>
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk">
                    Category: <span class="text-secondary-400">{{ categoryName }}</span>
                </h1>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container grid grid-cols-1 gap-12 px-4 py-16 mx-auto lg:grid-cols-4 sm:py-20">
            <!-- Filters Sidebar -->
            <div class="lg:col-span-1">
                <ProductFilters 
                    v-model:filters="activeFilters" 
                    :available-filters="availableFilters" 
                    :reset-filters="resetFilters" 
                />
            </div>

            <!-- Products Grid -->
            <div class="lg:col-span-3">
                <div v-if="isLoading" class="flex items-center justify-center h-96">
                    <LoadingState message="Fetching Products..." />
                </div>
                <div v-else-if="products.length > 0">
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        <ProductCard v-for="product in products" :key="product.id" :product="product" />
                    </div>
                    <!-- <Pagination :pagination="pagination" @page-changed="activeFilters.page = $event" class="mt-12" /> -->
                </div>
                <div v-else class="flex flex-col items-center justify-center h-96 text-center text-gray-500 dark:text-primary-400">
                    <i class="mb-4 text-6xl i-lucide-search-x"></i>
                    <h3 class="text-2xl font-bold font-grotesk">No Products Found</h3>
                    <p class="mt-2">No products were found for this category. Try adjusting the filters.</p>
                </div>
            </div>
        </main>
    </div>
</template>