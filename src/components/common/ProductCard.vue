<script setup lang="ts">
import type { Product } from '@/types';
import { BeakerIcon, FlaskConicalIcon } from 'lucide-vue-next';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages(); // 2. Get the images you need
defineProps<{
    product:Product;
}>();
</script>

<template>
    <div class="group relative block bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-1000 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div class="aspect-square overflow-hidden">
            <img :src="product.image_url ?? ( (product.type === 'api')? defaultProductAPIImage: defaultProductFFImage)" :alt="product.brand?.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
        </div>
        <div class="p-4 border-t border-gray-100 dark:border-gray-800">
             <!-- FF Product Info -->
            <div v-if="product.type === 'ff'">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-500">{{ product.brand?.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.generic_name }}</p>
                <p class="mt-2 text-xs font-semibold bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 inline-block px-2 py-1 rounded">{{ product.therapeutic_area }}</p>
            </div>
             <!-- API Product Info -->
            <div v-if="product.type === 'api'">
                <h3 class="font-bold text-lg">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 font-mono">CAS: {{ product.cas_number }}</p>
                <p class="mt-2 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 inline-block px-2 py-1 rounded">{{ product.category }}</p>
            </div>
        </div>
        <!-- Link Overlay -->
        <RouterLink :to="`/products/${product.slug}`" class="absolute inset-0">
            <span class="sr-only">View details for {{ product.type === 'ff' ? product.brand?.name : product.name }}</span>
        </RouterLink>
    </div>
</template>