<script setup lang="ts">
import LoadingState from '@/components/loading/LoadingState.vue';
import type { Leader } from '@/types';
import { RouterLink } from 'vue-router';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
defineProps<{ leaders: Leader[] }>();
</script>

<template>
    <section class="py-20 bg-secondary-100 sm:py-24 dark:bg-pink-100">
        <div class="container px-4 mx-auto">
            <div class="max-w-3xl mx-auto mb-16 text-center">
                <h2 class="text-3xl font-bold sm:text-4xl font-grotesk text-primary-900 dark:text-pink-900">Meet Our
                    Leadership</h2>
                <p class="mt-4 text-lg text-gray-600 dark:text-pink-800">
                    Guided by a passion for science and a commitment to patients, our experienced leadership team drives
                    our mission forward.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="(leader, index) in leaders" :key="leader.id"
                    class="text-center border border-secondary-1250 dark:border-pink-700 rounded-2xl p-4 group wow animate__animated animate__fadeInUp transition-all duration-300 hover:scale-105"
                    :data-wow-delay="`${index * 0.1}s`">
                    <div class="relative inline-block mb-4">
                        <div class="w-40 h-40 mx-auto overflow-hidden rounded-full shadow-lg">
                            <img :src="leader.image_url ?? leader.image_thumbnail_url ?? defaultProfileImage"
                                :alt="`Portrait of ${leader.name}`"
                                class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110">
                            <!-- <img v-if="leader.image_url || leader.image_thumbnail_url"
                                :src="leader.image_url ?? leader.image_thumbnail_url ?? '#'" 
                                :alt="`Portrait of ${leader.name}`" 
                                class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            >
                            <LoadingState v-else class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" text="Loading Image" /> -->
                        </div>
                        <!-- Decorative Accent -->
                        <div
                            class="absolute bottom-0 right-0 w-10 h-10 border-4 rounded-full border-secondary-200 dark:border-pink-100 bg-secondary-1250 dark:bg-pink-900">
                        </div>
                    </div>

                    <h3 class="text-xl font-bold font-grotesk text-primary-900 dark:text-pink-950">{{ leader.name }}</h3>
                    <p class="text-secondary-1200 dark:text-pink-400">{{ leader.position }}</p>

                    <!-- Optional: Link to a detailed leader page -->
                    <RouterLink :to="{ name: 'about.leader-detail', params: { id: leader.id } }"
                        class="inline-block mt-2 text-sm font-semibold text-secondary-1200 transition-colors dark:text-pink-700 hover:text-primary-1200">
                        View Bio &rarr;
                    </RouterLink>
                </div>
            </div>

            <!-- Optional CTA to see the full team -->
            <div class="mt-16 text-center">
                <RouterLink :to="{ name: 'about.leadership-team' }"
                    class="inline-block px-8 py-3 text-lg font-semibold transition-transform transform rounded-full bg-secondary-1000 dark:bg-pink-900 text-primary-1200 dark:text-pink-50 hover:bg-secondary-1200 hover:scale-105">
                    See The Full Team
                </RouterLink>
            </div>
        </div>
    </section>
</template>