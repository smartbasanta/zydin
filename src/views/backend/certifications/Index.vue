<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import type { Certification } from '@/types';
import { useNotifier } from '@/composables/useNotifier';
import CertificationCard from './partials/CertificationCard.vue';
import { RouterLink } from 'vue-router';
import { PlusIcon, FileTextIcon } from 'lucide-vue-next';
import LoadingState from '@/components/loading/LoadingState.vue';

const { notify, error: notifyError } = useNotifier();

const certifications = ref<Certification[]>([]);
const canCreate = ref(false);
const isLoading = ref(true);

const fetchCertifications = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/dashboard/certifications');
        certifications.value = response.data.certifications;
        canCreate.value = response.data.can.create;
    } catch (err) {
        notifyError(err as any, "Failed to load certifications");
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchCertifications);

// Function to remove a card from the grid after it's been deleted
const handleDelete = async (deletedId: number) => {
    try {
        const response: ApiResponse = await apiService.delete(`/dashboard/certifications/${deletedId}`);
        notify(response);
        // Remove the card from the local state for a smooth UI update
        certifications.value = certifications.value.filter(cert => cert.id !== deletedId);
    } catch (err) {
        notifyError(err as any, 'Failed to delete certification');
    }
};
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Manage company and product certifications.</p>
            </div>
            <RouterLink v-if="canCreate" :to="{ name: 'dashboard.certifications.create' }" class="btn btn-primary">
                <PlusIcon class="size-4" />
                Add Certification
            </RouterLink>
        </div>

        <!-- Loading State -->
        <LoadingState v-if="isLoading" message="Loading certifications..." />

        <!-- Grid Layout -->
        <div v-else-if="certifications.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CertificationCard v-for="cert in certifications" :key="cert.id" :certification="cert"
                @deleted="fetchCertifications" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 border-2 border-dashed dark:border-gray-700 rounded-lg">
            <div class="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <FileTextIcon class="size-16 mb-4" />
                <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    No Certifications Found
                </h3>
                <p class="text-sm mb-4">Get started by adding your first certification.</p>
                <RouterLink v-if="canCreate" :to="{ name: 'dashboard.certifications.create' }" class="btn btn-primary">
                    <PlusIcon class="size-4" />
                    Add Certification
                </RouterLink>
            </div>
        </div>
    </div>
</template>