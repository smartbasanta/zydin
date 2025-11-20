<script setup lang="ts">
import type { Product } from '@/types';
import { RouterLink } from 'vue-router';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages();
defineProps<{ product: Product }>();
</script>

<template>
    <RouterLink
        :to="{ name: 'products.detail', params: { slug: product.slug } }"
        class="block overflow-hidden transition-all duration-300 transform bg-card border border-card-border rounded-2xl shadow-card hover:shadow-2xl hover:-translate-y-2 group backdrop-blur-sm"
    >
        <div class="flex flex-col h-full">
            <div class="w-full h-48 overflow-hidden rounded-t-2xl">
                <img
                    :src="product.image_url ?? (product.type === 'api' ? defaultProductAPIImage : defaultProductFFImage)"
                    :alt="product.name"
                    class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                >
            </div>
            <div class="flex flex-col flex-grow p-6">
                <div class="flex-grow">
                    <span
                        class="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-gradient-primary text-white"
                    >{{ product.type }}</span>
                    <h3 class="mt-4 text-xl font-bold text-primary-1200">{{ product.name }}</h3>
                    <p v-if="product.type === 'ff'" class="mt-2 text-sm text-gray-600">{{ product.generic_name }}</p>
                    <p v-if="product.type === 'api'" class="mt-2 text-sm text-gray-600">Category: {{ product.category }}</p>
                </div>
                <div class="mt-6">
                    <span class="inline-flex items-center font-semibold text-primary-700 group-hover:text-primary-800 transition-colors">
                        View Details
                        <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </RouterLink>
</template>
