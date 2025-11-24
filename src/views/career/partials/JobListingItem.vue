<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDownIcon, MapPinIcon, Building2Icon, ClockIcon } from 'lucide-vue-next';
import type { JobOpening } from '@/types';

const props = defineProps<{
    job: JobOpening;
}>();
defineEmits(['apply-now']);
const isOpen = ref(false);
</script>

<template>
    <div 
        class="job-item card-bg"
        :class="{ 'job-item--open': isOpen }"
    >
        <button 
            @click="isOpen = !isOpen" 
            class="job-item__header"
        >
            <div class="flex-grow text-left">
                <h3 class="job-item__title">
                    {{ job.title }}
                </h3>
                <!-- Metadata styled as chips -->
                <div class="flex flex-wrap items-center gap-2 mt-2">
                    <span class="job-item__chip">
                        <Building2Icon class="w-4 h-4" />
                        {{ job.department }}
                    </span>
                    <span class="job-item__chip">
                        <MapPinIcon class="w-4 h-4" />
                        {{ job.location }}
                    </span>
                    <span class="job-item__chip">
                         <ClockIcon class="w-4 h-4" />
                        {{ job.type }}
                    </span>
                </div>
            </div>
            
            <div class="job-item__chevron">
                <ChevronDownIcon class="w-6 h-6 transition-transform duration-300" />
            </div>
        </button>
        
        <transition name="expand">
            <div v-show="isOpen" class="overflow-hidden">
                <div class="job-item__body">
                    <div class="prose dark:prose-invert max-w-none prose-h4:font-semibold prose-h4:section-title section-title">
                        <p>{{ job.description }}</p>

                        <h4 class="font-semibold">Key Responsibilities</h4>
                        <ul class="list-disc pl-8">
                            <li v-for="(item, i) in job.responsibilities" :key="`resp-${i}`">{{ item }}</li>
                        </ul>
                        
                        <h4 class="font-semibold">Qualifications</h4>
                        <ul class="list-disc pl-8">
                            <li v-for="(item, i) in job.qualifications" :key="`qual-${i}`">{{ item }}</li>
                        </ul>
                    </div>
                    
                    <button @click="$emit('apply-now', job)" class="btn btn-primary mt-6">
                        Apply for this Position
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.job-item {
    @apply rounded-xl border border-muted shadow-sm overflow-hidden transition-all duration-300;
}
.job-item--open {
    @apply shadow-xl;
    border-color: var(--color-primary-400);
}

.job-item__header {
    @apply flex items-center justify-between w-full p-6 transition-colors duration-200;
}
.job-item:not(.job-item--open):hover .job-item__header {
    background-color: color-mix(in srgb, var(--btn-secondary-hover) 50%, transparent);
}

.job-item__title {
    @apply text-xl font-bold section-title;
    transition: color 0.2s;
}
.job-item--open .job-item__title {
    /* color: var(--section-title-color); */
    color: var(--color-primary-600);
}
:global(.dark) .job-item--open .job-item__title {
    color: var(--color-primary-400);
}

.job-item__chip {
    @apply inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full;
    background-color: color-mix(in srgb, var(--color-primary-500) 8%, transparent);
    color: var(--section-title-color);
    /* color: color-mix(in srgb, var(--text-muted) 100%, black); */
}
:global(.dark) .job-item__chip {
    color: var(--text-muted);
}

.job-item__chevron {
    @apply section-title;
}
.job-item--open .job-item__chevron {
    transform: rotate(180deg);
    color: var(--color-primary-500);
}

.job-item__body {
    @apply p-6 border-t border-muted;
}

/* Smooth expand/collapse transition */
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}
.expand-enter-active {
    animation: expand-in 0.3s ease-in-out;
}
.expand-leave-active {
    animation: expand-in 0.3s ease-in-out reverse;
}
@keyframes expand-in {
    from { height: 0; }
    to { height: var(--height); }
}
</style>