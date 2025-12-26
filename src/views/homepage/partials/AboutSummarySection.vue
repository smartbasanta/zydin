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
    return aboutPageData.value?.content.summary.content ?? 'Loading...';
})
onMounted(async () => {
    await fetchAboutPageData();
});
</script>

<template>
    <section class="py-20 md:py-28 clip-path-section relative overflow-hidden section-bg about-section">
        <div class="about-section__glow about-section__glow--primary" aria-hidden="true"></div>
        <div class="about-section__glow about-section__glow--secondary" aria-hidden="true"></div>
        <div class="about-section__grid" aria-hidden="true"></div>
        <div class="container items-center mx-auto px-6 relative z-10">
          <div class="flex flex-col items-center mb-16">
            <h1 class="text-3xl md:text-4xl font-bold text-center section-title mb-4">
                About Zydin Biotech
            </h1>
            <div class="w-16 h-1 bg-current section-title rounded-full"></div>
          </div>

          <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div class="flex-1 max-w-2xl">
              <div class="card-backdrop about-section__card p-8 md:p-10">
                <p class="text-lg md:text-xl leading-relaxed about-section__summary font-medium">
                  {{ summary }}
                </p>
              </div>
            </div>

            <div class="flex-1 max-w-md mx-auto lg:mx-0">
                <div class="relative">
                    <div class="relative card-backdrop about-section__logo-card p-8">
                        <div class="aspect-square relative">
                            <AppLogoAnimation :glow="true" :animation="true" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="px-4 mt-16 text-center">
                <RouterLink :to="{ name: 'products' }" class="cta-pill">
                    View Our Full Catalog
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.about-section {
  position: relative;
}
.about-section__grid {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--section-title-color) 6%, transparent) 1px, transparent 1px),
    linear-gradient(0deg, color-mix(in srgb, var(--section-title-color) 6%, transparent) 1px, transparent 1px);
  background-size: 80px 80px;
  mix-blend-mode: soft-light;
}
.about-section__glow {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 9999px;
  filter: blur(120px);
  opacity: 0.35;
  pointer-events: none;
}
.about-section__glow--primary {
  top: -40px;
  left: 5%;
  background: var(--gradient-primary);
}
.about-section__glow--secondary {
  bottom: -80px;
  right: 10%;
  background: var(--gradient-secondary);
}
.about-section__card {
  border-color: color-mix(in srgb, var(--section-title-color) 25%, transparent);
  background-color: color-mix(in srgb, var(--section-bg) 80%, transparent);
}
.about-section__summary {
  color: color-mix(in srgb, var(--section-title-color) 85%, var(--section-text-color));
  text-shadow: 0 8px 25px color-mix(in srgb, var(--section-title-color) 15%, transparent);
}
.about-section__logo-card {
  border-color: color-mix(in srgb, var(--section-title-color) 20%, transparent);
  background: color-mix(in srgb, var(--section-bg) 65%, var(--section-title-color) 5%);
  box-shadow: 0 35px 65px -45px color-mix(in srgb, var(--section-title-color) 60%, transparent);
}
.about-section__logo-card::after {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 1.5rem;
  border: 1px dashed color-mix(in srgb, var(--section-title-color) 20%, transparent);
  pointer-events: none;
  opacity: 0.5;
}
/* The "View Full Catalog" Button */
.cta-pill {
  @apply inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300;
  background-image: var(--gradient-secondary); /* Uses the teal/blue pharma gradient */
  color: white;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--color-secondary-500) 30%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px color-mix(in srgb, var(--color-secondary-500) 50%, transparent);
  filter: brightness(1.05);
}
</style>