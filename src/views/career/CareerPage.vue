<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import JobListingItem from './partials/JobListingItem.vue';
import ApplyForCareerModal from './partials/ApplyForCareerModal.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { LightbulbIcon, TrendingUpIcon, HeartIcon, UsersIcon } from 'lucide-vue-next';
import { useCareerAPI } from '@/composables/fetch-public-apis/useCareerAPI';
import type { JobOpening } from '@/types';
import SelectInput from '@/components/form/SelectInput.vue'; // Import the component

const benefits = [
    { icon: LightbulbIcon, title: 'Innovate with Purpose', text: 'Work on challenging problems that directly impact patient lives and advance the field of oncology.' },
    { icon: TrendingUpIcon, title: 'Professional Growth', text: 'We invest in our people with continuous learning opportunities, mentorship, and clear career paths.' },
    { icon: HeartIcon, title: 'Impactful Work', text: 'Be part of a mission-driven company making high-quality healthcare accessible.' },
    { icon: UsersIcon, title: 'Collaborative Culture', text: 'Join a diverse and inclusive team of experts who value teamwork, respect, and open communication.' },
];

const { jobs, isLoading, fetchJobs } = useCareerAPI();

onMounted(fetchJobs);

const selectedDept = ref('');
const selectedType = ref('');

// Departments and Types are simple string arrays, which SelectInput handles perfectly (Case 1)
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
    <div class="section-bg">
        <!-- Modern Hero Header -->
        <header class="career-hero">
            <div class="career-hero__glow career-hero__glow--primary" aria-hidden="true"></div>
            <div class="career-hero__glow career-hero__glow--secondary" aria-hidden="true"></div>
            <div class="container mx-auto px-6 py-20 md:py-28 text-center relative z-10">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow-lg">Shape the Future of Oncology</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-white/90 text-shadow-md">
                    Join our passionate team and contribute to a mission that matters. Discover your next opportunity at Zydin Biotech.
                </p>
            </div>
        </header>

        <!-- "Why Join Zydin?" Section -->
        <section class="py-20 md:py-28">
            <div class="container px-6 mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold section-title">Why Join Zydin Biotech?</h2>
                </div>
                <div class="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4">
                    <div v-for="item in benefits" :key="item.title" class="card-backdrop text-center p-8">
                        <div class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-secondary shadow-lg">
                            <component :is="item.icon" class="w-8 h-8 text-white" />
                        </div>
                        <h3 class="text-xl font-bold section-title mb-2">{{ item.title }}</h3>
                        <p class="section-title leading-relaxed">{{ item.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Job Listings -->
        <main id="openings" class="py-20 md:py-28 section-bg border-y border-muted">
            <div class="container px-6 mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold section-title">Current Openings</h2>
                </div>
                
                <div v-if="isLoading" class="flex items-center justify-center h-64">
                    <LoadingState message="Loading Open Positions..." />
                </div>
                
                <div v-else-if="jobs.length > 0">
                    
                    <!-- Modern Filters using SelectInput -->
                    <div class="grid sm:grid-cols-2 gap-6 mx-auto mb-10 max-w-3xl p-6 rounded-2xl border border-muted card-backdrop">
                        <SelectInput
                            v-model="selectedDept"
                            :options="departments"
                            placeholder="All Departments"
                            label="Department"
                        />
                        <SelectInput
                            v-model="selectedType"
                            :options="types"
                            placeholder="All Types"
                            label="Job Type"
                        />
                    </div>

                    <div class="max-w-4xl mx-auto space-y-4">
                        <JobListingItem v-for="job in filteredJobs" :key="job.id" :job="job" @apply-now="openApplicationModal" />
                        <div v-if="filteredJobs.length === 0" class="text-center p-12 rounded-lg bg-gray-100 dark:bg-gray-1000">
                            <p class="section-title">No open positions match your criteria. Please check back later or adjust your filters.</p>
                        </div>
                    </div>
                </div>
                
                <div v-else class="text-center p-12 card-backdrop max-w-4xl mx-auto">
                    <p class="text-lg section-title">There are currently no open positions. We encourage you to check back soon for new opportunities.</p>
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

<style scoped>
@reference "@/assets/css/main.css";

.career-hero {
    position: relative;
    overflow: hidden;
    background-image: var(--gradient-hero);
}

.career-hero__glow {
    position: absolute;
    border-radius: 9999px;
    filter: blur(120px);
    pointer-events: none;
}
.career-hero__glow--primary {
    background: var(--gradient-accent);
    width: 350px; height: 350px;
    top: -100px; left: -100px; opacity: 0.4;
}
.career-hero__glow--secondary {
    background: var(--gradient-secondary);
    width: 300px; height: 300px;
    bottom: -100px; right: -50px; opacity: 0.3;
}
.text-shadow-lg { text-shadow: 0 4px 15px rgba(0,0,0,0.4); }
.text-shadow-md { text-shadow: 0 2px 5px rgba(0,0,0,0.3); }
</style>