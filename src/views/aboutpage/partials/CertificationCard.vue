<script setup lang="ts">
import type { Certification } from '@/types';
import { DownloadIcon, AwardIcon } from 'lucide-vue-next';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultCertificationImage } = useDefaultImages(); // 2. Get the images you need
defineProps<{
    certification: Certification;
}>();
</script>

<template>
    <div
        class="relative flex flex-col sm:flex-row h-full overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-md group border-primary-100 dark:bg-primary-1000 dark:border-primary-900 hover:shadow-xl hover:border-secondary-500/30">
        <!-- Featured Badge -->
        <div v-if="certification.is_featured"
            class="absolute top-0 right-0 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase rounded-bl-lg bg-secondary-600">
            Featured
        </div>

        <!-- Subtle Featured Accent Border -->
        <div v-if="certification.is_featured"
            class="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 ring-2 ring-secondary-500 rounded-lg">
        </div>

        <!-- Logo / Icon Section -->
        <div
            class="flex items-center justify-center flex-shrink-0 p-8 bg-primary-50 dark:bg-primary-1100 sm:w-1/3 md:w-1/4">
            <img :src="certification.logo_url ?? certification.logo_thumbnail_url ?? defaultCertificationImage"
                :alt="`${certification.name} Logo`"
                class="object-contain transition-transform duration-300 group-hover:scale-105">
        </div>

        <!-- Details Section -->
        <div class="flex flex-col flex-grow p-6 md:p-8">
            <h2 class="text-2xl font-bold font-grotesk text-primary-900 dark:text-white">
                {{ certification.name }}
            </h2>

            <p class="mt-1 text-sm font-medium text-gray-500 dark:text-primary-400">
                Issuing Body: <span class="font-semibold text-primary-800 dark:text-primary-200">{{
                    certification.issuing_body }}</span>
            </p>

            <p class="flex-grow mt-4 text-gray-600 dark:text-primary-300 leading-relaxed">
                {{ certification.description }}
            </p>

            <div class="mt-6">
                <a v-if="certification.pdf_url" :href="certification.pdf_url" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 transform rounded-full bg-secondary-500 text-primary-1200 hover:bg-secondary-600 hover:scale-105">
                    <DownloadIcon class="w-4 h-4" />
                    Download Certificate
                </a>
                <span v-else class="text-sm italic text-gray-400 dark:text-primary-500">
                    Certificate document not available.
                </span>
            </div>
        </div>
    </div>
</template>