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
    if (route.query.id) {
        activeFilters.brand_id = route.query.id as string;
    } else {
        // If no ID is present, fetch all products
        fetchProducts();
    }
    // The watcher in the composable will automatically trigger the initial fetchProducts call
};

onMounted(setFilterFromRoute);
// Watch for changes to the query param in case the user navigates between brands client-side
watch(() => route.query.id, setFilterFromRoute);

const brandName = computed(() => {
    if (!activeFilters.brand_id) return 'All Brands';
    const brand = availableFilters.value.brands.find(b => b.id === parseInt(activeFilters.brand_id, 10));
    return brand ? brand.name : 'Brand';
});
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Page Header -->
        <header class="py-20 text-center text-white bg-primary-900 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <p class="mb-2 text-lg font-semibold tracking-wider text-secondary-400">Product Catalog</p>
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk">
                    Products by Brand: <span class="text-secondary-400">{{ brandName }}</span>
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
                    <p class="mt-2">No products were found for this brand. Try adjusting the filters.</p>
                </div>
            </div>
        </main>
    </div>
</template>