<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { LinkedinIcon, TwitterIcon, ArrowLeftIcon } from 'lucide-vue-next';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useLeadersAPI } from '@/composables/fetch-public-apis/useLeadersAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
const route = useRoute();
const leaderId = route.params.id as string;

const { leader, isLoading, fetchLeaderById } = useLeadersAPI();

onMounted(() => {
    fetchLeaderById(leaderId);
});
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-screen">
            <LoadingState message="Loading Profile..." />
        </div>

        <!-- Content -->
        <div v-else-if="leader">
            <main class="container max-w-6xl px-4 py-16 mx-auto sm:py-24">
                <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    
                    <!-- Left Sticky Column (Profile Card) -->
                    <aside class="lg:col-span-1 lg:sticky top-24 self-start">
                        <div class="p-8 text-center bg-white border rounded-lg shadow-xl border-primary-100 dark:bg-primary-1000 dark:border-primary-900">
                            <img 
                                :src="leader.image_url ?? leader.image_thumbnail_url ?? defaultProfileImage" 
                                :alt="`Portrait of ${leader.name}`" 
                                class="object-cover w-40 h-40 mx-auto mb-4 border-4 rounded-full border-white dark:border-primary-900 ring-4 ring-secondary-500"
                            >
                            <h1 class="text-3xl font-bold font-grotesk text-primary-900 dark:text-white">{{ leader.name }}</h1>
                            <p class="mb-4 text-secondary-600 dark:text-secondary-400">{{ leader.position }}</p>
                            
                            <div v-if="leader.socials" class="flex items-center justify-center space-x-4">
                                <a v-if="leader.socials.linkedin" :href="leader.socials.linkedin" target="_blank" rel="noopener noreferrer" class="transition-colors text-primary-400 hover:text-sky-600">
                                    <LinkedinIcon class="w-6 h-6" />
                                </a>
                                <a v-if="leader.socials.twitter" :href="leader.socials.twitter" target="_blank" rel="noopener noreferrer" class="transition-colors text-primary-400 hover:text-sky-500">
                                    <TwitterIcon class="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </aside>

                    <!-- Right Content Column -->
                    <article class="space-y-12 lg:col-span-2">
                        <section v-if="leader.quote">
                            <blockquote class="relative p-6 text-xl italic leading-relaxed border-l-4 text-primary-800 bg-primary-50 border-secondary-500 dark:text-primary-200 dark:bg-primary-1000">
                                <span class="absolute top-0 left-0 text-6xl font-bold opacity-10 text-secondary-500">&ldquo;</span>
                                {{ leader.quote }}
                            </blockquote>
                        </section>
                        
                        <section v-if="leader.bio">
                            <h2 class="text-2xl font-bold border-b font-grotesk text-primary-900 dark:text-white border-primary-200 dark:border-primary-900 pb-2 mb-4">About {{ leader.name.split(' ')[0] }}</h2>
                            <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-primary-300" v-html="leader.bio.replace(/\n/g, '<p></p>')"></div>
                        </section>
                        
                        <section v-if="leader.career_highlights">
                            <h2 class="text-2xl font-bold border-b font-grotesk text-primary-900 dark:text-white border-primary-200 dark:border-primary-900 pb-2 mb-4">Career Highlights</h2>
                            <dl class="space-y-4 text-gray-600 dark:text-primary-300">
                                <div v-for="(value, key) in leader.career_highlights" :key="key">
                                    <dt class="font-semibold text-primary-900 dark:text-white">{{ key }}</dt>
                                    <dd class="pl-4 border-l-2 border-primary-100 dark:border-primary-900">{{ value }}</dd>
                                </div>
                            </dl>
                        </section>

                        <section v-if="leader.education">
                            <h2 class="text-2xl font-bold border-b font-grotesk text-primary-900 dark:text-white border-primary-200 dark:border-primary-900 pb-2 mb-4">Education</h2>
                            <dl class="space-y-4 text-gray-600 dark:text-primary-300">
                                <div v-for="(value, key) in leader.education" :key="key">
                                    <dt class="font-semibold text-primary-900 dark:text-white">{{ key }}</dt>
                                    <dd class="pl-4 border-l-2 border-primary-100 dark:border-primary-900">{{ value }}</dd>
                                </div>
                            </dl>
                        </section>

                        <div class="pt-8 border-t border-primary-200 dark:border-primary-900">
                            <RouterLink :to="{ name: 'about.leadership-team' }" class="inline-flex items-center font-semibold transition-colors text-secondary-600 hover:text-secondary-500">
                                <ArrowLeftIcon class="w-5 h-5 mr-2" />
                                Back to Leadership Team
                            </RouterLink>
                        </div>
                    </article>
                </div>
            </main>
        </div>

        <!-- Fallback if leader not found -->
        <div v-else class="text-center py-24">
            <h1 class="text-2xl font-bold">Leader Not Found</h1>
            <p class="mt-4">The profile you are looking for does not exist or could not be loaded.</p>
            <RouterLink :to="{ name: 'about.leadership-team' }" class="inline-block px-6 py-2 mt-6 text-white rounded-md bg-secondary-600">
                Return to Leadership Team
            </RouterLink>
        </div>
    </div>
</template>