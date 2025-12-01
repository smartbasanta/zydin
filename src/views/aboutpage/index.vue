<script setup lang="ts">
import { onMounted } from 'vue';
import AboutHero from './partials/AboutHero.vue';
import MissionVisionSection from './partials/MissionVisionSection.vue';
import CoreValuesSection from './partials/CoreValuesSection.vue';
import CompanyTimeline from './partials/CompanyTimeline.vue';
import LeadershipPreview from './partials/LeadershipPreview.vue';
import EmployeeLifeSection from './partials/EmployeeLifeSection.vue';
import SectionDivider from '@/views/homepage/partials/SectionDivider.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { usePageDataAPI } from '@/composables/fetch-public-apis/usePageDataAPI';

const { aboutPageData, isLoading, fetchAboutPageData } = usePageDataAPI();

onMounted(fetchAboutPageData);
</script>

<template>
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
        <LoadingState message="Loading Our Story..." />
    </div>

    <div v-else-if="aboutPageData" class="about-page-shell">
        <AboutHero :summary="aboutPageData.content.summary.content.value" />
        <SectionDivider variant="wave" accent="primary" />
        <MissionVisionSection
            :mission="aboutPageData.content.mission_statement.content.value"
            :vision="aboutPageData.content.company_vision.content.value"
        />
        <SectionDivider variant="curve-glow" accent="secondary" />
        <CoreValuesSection :values="aboutPageData.content.core_values.content" />
        <SectionDivider variant="tilt-grid" accent="accent" />
        <CompanyTimeline :events="aboutPageData.content.timeline.content" />
        <SectionDivider variant="wave" accent="secondary" flip />
        <LeadershipPreview :leaders="aboutPageData.leaders" />
        <SectionDivider variant="curve-glow" accent="primary" />
        <EmployeeLifeSection :testimonials="aboutPageData.employeeTestimonials" />
    </div>

    <div v-else class="text-center py-20">
        <p>Could not load page content. Please try again later.</p>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.about-page-shell {
    background-color: var(--section-bg);
    color: var(--section-title-color);
}
</style>