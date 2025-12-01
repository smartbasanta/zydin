<script setup lang="ts">
// import HeroCarousel from './partials/HeroCarousel.vue';
// import QuickCategories from './partials/QuickCategories.vue';
// import FlashSale from './partials/FlashSale.vue';
// import ProductGrid from './partials/ProductGrid.vue';
// import type { Product } from '@/types/product';


// In a real app, you would fetch this data from an API
// const featuredProducts: Product[] = [
//   { id: 1, name: 'Wireless Earbuds', price: '$49.99', oldPrice: '$79.99', image: 'https://images.unsplash.com/photo-1606734297352-1921a8f82d3a?q=80&w=2574&auto=format&fit=crop', rating: 4.5 },
//   { id: 2, name: 'Smart Fitness Tracker', price: '$89.00', image: 'https://images.unsplash.com/photo-1579586337278-3538996c5618?q=80&w=2670&auto=format&fit=crop', rating: 4.8 },
//   { id: 3, name: 'Portable Coffee Maker', price: '$25.50', image: 'https://images.unsplash.com/photo-1593972496839-a99f6e3c63de?q=80&w=2574&auto=format&fit=crop', rating: 4.2 },
//   { id: 4, name: 'Minimalist Desk Lamp', price: '$35.00', oldPrice: '$50.00', image: 'https://images.unsplash.com/photo-1594215882823-86a34a87a637?q=80&w=2574&auto=format&fit=crop', rating: 4.6 }
// ];

const bestSellers = [
    // Add more product objects here
];
</script>

<template>
    <div class="bg-gray-100 dark:bg-gray-1100 min-h-screen pb-20">        
        <main>
            <!-- <HeroCarousel /> -->
            <QuickCategories />            
            <FlashSale />
            <!-- <ProductGrid title="Featured For You" :products="featuredProducts" /> -->

            <!-- You can reuse the ProductGrid for other sections -->
            <!-- <ProductGrid title="Bestsellers" :products="bestSellers" /> -->
        </main>

    </div>
</template>