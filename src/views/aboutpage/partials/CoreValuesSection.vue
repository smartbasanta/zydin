<script setup lang="ts">
import type { CoreValue } from '@/types';
import { Gem } from 'lucide-vue-next';

defineProps<{ values: CoreValue[] }>();
</script>
<template>
    <section class="py-20 sm:py-24 bg-secondary-100 dark:bg-pink-200">
        <div class="container px-4 mx-auto">
            <h2 class="mb-12 text-3xl font-bold text-center sm:text-4xl font-grotesk text-secondary-1200 dark:text-pink-900">Our Core Values</h2>
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div v-for="value in values" :key="value.title" class="p-6 text-center bg-secondary-400 rounded-lg shadow-md dark:bg-pink-800">
                    <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-pink-500">
                        <!-- You can map icons to titles for a better look -->
                        <Gem :size="35" class="text-secondary-600 dark:text-pink-50" />
                    </div>
                    <h3 class="mb-2 text-xl font-bold font-grotesk text-primary-1200 dark:text-white">{{ value.title }}</h3>
                    <p class="text-primary-1000 dark:text-pink-100">{{ value.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>