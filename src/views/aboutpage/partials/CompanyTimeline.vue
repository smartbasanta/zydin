<script setup lang="ts">
import type { TimelineEvent } from '@/types';

defineProps<{ events: TimelineEvent[] }>();
</script>
<template>
    <section class="py-20 bg-gradient-to-b from-secondary-300 dark:from-pink-100 to-secondary-200 dark:to-pink-300 sm:py-24">
        <div class="container px-4 mx-auto">
            <h2 class="mb-16 text-3xl font-bold text-center sm:text-4xl text-secondary-1200 dark:text-pink-900">Our Journey of Innovation</h2>
            <div class="relative max-w-2xl mx-auto">
                <!-- The Vertical Line -->
                <div class="absolute top-0 h-full border-r-4 left-4 md:left-1/2 border-secondary-1200 dark:border-pink-900"></div>
                
                <!-- Timeline Items -->
                <div v-for="(event, index) in events" :key="event.year" class="relative mb-12">
                    <div class="flex items-center" :class="index % 2 === 0 ? 'md:flex-row-reverse' : ''">
                        <!-- Dot on the line -->
                        <div class="absolute z-10 flex items-center justify-center w-8 h-8 rounded-full left-4 md:left-1/2 bg-secondary-1200 dark:bg-pink-300 text-primary-1200 dark:text-pink-900 -translate-x-1/2 ring-8 ring-secondary-400 dark:ring-pink-900">
                           <i class="i-lucide-flag"></i>
                        </div>
                        
                        <!-- Content Card -->
                        <div class="group transition-all delay-500 duration-1000 w-full pl-6 md:pl-2 md:pr-2 md:w-1/2" :class="index % 2 === 0 ? ' md:text-right' : ''">
                             <div class="p-6 bg-secondary-400 dark:bg-pink-900 rounded-lg shadow-lg">
                                <p class="mb-1 text-sm font-semibold text-secondary-1250 dark:text-secondary-400">{{ event.year }}</p>
                                <h3 class="mb-2 text-xl font-bold text-primary-1100 dark:text-white">{{ event.event_title }}</h3>
                                <p class="hidden text-secondary-1250 dark:text-primary-100 group-hover:flex">{{ event.event_description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>