<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import type { Certification } from '@/types';
import { useNotifier } from '@/composables/useNotifier';
import CertificationCard from './partials/CertificationCard.vue';
import { RouterLink } from 'vue-router';
import { PlusIcon, FileCheckIcon } from 'lucide-vue-next'; // Switched to FileCheck for better semantics
import LoadingState from '@/components/loading/LoadingState.vue';

const { error: notifyError } = useNotifier();

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

// Optimized: Update local state instead of re-fetching everything
const handleDeleted = (deletedId: number) => {
    certifications.value = certifications.value.filter(c => c.id !== deletedId);
};
</script>

<template>
    <div class="p-6 md:p-8 space-y-8">
        <!-- Page Header -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold section-title">Certifications</h1>
                <p class="text-muted mt-1">Manage official compliance documents and quality standards.</p>
            </div>
            <RouterLink 
                v-if="canCreate" 
                :to="{ name: 'dashboard.certifications.create' }" 
                class="btn btn-primary"
            >
                <PlusIcon class="w-4 h-4 mr-2" />
                Add Certification
            </RouterLink>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="h-64 flex items-center justify-center">
            <LoadingState message="Loading Certifications..." />
        </div>

        <!-- Certifications Grid -->
        <div v-else-if="certifications.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CertificationCard 
                v-for="cert in certifications" 
                :key="cert.id" 
                :certification="cert"
                @deleted="handleDeleted" 
            />
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-muted rounded-xl bg-gray-50/50 dark:bg-gray-900/20">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-muted">
                <FileCheckIcon class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold section-title">No Certifications Found</h3>
            <p class="text-muted max-w-sm mt-1 mb-6">Your repository is empty. Upload your ISO, GMP, or other compliance certificates here.</p>
            <RouterLink 
                v-if="canCreate" 
                :to="{ name: 'dashboard.certifications.create' }" 
                class="btn btn-primary"
            >
                <PlusIcon class="w-4 h-4 mr-2" />
                Add First Certification
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
</style>