<script setup lang="ts">
import type { Certification } from '@/types';
import { DownloadIcon } from 'lucide-vue-next';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultCertificationImage } = useDefaultImages();

defineProps<{
    certification: Certification;
}>();
</script>

<template>
    <div
        class="certification-card group"
        :class="{ 'is-featured': certification.is_featured }"
    >
        <!-- Card Header with Logo -->
        <header class="card__header">
            <img 
                :src="certification.logo_url ?? certification.logo_thumbnail_url ?? defaultCertificationImage"
                :alt="`${certification.name} Logo`"
                class="h-16 w-auto max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
            />
        </header>

        <!-- Card Body with Details -->
        <div class="card__body">
            <h2 class="text-2xl font-bold section-title">
                {{ certification.name }}
            </h2>

            <p class="mt-1 text-sm text-muted">
                Issuing Body: <span class="font-semibold section-title">{{ certification.issuing_body }}</span>
            </p>

            <p class="flex-grow mt-4 section-text leading-relaxed">
                {{ certification.description }}
            </p>
        </div>

        <!-- Card Footer with Action Button -->
        <footer class="card__footer">
            <a 
                v-if="certification.pdf_url" 
                :href="certification.pdf_url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn btn-secondary w-full"
            >
                <DownloadIcon class="w-4 h-4" />
                <span>Download Certificate</span>
            </a>
            <span v-else class="text-sm italic text-muted">
                Certificate document not available.
            </span>
        </footer>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.certification-card {
    @apply flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300;
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow-md);
}
.certification-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-300);
}
.dark .certification-card:hover {
    border-color: var(--color-primary-600);
}

/* Featured variant with a clean top border */
.certification-card.is-featured {
    border-top: 4px solid var(--color-secondary-500);
}
.certification-card.is-featured:hover {
    border-color: var(--color-secondary-400);
    border-top-color: var(--color-secondary-500);
}

.card__header {
    @apply flex items-center justify-center p-8 border-b;
    border-color: var(--card-border);
    background-color: color-mix(in srgb, var(--section-bg) 50%, transparent);
    min-height: 140px;
}

.card__body {
    @apply flex flex-col flex-grow p-6 md:p-8;
}

.card__footer {
    @apply p-6 mt-auto border-t;
    border-color: var(--card-border);
    background-color: color-mix(in srgb, var(--section-bg) 50%, transparent);
}
</style>