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
    <div class="section-bg">
        <!-- Modern Hero Header -->
        <header class="page-hero">
            <div class="page-hero__glow page-hero__glow--primary" aria-hidden="true"></div>
            <div class="page-hero__glow page-hero__glow--secondary" aria-hidden="true"></div>
            <div class="container mx-auto px-6 py-20 md:py-28 text-center relative z-10">
                <div class="inline-block p-5 mb-6 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-sm">
                    <ShieldCheckIcon class="w-10 h-10 text-white" />
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow-lg">Our Commitment to Quality</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-white/90 text-shadow-md">
                    We adhere to the most rigorous global standards to ensure the safety, efficacy, and quality of every product we manufacture. Our certifications are a testament to this promise.
                </p>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="py-20 md:py-28">
            <div class="container max-w-6xl px-6 mx-auto">
                <div v-if="isLoading" class="flex items-center justify-center h-64">
                    <LoadingState message="Loading Certifications..." />
                </div>

                <!-- Modern Grid Layout with Stagger Animation -->
                <TransitionGroup
                    v-else-if="certifications.length > 0" 
                    tag="div"
                    name="list"
                    appear
                    class="grid md:grid-cols-2 gap-8"
                >
                    <CertificationCard 
                        v-for="(cert, index) in certifications" 
                        :key="cert.id"
                        :certification="cert"
                        :style="{ transitionDelay: `${index * 100}ms` }"
                    />
                </TransitionGroup>

                <div v-else class="text-center card-backdrop p-12 max-w-2xl mx-auto">
                    <p class="text-lg text-muted">Certification details are currently unavailable. Please check back later.</p>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Consistent Hero Styling */
.page-hero {
    position: relative;
    overflow: hidden;
    background-image: var(--gradient-hero);
}
.page-hero__glow {
    position: absolute;
    border-radius: 9999px;
    filter: blur(120px);
    pointer-events: none;
}
.page-hero__glow--primary {
    background: var(--gradient-accent);
    width: 350px; height: 350px;
    top: -100px; right: -100px; opacity: 0.4;
}
.page-hero__glow--secondary {
    background: var(--gradient-secondary);
    width: 300px; height: 300px;
    bottom: -100px; left: -50px; opacity: 0.3;
}
.text-shadow-lg { text-shadow: 0 4px 15px rgba(0,0,0,0.4); }
.text-shadow-md { text-shadow: 0 2px 5px rgba(0,0,0,0.3); }

/* Staggered List Animation */
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
</style>