<script setup lang="ts">
import { ref } from 'vue';
import type { Certification } from '@/types';
import { EditButton, DeleteButton } from '@/components/button';
import { FileTextIcon, BuildingIcon } from 'lucide-vue-next';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';
import DeleteModel from '@/components/button/DeleteModel.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
const props = defineProps<{
    certification: Certification;
}>();

const emit = defineEmits(['deleted']);

const { notify, error: notifyError } = useNotifier();
const isDeleting = ref(false);

const onConfirmDelete = () => {
    emit('deleted', props.certification.id);
};
</script>

<template>
    <div
        class="bg-white dark:bg-gray-1000 rounded-lg shadow-sm border border-gray-200 dark:border-gray-900 flex flex-col overflow-hidden group">

        <!-- NEW: The main content is now wrapped in a RouterLink -->
        <RouterLink :to="{ name: 'dashboard.certifications.show', params: { id: certification.id } }"
            class="flex flex-col flex-grow">
            <!-- Logo and PDF hover effect -->
            <div class="block relative">
                <div class="aspect-video bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center p-4">
                    <img v-if="certification.logo_url" :src="certification.logo_url" :alt="certification.name"
                        class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105">
                    <FileTextIcon v-else class="size-16 text-gray-400 dark:text-gray-500" />
                </div>
                <div
                    class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="text-white font-semibold text-sm">View Details</span>
                </div>
            </div>

            <!-- Card Content -->
            <div class="p-4 flex-grow">
                <h3 class="font-bold text-gray-900 dark:text-white truncate" :title="certification.name">
                    {{ certification.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                    <BuildingIcon class="size-3.5" />
                    {{ certification.issuing_body }}
                </p>
            </div>
        </RouterLink>

        <!-- Card Footer with Actions -->
        <div class="p-3 bg-gray-50 dark:bg-gray-1100/50 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-end gap-2">
                <EditButton v-if="certification.can?.update"
                    :to="{ name: 'dashboard.certifications.edit', params: { id: certification.id } }" size="sm"
                    @click.prevent />
                <DeleteModel v-if="certification.can?.delete" :item-id="certification.id"
                    :item-name="certification.name" delete-url="/dashboard/certifications/" size="sm"
                    @deleted="onConfirmDelete" @click.prevent />
            </div>
        </div>
    </div>
    <!-- <ConfirmModal /> -->
</template>