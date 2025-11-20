<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon, MapPinIcon, Building2Icon, ClockIcon } from 'lucide-vue-next';
import type { JobOpening } from '@/types';

defineProps<{
    job: JobOpening;
}>();

const emit = defineEmits(['apply-now']);

const isOpen = ref(false);
</script>

<template>
    <div 
        class="overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-sm border-primary-100 dark:bg-primary-1000 dark:border-primary-900"
        :class="{ 'shadow-xl dark:shadow-primary-800/20': isOpen }"
    >
        <!-- Clickable Header -->
        <button 
            @click="isOpen = !isOpen" 
            class="flex items-center justify-between w-full p-6 text-left transition-colors group hover:bg-primary-50 dark:hover:bg-primary-900/50"
        >
            <!-- Job Title and Metadata -->
            <div class="flex-grow">
                <h3 class="text-xl font-bold font-grotesk text-primary-900 dark:text-white group-hover:text-secondary-700">
                    {{ job.title }}
                </h3>
                <div class="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500 md:gap-4 dark:text-primary-400">
                    <span class="flex items-center gap-1.5">
                        <Building2Icon class="w-4 h-4" />
                        {{ job.department }}
                    </span>
                    <span class="hidden w-1 h-1 rounded-full md:block bg-primary-200 dark:bg-primary-800"></span>
                    <span class="flex items-center gap-1.5">
                        <MapPinIcon class="w-4 h-4" />
                        {{ job.location }}
                    </span>
                    <span class="hidden w-1 h-1 rounded-full md:block bg-primary-200 dark:bg-primary-800"></span>
                    <span class="flex items-center gap-1.5">
                         <ClockIcon class="w-4 h-4" />
                        {{ job.type }}
                    </span>
                </div>
            </div>
            
            <!-- Chevron Icon -->
            <div class="flex-shrink-0 ml-4">
                <ChevronDownIcon 
                    class="w-6 h-6 text-primary-400 transition-transform duration-300 ease-in-out" 
                    :class="{ 'rotate-180 text-secondary-500': isOpen }" 
                />
            </div>
        </button>
        
        <!-- Collapsible Content Body -->
        <transition
            name="expand"
            @enter="el => (el as HTMLElement).style.height = el.scrollHeight + 'px'"
            @after-enter="el => (el as HTMLElement).style.height = 'auto'"
            @before-leave="el => (el as HTMLElement).style.height = el.scrollHeight + 'px'"
            @after-leave="el => (el as HTMLElement).style.height = '0px'"
        >
            <div v-show="isOpen" class="overflow-hidden">
                <div class="p-6 border-t border-primary-100 dark:border-primary-900">
                    <div class="prose dark:prose-invert max-w-none prose-h4:font-grotesk prose-h4:text-primary-900 prose-h4:dark:text-white">
                        <p>{{ job.description }}</p>

                        <h4>Key Responsibilities</h4>
                        <ul>
                            <li v-for="(item, i) in job.responsibilities" :key="`resp-${i}`">{{ item }}</li>
                        </ul>
                        
                        <h4>Qualifications</h4>
                        <ul>
                            <li v-for="(item, i) in job.qualifications" :key="`qual-${i}`">{{ item }}</li>
                        </ul>
                    </div>
                    
                    <button @click="$emit('apply-now', job)" class="inline-block mt-6 btn btn-primary">
                        Apply Now
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* Smooth expand/collapse transition */
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0 !important;
}
</style>