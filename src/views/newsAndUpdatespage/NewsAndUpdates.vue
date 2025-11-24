<script setup lang="ts">
import { onMounted } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { RouterLink } from 'vue-router';
import { ArrowRightIcon, NewspaperIcon, MegaphoneIcon } from 'lucide-vue-next';
import { useNewsAPI } from '@/composables/fetch-public-apis/useNewsAPI';

const { newsUpdates, isLoading, fetchNewsUpdates } = useNewsAPI();

onMounted(fetchNewsUpdates);

// Helper to split date for the visual calendar block
const getDateParts = (dateString: string | null) => {
    if (!dateString) return { day: '--', month: '---', year: '----' };
    const date = new Date(dateString);
    return {
        day: date.getDate().toString().padStart(2, '0'),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear()
    };
};
</script>

<template>
    <div class="section-bg min-h-screen relative">
        <!-- Hero Section -->
        <header class="relative pt-32 pb-20 overflow-hidden">
            <!-- Decorative Background Elements -->
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div class="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px]"></div>
                <div class="absolute top-20 -left-20 w-[300px] h-[300px] bg-secondary-500/10 rounded-full blur-[80px]"></div>
            </div>

            <div class="container px-6 mx-auto relative z-10 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                    <NewspaperIcon class="w-8 h-8 text-primary-500" />
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold section-title mb-6 tracking-tight font-grotesk">
                    Newsroom & Updates
                </h1>
                <p class="max-w-2xl mx-auto text-lg md:text-xl section-description leading-relaxed">
                    Stay informed with the latest press releases, corporate announcements, and milestones from Zydin Biotech.
                </p>
            </div>
        </header>

        <!-- News Feed -->
        <main class="container px-6 pb-24 mx-auto relative z-10">
            <div v-if="isLoading" class="flex items-center justify-center h-64">
                <LoadingState message="Loading Updates..." />
            </div>

            <div v-else-if="newsUpdates.length > 0" class="max-w-5xl mx-auto space-y-6">
                
                <template v-for="(item, index) in newsUpdates" :key="item.id">
                    <RouterLink 
                        :to="{ name: 'media.news-detail', params: { slug: item.slug } }"
                        class="news-card group"
                    >
                        <!-- Date Block -->
                        <div class="news-date">
                            <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {{ getDateParts(item.publish_date).day }}
                            </span>
                            <span class="text-xs font-bold uppercase tracking-widest text-muted">
                                {{ getDateParts(item.publish_date).month }}
                            </span>
                            <span class="text-[10px] text-muted/60 mt-1">
                                {{ getDateParts(item.publish_date).year }}
                            </span>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0 py-2">
                            <div class="flex items-center gap-3 mb-3">
                                <span class="source-badge">
                                    <MegaphoneIcon class="w-3 h-3" />
                                    {{ item.source }}
                                </span>
                                <span v-if="index === 0" class="latest-badge">
                                    Latest
                                </span>
                            </div>

                            <h2 class="text-xl md:text-2xl font-bold section-title mb-3 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
                                {{ item.title }}
                            </h2>

                            <p class="text-muted line-clamp-2 md:line-clamp-2 mb-4 text-sm md:text-base leading-relaxed">
                                {{ item.excerpt }}
                            </p>

                            <div class="flex items-center text-sm font-semibold text-primary-600 group/link">
                                Read Full Story
                                <ArrowRightIcon class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                        </div>

                        <!-- Decorator -->
                        <div class="absolute right-0 top-0 bottom-0 w-1 bg-primary-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r-xl"></div>
                    </RouterLink>
                </template>

            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-20 text-center card-backdrop p-12 max-w-2xl mx-auto">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-muted">
                    <NewspaperIcon class="w-8 h-8" />
                </div>
                <h3 class="text-xl font-bold section-title mb-2">No Updates Available</h3>
                <p class="text-muted">There are currently no news items to display. Please check back later.</p>
            </div>
        </main>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.news-card {
    @apply relative flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-2xl border transition-all duration-300;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    /* Clean initial state */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

.news-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-200);
}
:global(.dark) .news-card:hover {
    border-color: var(--color-primary-800);
}

.news-date {
    @apply flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl border shrink-0;
    background-color: var(--section-bg);
    border-color: var(--border-muted);
    transition: border-color 0.3s ease;
}
.news-card:hover .news-date {
    border-color: var(--color-primary-300);
    background-color: color-mix(in srgb, var(--color-primary-500) 5%, var(--section-bg));
}

.source-badge {
    @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider;
    background-color: var(--section-bg);
    color: var(--section-title-color);
    border: 1px solid var(--border-muted);
}

.latest-badge {
    @apply inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white;
    background: var(--gradient-accent);
    box-shadow: 0 2px 10px rgba(var(--color-success), 0.2);
}
</style>