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
    <div>
        <HeroSection />
        <SectionDivider variant="wave" accent="primary" />
        <AboutSummarySection />
        <SectionDivider variant="diagonal" accent="secondary" />
        <FeaturedProductsSection />
        <SectionDivider variant="dots" accent="accent" />
        <VerticalIntegrationSection />
        <SectionDivider variant="wave" accent="secondary" flip />
        <CustomerTestimonials />
        <SectionDivider variant="diagonal" accent="primary" />
        <CtaSection />
    </div>
</template>