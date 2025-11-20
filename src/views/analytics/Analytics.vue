<script setup lang="ts">
    import { ref } from 'vue';
    import Header from './partials/Header.vue';
    import KeyMetrics from './partials/KeyMetrics.vue';
    import FinancialOverview from './partials/FinancialOverview.vue';
    import MostActiveGames from './partials/MostActiveGames.vue';
    import UserDemographics from './partials/UserDemographics.vue';
    import TopEarners from './partials/TopEarners.vue';
    import UserRetention from './partials/UserRetention.vue';
    import EventParticipation from './partials/EventParticipation.vue';

    const timeRanges = ref(['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time']);
    const selectedTimeRange = ref('Last 30 Days');

</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-gray-1200 text-gray-700 dark:text-gray-300 font-grotesk selection:bg-orange-500/30 selection:text-orange-300">
        <Header :timeRanges="timeRanges" :selectedTimeRange="selectedTimeRange" />
        <KeyMetrics />
        <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div class="xl:col-span-3 space-y-8">
                <FinancialOverview />
                <MostActiveGames />
                <UserRetention />
            </div>
            <div class="xl:col-span-2 space-y-8">
                <UserDemographics />
                <EventParticipation />
            </div>
        </div>
    </div>
</template>