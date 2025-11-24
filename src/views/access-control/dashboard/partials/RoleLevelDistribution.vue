<script setup lang="ts">
import { computed } from 'vue';
import { BarChart3Icon, LayersIcon } from "lucide-vue-next";

const props = defineProps<{
    can: {
        viewAnyRole?: boolean
    } | undefined;
    roleLevelDistribution: Record<string, number>;
}>();

// Calculate total for percentage bars
const totalCount = computed(() => {
    return Object.values(props.roleLevelDistribution).reduce((acc, curr) => acc + curr, 0);
});

// Sort levels numerically (0, 1, 2...)
const sortedDistribution = computed(() => {
    return Object.entries(props.roleLevelDistribution)
        .sort(([levelA], [levelB]) => Number(levelA) - Number(levelB));
});

const getPercentage = (count: number) => {
    if (totalCount.value === 0) return 0;
    return Math.round((count / totalCount.value) * 100);
};
</script>

<template>
    <div v-if="can?.viewAnyRole" class="distribution-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <BarChart3Icon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Role Distribution</h3>
                <p class="text-xs text-muted">User count by access level</p>
            </div>
        </div>

        <!-- Body -->
        <div class="card-body">
            <!-- Empty State -->
            <div v-if="!sortedDistribution.length" class="empty-state">
                <div class="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-2">
                    <LayersIcon class="size-6" />
                </div>
                <p class="text-sm font-medium section-title">No Data</p>
                <p class="text-xs text-muted">Role distribution data is unavailable.</p>
            </div>

            <!-- Distribution List -->
            <div v-else class="list-container">
                <div 
                    v-for="([level, count]) in sortedDistribution" 
                    :key="level"
                    class="list-item group"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-semibold section-title flex items-center gap-2">
                            <span class="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-muted flex items-center justify-center text-xs font-mono">
                                {{ level }}
                            </span>
                            Level {{ level }}
                        </span>
                        <span class="text-xs font-medium text-muted">
                            {{ count }} {{ count === 1 ? 'User' : 'Users' }}
                        </span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="relative w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            class="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-500 group-hover:bg-purple-600"
                            :style="{ width: `${getPercentage(count)}%` }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.distribution-card {
    @apply flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 h-full;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-md);
}

.card-header {
    @apply flex items-center gap-3 p-5 border-b border-muted section-bg;
}

.icon-wrapper {
    @apply flex items-center justify-center w-10 h-10 rounded-xl;
    /* Purple theme for distribution/stats */
    background-color: color-mix(in srgb, var(--color-secondary-500) 10%, transparent);
    color: var(--color-secondary-600);
}
:global(.dark) .icon-wrapper {
    color: var(--color-secondary-400);
}

.card-body {
    @apply flex-1 overflow-hidden relative;
}

.list-container {
    @apply p-5 space-y-5 overflow-y-auto max-h-[300px];
    scrollbar-width: thin;
}

.list-item {
    @apply relative;
}

.empty-state {
    @apply flex flex-col items-center justify-center h-48 text-center p-6;
}
</style>