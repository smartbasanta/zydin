<script setup lang="ts">
import { ArrowUpRight, ArrowDownRight, MinusIcon } from 'lucide-vue-next';
import type { Component } from 'vue';

// Define a specific type for the props
interface StatItem {
    title: string;
    value: string;
    change: string;
    icon: Component;
    theme: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    changeType: 'increase' | 'decrease' | 'neutral';
}

defineProps<{
    stats: StatItem[];
}>();

// Mapping semantic names to your specific Theme CSS variables/gradients
const themeStyles = {
    primary: {
        iconBg: 'var(--gradient-primary)',
        iconColor: 'text-white',
        ring: 'ring-[var(--color-primary-200)] dark:ring-[var(--color-primary-900)]'
    },
    secondary: {
        iconBg: 'var(--gradient-secondary)',
        iconColor: 'text-white',
        ring: 'ring-cyan-200 dark:ring-cyan-900'
    },
    success: {
        iconBg: 'linear-gradient(135deg, var(--color-success) 0%, #34d399 100%)',
        iconColor: 'text-white',
        ring: 'ring-emerald-200 dark:ring-emerald-900'
    },
    warning: {
        iconBg: 'linear-gradient(135deg, var(--color-warning) 0%, #fbbf24 100%)',
        iconColor: 'text-white',
        ring: 'ring-amber-200 dark:ring-amber-900'
    },
    error: {
        iconBg: 'linear-gradient(135deg, var(--color-error) 0%, #f87171 100%)',
        iconColor: 'text-white',
        ring: 'ring-red-200 dark:ring-red-900'
    },
    info: {
        iconBg: 'var(--gradient-secondary)',
        iconColor: 'text-white',
        ring: 'ring-blue-200 dark:ring-blue-900'
    }
};
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
            v-for="(stat, index) in stats"
            :key="index"
            class="stat-card group"
        >
            <div class="flex justify-between items-start">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-muted">{{ stat.title }}</p>
                    <p class="text-3xl font-bold section-title tracking-tight">{{ stat.value }}</p>
                </div>
                
                <!-- Icon Container with Gradient Background -->
                <div 
                    class="relative flex items-center justify-center w-12 h-12 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    :style="{ background: themeStyles[stat.theme].iconBg }"
                >
                    <component 
                        :is="stat.icon" 
                        class="w-6 h-6" 
                        :class="themeStyles[stat.theme].iconColor" 
                    />
                </div>
            </div>

            <!-- Change Indicator -->
            <div class="mt-4 flex items-center gap-2 text-xs font-medium">
                <span
                    class="flex items-center gap-1 px-2.5 py-1 rounded-full border transition-colors duration-200"
                    :class="{
                        'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': stat.changeType === 'increase',
                        'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20': stat.changeType === 'decrease',
                        'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700': stat.changeType === 'neutral',
                    }"
                >
                    <ArrowUpRight v-if="stat.changeType === 'increase'" class="w-3 h-3" />
                    <ArrowDownRight v-if="stat.changeType === 'decrease'" class="w-3 h-3" />
                    <MinusIcon v-if="stat.changeType === 'neutral'" class="w-3 h-3" />
                    {{ stat.change }}
                </span>
                <span class="text-muted">vs last period</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.stat-card {
    @apply relative p-6 rounded-2xl border transition-all duration-300;
    
    /* Use theme variables for background and border */
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-md);
    color: var(--section-title-color);
}

.stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--color-primary-300);
    box-shadow: var(--shadow-xl);
}

/* Dark mode specific overrides if variables aren't enough */
:global(.dark) .stat-card:hover {
    border-color: var(--color-primary-700);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}

/* Utility class mapping for text colors */
.text-muted {
    color: var(--text-muted);
}
.section-title {
    color: var(--section-title-color);
}
</style>