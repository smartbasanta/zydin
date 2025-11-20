<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CRUDCard from '@/components/card/CRUDCard.vue';
import { PackageIcon, LibraryIcon } from 'lucide-vue-next';
import { TableAddButton } from '@/components/table/button';
import LoadingState from '@/components/loading/LoadingState.vue';

const route = useRoute();

// The active tab is now computed based on the current route name.
// This makes it reactive to URL changes (e.g., browser back/forward buttons).
const activeTab = computed<'products' | 'brands'>(() => {
    if (route.name?.toString().startsWith('dashboard.brands')) {
        return 'brands';
    }
    return 'products'; // Default to products for products/create, products/edit, etc.
});
</script>

<template>
    <div>

        <div class="m-6 mb-0 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Product & Brand Management
                </h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Manage all products, formulations, APIs, and their associated brands.
                </p>
            </div>

            <!-- The actions slot adapts based on the computed active tab -->
            <!-- <div class="flex items-center gap-2">
                <TableAddButton v-if="activeTab === 'brands'" :to="{ name: 'dashboard.brands.create' }" title="Create New Brand" />
                <TableAddButton v-if="activeTab === 'products'" :to="{ name: 'dashboard.products.create' }" title="Add New Product" />
            </div> -->
        </div>

        <!-- Tab Navigation -->
        <div class="ml-6 flex border-b border-gray-200 dark:border-gray-700">
            <RouterLink
                :to="{ name: 'dashboard.products.index' }"
                class="tab-button"
                :class="{ 'is-active': activeTab === 'products' }"
            >
                <PackageIcon class="w-4 h-4 mr-2" />
                Products
            </RouterLink>
            <RouterLink
                :to="{ name: 'dashboard.brands.index' }"
                class="tab-button"
                :class="{ 'is-active': activeTab === 'brands' }"
            >
                <LibraryIcon class="w-4 h-4 mr-2" />
                Brands
            </RouterLink>
        </div>
        <!-- The <RouterView> renders the component for the active child route -->
        <div class="mt-0">
            <RouterView v-slot="{ Component }">
                <template v-if="Component">
                    <Suspense>
                        <component :is="Component"></component>
                        <template #fallback>
                            <LoadingState />
                        </template>
                    </Suspense>
                </template>
            </RouterView>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.tab-button {
    @apply flex items-center px-4 py-3 text-sm font-medium border-b-2 border-transparent -mb-px;
}
.tab-button:hover {
    /* @apply text-foreground; */
}
.tab-button.is-active {
    @apply text-secondary border-secondary;
}
</style>