<script setup lang="ts">
import { onMounted } from 'vue';
import AboutHero from './partials/AboutHero.vue';
import MissionVisionSection from './partials/MissionVisionSection.vue';
import CoreValuesSection from './partials/CoreValuesSection.vue';
import CompanyTimeline from './partials/CompanyTimeline.vue';
import LeadershipPreview from './partials/LeadershipPreview.vue';
import EmployeeLifeSection from './partials/EmployeeLifeSection.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { usePageDataAPI } from '@/composables/fetch-public-apis/usePageDataAPI';

const { aboutPageData, isLoading, fetchAboutPageData } = usePageDataAPI();

onMounted(fetchAboutPageData);
</script>

<template>
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
        <LoadingState message="Loading Our Story..." />
    </div>

    <div v-else-if="aboutPageData" class="bg-white dark:bg-primary-1200">
        <AboutHero :summary="aboutPageData.content.summary.content.value" />
        
        <MissionVisionSection
            :mission="aboutPageData.content.mission_statement.content.value"
            :vision="aboutPageData.content.company_vision.content.value"
        />

        <CoreValuesSection :values="aboutPageData.content.core_values.content" />

        <CompanyTimeline :events="aboutPageData.content.timeline.content" />

        <LeadershipPreview :leaders="aboutPageData.leaders" />
        
        <EmployeeLifeSection :testimonials="aboutPageData.employeeTestimonials" />
    </div>

    <div v-else class="text-center py-20">
        <p>Could not load page content. Please try again later.</p>
    </div>
</template>