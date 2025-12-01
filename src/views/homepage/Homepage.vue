<script setup lang="ts">
import HeroSection from './partials/HeroSection.vue';
import AboutSummarySection from './partials/AboutSummarySection.vue';
import VerticalIntegrationSection from './partials/VerticalIntegrationSection.vue';
import FeaturedProductsSection from './partials/FeaturedProductsSection.vue';
import CustomerTestimonials from './partials/CustomerTestimonials.vue';
import CtaSection from './partials/CtaSection.vue';
import SectionDivider from './partials/SectionDivider.vue';
</script>

<template>
    <div class="overflow-x-hidden"> <!-- Prevent scrollbars from animated elements -->
        
        <!-- 1. HERO SECTION -->
        <HeroSection />

        <!-- 
           DIVIDER 1: BIOTECH WAVE 
           - Placed between Hero (Dark) and About (Light).
           - We pull it up (-mt-32) to overlay the bottom of the Hero.
           - We color it to match the About section's background.
        -->
        <SectionDivider 
            variant="wave" 
            class="-mt-24 md:-mt-32 relative z-10 text-primary-50 dark:text-gray-1100 pointer-events-none" 
        />

        <!-- 2. ABOUT SECTION (Light Background) -->
        <AboutSummarySection class="relative z-20 -mt-1" />

        <!-- 
           DIVIDER 2: CURVE GLOW 
           - Between About (Light) and Featured (Light/Patterned).
           - Adds a subtle glowing curve to separate content without harsh lines.
        -->
        <SectionDivider 
            variant="wave" 
            class="-mt-16 relative z-30 text-gray-50 dark:text-gray-1100 pointer-events-none" 
        />

        <!-- 3. FEATURED PRODUCTS -->
        <FeaturedProductsSection class="relative z-20" />

        <!-- 
            DIVIDER 3: TILT GRID
            - Between Featured and Vertical Integration.
            - Gives a technical/scientific feel.
        -->
        <SectionDivider 
            variant="tilt-grid" 
            class="-mt-20 relative z-10 text-gray-50 dark:text-gray-1100 pointer-events-none" 
        />

        <!-- 4. VERTICAL INTEGRATION -->
        <VerticalIntegrationSection class="relative z-20" />

        <!-- 
            DIVIDER 4: BIOTECH WAVE (Flipped)
            - Between Integration and Testimonials.
            - Flipped to look like it's dripping down or rising differently.
        -->
        <SectionDivider 
            variant="wave" 
            :flip="true"
            class="-mt-24 md:-mt-32 relative z-10 text-gray-50 dark:text-gray-1100 pointer-events-none" 
        />

        <!-- 5. TESTIMONIALS -->
        <CustomerTestimonials class="relative z-20 -mt-1" />

        <!-- 
            DIVIDER 5: CURVE GLOW
            - Leading into the final CTA.
        -->
        <SectionDivider 
            variant="curve-glow" 
            class="-mt-16 relative z-10 text-gray-50 dark:text-gray-1100 pointer-events-none" 
        />

        <!-- 6. CTA SECTION -->
        <CtaSection class="relative z-20" />
    </div>
</template>

<style scoped>
/* 
   Note: The classes `text-gray-50` and `dark:text-gray-1100` 
   assume those correspond to your theme's section background colors.
   
   If your sections use different variables (like var(--section-bg)), 
   you can apply a style binding instead:
   :style="{ color: 'var(--section-bg)' }"
*/
</style>