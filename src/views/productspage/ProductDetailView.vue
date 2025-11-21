<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import ProductCard from '@/components/common/ProductCard.vue';
import { useProductsAPI } from '@/composables/fetch-public-apis/useProductsAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages(); // 2. Get the images you need
const route = useRoute();
const slug = ref(route.params.slug as string);

const { product, relatedProducts, isLoading, fetchProductBySlug } = useProductsAPI();

onMounted(() => fetchProductBySlug(slug.value));

watch(() => route.params.slug, (newSlug) => {
    if (newSlug) {
        slug.value = newSlug as string;
        fetchProductBySlug(slug.value);
    }
});

const activeTab = ref('description');

</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <div v-if="isLoading" class="flex items-center justify-center h-screen">
            <LoadingState message="Loading Product Details..." />
        </div>
        <div v-else-if="product">        
            <!-- Product Header -->
        <section class="py-12 bg-primary-50 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h1 class="text-4xl font-bold font-grotesk text-primary-900 dark:text-white">{{ product.name }}</h1>
                <p class="text-xl text-gray-600 dark:text-primary-300">{{ product.generic_name }}</p>
            </div>
        </section>

        <!-- Product Details -->
        <div class="container grid gap-12 px-4 py-16 mx-auto lg:grid-cols-3">
            <div class="lg:col-span-1">
                <div class="p-4 border rounded-lg bg-gray-50 dark:bg-primary-1000 dark:border-primary-900">
                    <img :src="product.image_url ?? (product.type === 'api' ? defaultProductAPIImage: defaultProductFFImage)" :alt="product.name" class="object-contain w-full h-auto rounded-md">
                </div>
                <div class="mt-6 space-y-3">
                    <div v-if="product.brand" class="flex justify-between">
                        <strong class="text-gray-600 dark:text-primary-300">Brand:</strong>
                        <span class="font-semibold text-primary-900 dark:text-white">{{ product.brand.name }}</span>
                    </div>
                    <div v-if="product.dosage_form" class="flex justify-between">
                        <strong class="text-gray-600 dark:text-primary-300">Dosage Form:</strong>
                        <span class="font-semibold text-primary-900 dark:text-white">{{ product.dosage_form }}</span>
                    </div>
                    <div v-if="product.strength" class="flex justify-between">
                        <strong class="text-gray-600 dark:text-primary-300">Strength:</strong>
                        <span class="font-semibold text-primary-900 dark:text-white">{{ product.strength }}</span>
                    </div>
                     <div v-if="product.cas_number" class="flex justify-between">
                        <strong class="text-gray-600 dark:text-primary-300">CAS Number:</strong>
                        <span class="font-semibold text-primary-900 dark:text-white">{{ product.cas_number }}</span>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <!-- Tabs -->
                <div class="border-b border-primary-200 dark:border-primary-900">
                    <nav class="flex -mb-px space-x-8" aria-label="Tabs">
                        <button @click="activeTab = 'description'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', activeTab === 'description' ? 'border-secondary-500 text-secondary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">Description</button>
                        <button v-if="product.pharmacology" @click="activeTab = 'pharmacology'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', activeTab === 'pharmacology' ? 'border-secondary-500 text-secondary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">Pharmacology</button>
                        <button v-if="product.indications" @click="activeTab = 'indications'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', activeTab === 'indications' ? 'border-secondary-500 text-secondary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">Indications</button>
                    </nav>
                </div>

                <!-- Tab Panels -->
                <div class="py-6 prose max-w-none dark:prose-invert">
                    <div v-if="activeTab === 'description'">
                        <p>{{ product.description }}</p>
                    </div>
                    <div v-if="activeTab === 'pharmacology'">
                        <p>{{ product.pharmacology }}</p>
                    </div>
                    <div v-if="activeTab === 'indications'">
                        <p>{{ product.indications }}</p>
                    </div>
                </div>
            </div>
        </div>
        <section v-if="relatedProducts.length > 0" class="py-20 sm:py-24 bg-primary-50 dark:bg-primary-1100">
                <div class="container px-4 mx-auto">
                    <h2 class="mb-12 text-3xl font-bold text-center sm:text-4xl font-grotesk text-primary-900 dark:text-white">
                        Related Treatments
                    </h2>
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <ProductCard v-for="related in relatedProducts" :key="related.id" :product="related" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>