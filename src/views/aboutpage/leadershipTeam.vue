<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useLeadersAPI } from '@/composables/fetch-public-apis/useLeadersAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultMaleImage, defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
const { leaders, isLoading, fetchLeaders } = useLeadersAPI();

onMounted(fetchLeaders);

// Safely compute the CEO and other team members
const ceo = computed(() => leaders.value.find(l => l.position.includes('CEO')));
const teamMembers = computed(() => leaders.value.filter(l => !l.position.includes('CEO')));
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Page Header -->
        <header class="py-20 text-center text-white bg-primary-900 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk">Our Leadership</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-primary-200">
                    The experienced and dedicated team guiding Zydin Biotech towards a new era in oncology.
                </p>
            </div>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-40">
            <LoadingState message="Loading Team..." />
        </div>

        <div v-else-if="leaders.length > 0">
            <!-- Message from the CEO Section -->
            <section v-if="ceo" class="py-20 sm:py-24">
                <div class="container px-4 mx-auto">
                    <div class="grid items-center max-w-6xl gap-12 mx-auto lg:grid-cols-2">
                        <div class="wow animate__animated animate__fadeInLeft sticky top-3">
                            <img :src="ceo.image_url ?? ceo.image_thumbnail_url ?? defaultMaleImage" :alt="ceo.name"
                                class="object-cover w-full h-auto rounded-full shadow-xl">
                        </div>
                        <div class="wow animate__animated animate__fadeInRight">
                            <h2 class="mb-4 text-3xl font-bold font-grotesk text-primary-900 dark:text-white">A Message
                                from Our Founder & CEO</h2>
                            <blockquote class="pl-6 mb-6 border-l-4 border-secondary-500">
                                <p class="text-lg italic leading-relaxed text-gray-700 dark:text-primary-200">{{
                                    ceo.message }}</p>
                            </blockquote>
                            <div class="font-bold text-primary-900 dark:text-white">{{ ceo.name }}</div>
                            <div class="text-sm text-gray-500 dark:text-primary-400">{{ ceo.position }}</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Leadership Team Grid -->
            <section class="py-20 sm:py-24 bg-primary-50 dark:bg-primary-1100">
                <div class="container px-4 mx-auto">
                    <h2
                        class="mb-12 text-3xl font-bold text-center sm:text-4xl font-grotesk text-primary-900 dark:text-white">
                        Meet the Executive Team</h2>
                    <div class="grid max-w-6xl grid-cols-1 gap-10 mx-auto sm:grid-cols-2 lg:grid-cols-3">
                        <RouterLink v-for="(leader, index) in teamMembers" :key="leader.id"
                            :to="{ name: 'about.leader-detail', params: { id: leader.id } }"
                            class="block p-6 text-center transition-all duration-300 bg-white border rounded-lg shadow-md group border-primary-100 dark:bg-primary-1000 dark:border-primary-900 hover:shadow-xl hover:border-secondary-500/50 hover:-translate-y-2 wow animate__animated animate__fadeInUp"
                            :data-wow-delay="`${index * 0.1}s`">
                            <img
                                :src="leader.image_url ?? leader.image_thumbnail_url ?? defaultProfileImage"
                                :alt="`Portrait of ${leader.name}`"
                                class="object-cover w-32 h-32 mx-auto mb-4 transition-transform duration-300 border-4 rounded-full border-primary-100 dark:border-primary-900 group-hover:scale-105 group-hover:border-secondary-500">
                            
                            <h3 class="text-xl font-bold font-grotesk text-primary-900 dark:text-white">{{ leader.name
                                }}</h3>
                            <p class="text-gray-500 dark:text-primary-400">{{ leader.position }}</p>
                        </RouterLink>
                    </div>
                </div>
            </section>
        </div>

        <div v-else class="text-center py-24 text-gray-500">
            <p>Leadership information is currently unavailable.</p>
        </div>
    </div>
</template>