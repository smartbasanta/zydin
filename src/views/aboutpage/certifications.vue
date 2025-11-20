<script setup lang="ts">
import { onMounted } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { ShieldCheckIcon } from 'lucide-vue-next';
import { useCertificationsAPI } from '@/composables/fetch-public-apis/useCertificationsAPI';
import CertificationCard from './partials/CertificationCard.vue';

const { certifications, isLoading, fetchCertifications } = useCertificationsAPI();

onMounted(fetchCertifications);
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Page Header -->
        <header class="py-20 text-center text-white bg-gradient-to-br from-primary-800 to-primary-1000">
            <div class="container px-4 mx-auto">
                <div class="inline-block p-4 mb-4 border-2 rounded-full border-white/20 bg-white/10">
                    <ShieldCheckIcon class="w-10 h-10" />
                </div>
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk">Our Commitment to Quality</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-primary-200">
                    We adhere to the most rigorous global standards to ensure the safety, efficacy, and quality of every product we manufacture. Our certifications are a testament to this promise.
                </p>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="py-20 sm:py-24">
            <div class="container max-w-4xl px-4 mx-auto">
                <!-- Loading State -->
                <div v-if="isLoading" class="flex items-center justify-center">
                    <LoadingState message="Loading Certifications..." />
                </div>

                <!-- Certifications List (Now a simple vertical stack) -->
                <div v-else-if="certifications.length > 0" 
                     class="space-y-8">
                    
                    <div v-for="(cert, index) in certifications" 
                         :key="cert.id"
                         class="wow animate__animated animate__fadeInUp"
                         :data-wow-delay="`${index * 0.1}s`">
                        
                        <CertificationCard :certification="cert" />

                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center text-gray-500 dark:text-primary-400">
                    <p>Certification details are currently unavailable. Please check back later.</p>
                </div>
            </div>
        </main>
    </div>
</template>