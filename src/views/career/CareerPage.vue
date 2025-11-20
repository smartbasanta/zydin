<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import JobListingItem from './partials/JobListingItem.vue';
import ApplyForCareerModal from './partials/ApplyForCareerModal.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { LightbulbIcon, TrendingUpIcon, HeartIcon, UsersIcon } from 'lucide-vue-next';
import { useCareerAPI } from '@/composables/fetch-public-apis/useCareerAPI';
import type { JobOpening } from '@/types';

const benefits = [
    { icon: LightbulbIcon, title: 'Innovate with Purpose', text: 'Work on challenging problems that directly impact patient lives and advance the field of oncology.' },
    { icon: TrendingUpIcon, title: 'Professional Growth', text: 'We invest in our people with continuous learning opportunities, mentorship, and clear career paths.' },
    { icon: HeartIcon, title: 'Impactful Work', text: 'Be part of a mission-driven company making high-quality healthcare accessible in Nepal and beyond.' },
    { icon: UsersIcon, title: 'Collaborative Culture', text: 'Join a diverse and inclusive team of experts who value teamwork, respect, and open communication.' },
];

const { jobs, isLoading, fetchJobs } = useCareerAPI();

onMounted(fetchJobs);

const selectedDept = ref('');
const selectedType = ref('');

// Filters are now dynamically generated from the live job data
const departments = computed(() => [...new Set(jobs.value.map(j => j.department))].sort());
const types = computed(() => [...new Set(jobs.value.map(j => j.type))].sort());

const filteredJobs = computed(() => {
    return jobs.value.filter(job => {
        const deptMatch = selectedDept.value ? job.department === selectedDept.value : true;
        const typeMatch = selectedType.value ? job.type === selectedType.value : true;
        return deptMatch && typeMatch;
    });
});

const isApplicationModalOpen = ref(false);
const selectedJobForApplication = ref<JobOpening | null>(null);

const openApplicationModal = (job: JobOpening) => {
    selectedJobForApplication.value = job;
    isApplicationModalOpen.value = true;
};

const closeApplicationModal = () => {
    isApplicationModalOpen.value = false;
};
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Header -->
        <header class="py-20 text-center bg-primary-50 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk text-primary-900 dark:text-white">Shape the Future of Oncology</h1>
                <p class="max-w-2xl mx-auto mt-4 text-lg text-gray-600 dark:text-primary-300">
                    Join our passionate team and contribute to a mission that matters. Discover your next opportunity at Zydin Biotech.
                </p>
            </div>
        </header>

        <!-- Why Work With Us Section -->
        <section class="py-20 bg-white dark:bg-primary-1200">
            <div class="container px-4 mx-auto">
                <h2 class="mb-12 text-3xl font-bold text-center sm:text-4xl font-grotesk text-primary-900 dark:text-white">Why Join Zydin?</h2>
                <div class="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4">
                    <div v-for="item in benefits" :key="item.title" class="p-6 text-center">
                        <div class="inline-block p-4 mb-4 rounded-full bg-secondary-100 dark:bg-secondary-900/50">
                            <component :is="item.icon" class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <h3 class="text-xl font-semibold font-grotesk text-primary-900 dark:text-white">{{ item.title }}</h3>
                        <p class="text-gray-600 dark:text-primary-300">{{ item.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Job Listings -->
        <main class="py-20 bg-primary-50 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h2 class="mb-12 text-3xl font-bold text-center sm:text-4xl font-grotesk text-primary-900 dark:text-white">Current Openings</h2>
                
                <div v-if="isLoading" class="flex items-center justify-center h-64">
                    <LoadingState message="Loading Open Positions..." />
                </div>
                
                <div v-else-if="jobs.length > 0">
                    <!-- Filters -->
                    <div class="flex flex-col gap-4 mx-auto mb-8 sm:flex-row max-w-2xl">
                        <select v-model="selectedDept" class="input">
                            <option value="">All Departments</option>
                            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                        </select>
                        <select v-model="selectedType" class="input">
                            <option value="">All Types</option>
                            <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
                        </select>
                    </div>

                    <!-- List -->
                    <div class="max-w-4xl mx-auto space-y-4">
                        <JobListingItem v-for="job in filteredJobs" :key="job.id" :job="job" @apply-now="openApplicationModal" />
                        <div v-if="filteredJobs.length === 0" class="p-12 text-center bg-white rounded-lg dark:bg-primary-1000">
                            <p class="text-gray-500">No open positions match your criteria. Please check back later.</p>
                        </div>
                    </div>
                </div>
                
                <div v-else class="text-center p-12 bg-white rounded-lg dark:bg-primary-1000 max-w-4xl mx-auto">
                    <p class="text-lg text-gray-500">There are currently no open positions. We encourage you to check back soon for new opportunities.</p>
                </div>
            </div>
        </main>
        
        <ApplyForCareerModal 
            :is-open="isApplicationModalOpen" 
            :job="selectedJobForApplication" 
            @close="closeApplicationModal"
        />
    </div>
</template>