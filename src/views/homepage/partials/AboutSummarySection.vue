<script setup lang="ts">
import { usePageDataAPI } from '@/composables/fetch-public-apis/usePageDataAPI';
import { computed, onMounted } from 'vue';
import { useDefaultImages } from '@/composables/useDefaultImages';
import AppLogo from '@/components/logo/AppLogo.vue';
import AppLogoAnimation from '@/components/logo/AppLogoAnimation.vue';

const { zydinLogoImage } = useDefaultImages();
const { aboutPageData, isLoading, fetchAboutPageData } = usePageDataAPI();

const summary = computed(() => {
    // Added a fallback to prevent errors before data is loaded
    return aboutPageData.value?.content.summary.content.value ?? 'Loading...';
})
onMounted(async () => {
    await fetchAboutPageData();
});
</script>

<template>
    <section class="py-20 md:py-28 clip-path-section relative overflow-hidden section-bg">
        <div class="container items-center mx-auto px-6 relative z-10">
            <div class="flex flex-col items-center mb-16">
                <h1 class="text-3xl md:text-4xl font-bold text-center section-title mb-4">
                    About Zydin Biotech
                </h1>
                <div class="w-16 h-1 bg-current section-title rounded-full"></div>
            </div>

            <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                <div class="flex-1 max-w-2xl">
                    <div class="card-backdrop p-8 md:p-10">
                        <p class="text-lg md:text-xl leading-relaxed section-text font-medium">
                            {{ summary }}
                        </p>
                    </div>
                </div>

                <div class="flex-1 max-w-md mx-auto lg:mx-0">
                    <div class="relative">
                        <div class="relative card-backdrop p-8">
                            <div class="aspect-square relative">
                                <AppLogoAnimation :glow="true" :animation="true" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Optional: If you aren't using the typography plugin, you can style the text manually */
.prose p {
  font-size: 1.5rem; /* Corresponds to text-2xl */
  font-weight: 600; /* Corresponds to font-semibold */
}
</style>