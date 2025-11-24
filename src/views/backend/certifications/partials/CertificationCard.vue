<script setup lang="ts">
import type { Certification } from '@/types';
import { BuildingIcon, FileTextIcon } from 'lucide-vue-next';
import { EditButton } from '@/components/button';
import DeleteModel from '@/components/button/DeleteModel.vue';
import ViewButton from '@/components/button/ViewButton.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultCertificationImage } = useDefaultImages();

const props = defineProps<{
    certification: Certification;
}>();

const emit = defineEmits(['deleted']);

const onConfirmDelete = () => {
    emit('deleted', props.certification.id);
};
</script>

<template>
    <div class="cert-card group">
        <!-- Main Clickable Area -->
        <RouterLink 
            :to="{ name: 'dashboard.certifications.show', params: { id: certification.id } }"
            class="flex flex-col flex-grow"
        >
            <!-- Card Image / Logo Header -->
            <div class="cert-card__header">
                <img 
                    :src="certification.logo_url ?? certification.logo_thumbnail_url ?? defaultCertificationImage" 
                    :alt="certification.name"
                    class="cert-card__image"
                >
                <!-- Fallback Icon if image fails to load or is generic -->
                <!-- <div v-if="!certification.logo_url && !certification.logo_thumbnail_url" class="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <FileTextIcon class="size-12" />
                </div> -->
            </div>

            <!-- Card Content -->
            <div class="cert-card__body">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <h3 class="text-lg font-bold section-title line-clamp-1" :title="certification.name">
                            {{ certification.name }}
                        </h3>
                        <p class="text-sm text-muted flex items-center gap-1.5 mt-1">
                            <BuildingIcon class="size-3.5 text-primary-500" />
                            <span class="line-clamp-1">{{ certification.issuing_body }}</span>
                        </p>
                    </div>
                </div>
                
                <p v-if="certification.description" class="mt-3 text-xs text-muted line-clamp-2 leading-relaxed">
                    {{ certification.description }}
                </p>
            </div>
        </RouterLink>

        <!-- Card Footer (Actions) -->
        <div class="cert-card__footer">
            <div class="text-xs font-medium section-title">
                <!-- Optional: Status badge or Date could go here -->
                <span v-if="certification.is_featured" class="text-secondary-600 flex items-center gap-1">
                    Featured
                </span>
            </div>

            <div class="flex items-center gap-2">
                <ViewButton 
                    :to="{ name: 'dashboard.certifications.show', params: { id: certification.id } }" 
                    icon-only 
                    size="sm"
                />
                
                <EditButton 
                    v-if="certification.can?.update"
                    :to="{ name: 'dashboard.certifications.edit', params: { id: certification.id } }" 
                    icon-only 
                    size="sm"
                />
                
                <DeleteModel 
                    v-if="certification.can?.delete" 
                    :item-id="certification.id"
                    :item-name="certification.name" 
                    delete-url="/dashboard/certifications/" 
                    icon-only
                    size="sm"
                    @deleted="onConfirmDelete" 
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.cert-card {
    @apply flex flex-col rounded-xl border overflow-hidden transition-all duration-300 relative;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-sm);
}

.cert-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-300);
}
:global(.dark) .cert-card:hover {
    border-color: var(--color-primary-600);
}

.cert-card__header {
    @apply relative h-40 w-full bg-gray-50 dark:bg-gray-900/50 border-b border-muted flex items-center justify-center p-6 overflow-hidden;
}

.cert-card__image {
    @apply w-full h-full object-contain transition-transform duration-500;
}
.group:hover .cert-card__image {
    transform: scale(1.05);
}

.cert-card__body {
    @apply p-5 flex-grow;
}

.cert-card__footer {
    @apply px-5 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-t border-muted flex justify-between items-center;
}
</style>