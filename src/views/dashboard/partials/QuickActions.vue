<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';
import { RouterLink } from 'vue-router';

// Define props to accept Component type for icons and robust route objects
defineProps<{
    quickActions: { 
        title: string; 
        icon: Component; 
        to: string | { name: string };
    }[];
}>();
</script>

<template>
    <div class="quick-actions-card">
        <!-- Header -->
        <div class="p-6 border-b border-primary-800">
            <h3 class="text-lg font-bold section-title tracking-tight">
                Quick Actions
            </h3>
        </div>

        <!-- List -->
        <div class="p-3">
            <RouterLink
                v-for="action in quickActions"
                :key="action.title"
                :to="action.to"
                class="action-item group"
            >
                <div class="flex items-center gap-4">
                    <!-- Icon Container -->
                    <div class="action-icon-box">
                        <component 
                            :is="action.icon" 
                            class="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-300" 
                        />
                    </div>
                    
                    <span class="font-medium text-secondary group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                        {{ action.title }}
                    </span>
                </div>

                <!-- Animated Chevron -->
                <ChevronRight class="w-4 h-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500" />
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.quick-actions-card {
    @apply rounded-2xl overflow-hidden;
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow-md);
}

.action-item {
    @apply flex items-center justify-between p-3 rounded-xl transition-all duration-300;
    /* Transparent border to prevent layout jump on hover if we added a border later */
    border: 1px solid transparent;
}

.action-item:hover {
    /* Subtle theme-based background tint */
    background-color: color-mix(in srgb, var(--color-primary-500) 8%, transparent);
    border-color: color-mix(in srgb, var(--color-primary-500) 20%, transparent);
}

.action-icon-box {
    @apply flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300;
    background-color: var(--section-bg);
    border: 1px solid var(--border-muted);
}

.action-item:hover .action-icon-box {
    background: var(--gradient-primary);
    border-color: transparent;
    box-shadow: 0 4px 12px -2px color-mix(in srgb, var(--color-primary-600) 40%, transparent);
}

/* Text Utilities mapping */
.section-title { color: var(--section-title-color); }
.text-secondary { color: var(--section-text-color); }
.text-muted { color: var(--text-muted); }
.border-muted { border-color: var(--border-muted); }
</style>