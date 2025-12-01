<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboardSummaryAPI } from '@/composables/fetch-public-apis/useDashboardSummaryAPI';
import LoadingState from '@/components/card/LoadingState.vue';

import {
    PackageIcon,
    FileTextIcon,
    UsersIcon,
    MessageSquareIcon,
    PlusIcon,
    ArrowRightIcon,
    BeakerIcon,
    PillIcon,
    BriefcaseIcon,
    DownloadIcon
} from 'lucide-vue-next';

const authStore = useAuthStore();
const { stats, isLoading, fetchSummary } = useDashboardSummaryAPI();

onMounted(() => {
    fetchSummary();
});

const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
};

const calculatePercentage = (part: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-[calc(100vh-theme(space.20))]">

        <!-- 1. Header Section -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
                <p class="text-sm font-bold uppercase tracking-wider section-title mb-1">{{ getCurrentDate() }}</p>
                <h1 class="text-3xl font-bold section-title">
                    Hello, {{ authStore.currentUser?.username || 'Admin' }}
                </h1>
                <p class="section-title mt-1">Here is what's happening at Zydin Biotech today.</p>
            </div>
            
            <!-- Quick Global Action: Only if can create product -->
            <RouterLink 
                v-if="stats?.can.createProduct"
                :to="{ name: 'dashboard.products.create' }"
                class="btn btn-primary shadow-lg shadow-primary-500/20"
            >
                <PlusIcon class="size-4 mr-2" /> Add New Product
            </RouterLink>
        </header>

        <LoadingState v-if="isLoading" message="Gathering insights..." />

        <div v-else-if="stats" class="space-y-8 animate-fade-in">

            <!-- 2. KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <!-- Products KPI: Check viewAnyProducts -->
                <component 
                    :is="stats.can.viewAnyProducts ? 'RouterLink' : 'div'"
                    :to="{ name: 'dashboard.products.index' }"
                    class="stat-card group bg-card-bg transition-colors"
                    :class="{ 'hover:border-blue-500/50 cursor-pointer': stats.can.viewAnyProducts }"
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium section-title">Total Products</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.total_products }}</h3>
                        </div>
                        <div class="icon-box bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <PackageIcon class="size-6" />
                        </div>
                    </div>
                    <div class="mt-4 flex gap-3 text-xs font-medium">
                        <span class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            {{ stats.products_api }} API
                        </span>
                        <span class="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                            {{ stats.products_ff }} Formulation
                        </span>
                    </div>
                </component>

                <!-- Applications KPI: Check viewAnyJobApplications -->
                <component 
                    :is="stats.can.viewAnyJobApplications ? 'RouterLink' : 'div'"
                    :to="{ name: 'dashboard.job-applications.index' }"
                    class="stat-card group bg-card-bg transition-colors"
                    :class="{ 'hover:border-emerald-500/50 cursor-pointer': stats.can.viewAnyJobApplications }"
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium section-title">Pending Applications</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.pending_applications }}</h3>
                        </div>
                        <div class="icon-box bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <UsersIcon class="size-6" />
                        </div>
                    </div>
                    <div v-if="stats.can.viewAnyJobApplications" class="mt-4 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        View Applicants
                        <ArrowRightIcon class="size-3" />
                    </div>
                </component>

                <!-- Contact KPI: Check viewAnyContactSubmissions -->
                <component 
                    :is="stats.can.viewAnyContactSubmissions ? 'RouterLink' : 'div'"
                    :to="{ name: 'dashboard.contact-submissions.index' }"
                    class="stat-card group bg-card-bg transition-colors"
                    :class="{ 'hover:border-amber-500/50 cursor-pointer': stats.can.viewAnyContactSubmissions }"
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium section-title">Unread Messages</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.unread_contacts }}</h3>
                        </div>
                        <div class="icon-box bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                            <MessageSquareIcon class="size-6" />
                        </div>
                    </div>
                    <div v-if="stats.can.viewAnyContactSubmissions" class="mt-4 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        Go to Inbox
                        <ArrowRightIcon class="size-3" />
                    </div>
                </component>

                <!-- Articles KPI: Check viewAnyArticles -->
                <component 
                    :is="stats.can.viewAnyArticles ? 'RouterLink' : 'div'"
                    :to="{ name: 'dashboard.articles.index' }"
                    class="stat-card group bg-card-bg transition-colors"
                    :class="{ 'hover:border-indigo-500/50 cursor-pointer': stats.can.viewAnyArticles }"
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium section-title">Published Insights</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.total_content }}</h3>
                        </div>
                        <div class="icon-box bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                            <FileTextIcon class="size-6" />
                        </div>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md border section-title border-indigo-100 dark:border-indigo-800/50">
                            <span class="font-bold">{{ stats.total_articles }}</span> Articles
                        </span>
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md border section-title border-sky-100 dark:border-sky-800/50">
                            <span class="font-bold">{{ stats.total_news }}</span> News
                        </span>
                    </div>
                </component>
            </div>

            <!-- 3. Main Content Grid -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <!-- Left Column: Lists (2/3 width) -->
                <div class="xl:col-span-2 space-y-8">

                    <!-- Recent Job Applications -->
                    <div v-if="stats.can.viewAnyJobApplications" class="card-backdrop p-0 overflow-hidden border border-muted bg-card-bg shadow-sm">
                        <div class="p-6 border-b border-muted flex justify-between items-center">
                            <h3 class="font-bold section-title flex items-center gap-2">
                                <BriefcaseIcon class="size-5 text-emerald-500" />
                                Recent Candidates
                            </h3>
                            <RouterLink :to="{ name: 'dashboard.job-applications.index' }"
                                class="text-sm font-medium text-primary-600 hover:underline">View All</RouterLink>
                        </div>
                        <div v-if="stats.latest_applications.length > 0" class="divide-y divide-muted">
                            <div v-for="app in stats.latest_applications" :key="app.id"
                                class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold uppercase border border-muted">
                                        {{ app.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <RouterLink
                                            :to="{ name: 'dashboard.job-applications.show', params: { id: app.id } }"
                                            class="text-sm font-bold section-title hover:text-primary-600 transition-colors">
                                            {{ app.name }}
                                        </RouterLink>
                                        <p class="text-xs section-title">Applied for: <span class="font-medium">{{ app.position }}</span></p>
                                    </div>
                                </div>
                                <div class="text-xs section-title text-right">
                                    {{ app.date }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="p-8 text-center section-title text-sm italic">
                            No recent applications found.
                        </div>
                    </div>

                    <!-- Recent Messages -->
                    <div v-if="stats.can.viewAnyContactSubmissions" class="card-backdrop p-0 overflow-hidden border border-muted bg-card-bg shadow-sm">
                        <div class="p-6 border-b border-muted flex justify-between items-center">
                            <h3 class="font-bold section-title flex items-center gap-2">
                                <MessageSquareIcon class="size-5 text-amber-500" />
                                Recent Inquiries
                            </h3>
                            <RouterLink :to="{ name: 'dashboard.contact-submissions.index' }"
                                class="text-sm font-medium text-primary-600 hover:underline">View All</RouterLink>
                        </div>
                        <div v-if="stats.latest_contacts.length > 0" class="divide-y divide-muted">
                            <RouterLink :to="{ name: 'dashboard.contact-submissions.show', params: { id: msg.id } }"
                                v-for="msg in stats.latest_contacts" :key="msg.id"
                                class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <div class="flex items-start gap-3">
                                    <div class="mt-1.5 size-2 rounded-full flex-shrink-0"
                                        :class="msg.is_read ? 'bg-gray-300 dark:bg-gray-700' : 'bg-amber-500 shadow-sm shadow-amber-500/50'">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between mb-0.5">
                                            <span class="text-sm font-bold section-title group-hover:text-primary-600 transition-colors">{{ msg.name }}</span>
                                            <span class="text-xs section-title">{{ msg.date }}</span>
                                        </div>
                                        <p class="text-sm section-title line-clamp-1">{{ msg.subject }}</p>
                                    </div>
                                </div>
                            </RouterLink>
                        </div>
                        <div v-else class="p-8 text-center section-title text-sm italic">
                            No recent messages found.
                        </div>
                    </div>
                </div>

                <!-- Right Column: Actions & Info (1/3 width) -->
                <div class="space-y-8">

                    <!-- Quick Actions -->
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm p-6">
                        <h3 class="font-bold text-xs uppercase tracking-wider section-title mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <RouterLink v-if="stats.can.createProduct" :to="{ name: 'dashboard.products.create' }" class="action-btn">
                                <PackageIcon class="size-4 text-blue-500" /> Create Product
                            </RouterLink>
                            <RouterLink v-if="stats.can.createNewsUpdate" :to="{ name: 'dashboard.news.create' }" class="action-btn">
                                <FileTextIcon class="size-4 text-indigo-500" /> Post News Update
                            </RouterLink>
                            <RouterLink v-if="stats.can.createJobOpening" :to="{ name: 'dashboard.jobs.create' }" class="action-btn">
                                <BriefcaseIcon class="size-4 text-emerald-500" /> Create Job Opening
                            </RouterLink>
                            <!-- Fallback if no actions available -->
                             <p v-if="!stats.can.createProduct && !stats.can.createNewsUpdate && !stats.can.createJobOpening" class="text-sm text-muted italic">
                                No quick actions available based on your permissions.
                             </p>
                        </div>
                    </div>

                    <!-- Inventory Breakdown (Only if can view products) -->
                    <div v-if="stats.can.viewAnyProducts" class="rounded-2xl border border-muted bg-card-bg shadow-sm p-6">
                        <h3 class="font-bold text-xs uppercase tracking-wider text-muted mb-4">Inventory Mix</h3>

                        <div class="space-y-5">
                            <!-- API Section -->
                            <div>
                                <div class="flex justify-between items-end text-sm mb-1.5">
                                    <span class="flex items-center gap-2 font-medium section-title">
                                        <BeakerIcon class="size-3.5 text-blue-500" /> API
                                    </span>
                                    <div class="flex items-baseline gap-1.5">
                                        <span class="font-bold section-title">{{ stats.products_api }}</span>
                                        <span class="text-xs text-muted font-mono">
                                            ({{ calculatePercentage(stats.products_api, stats.total_products) }}%)
                                        </span>
                                    </div>
                                </div>
                                <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-blue-500 transition-all duration-1000 ease-out"
                                        :style="{ width: `${calculatePercentage(stats.products_api, stats.total_products)}%` }">
                                    </div>
                                </div>
                            </div>

                            <!-- Formulation Section -->
                            <div>
                                <div class="flex justify-between items-end text-sm mb-1.5">
                                    <span class="flex items-center gap-2 font-medium section-title">
                                        <PillIcon class="size-3.5 text-purple-500" /> Formulation
                                    </span>
                                    <div class="flex items-baseline gap-1.5">
                                        <span class="font-bold section-title">{{ stats.products_ff }}</span>
                                        <span class="text-xs text-muted font-mono">
                                            ({{ calculatePercentage(stats.products_ff, stats.total_products) }}%)
                                        </span>
                                    </div>
                                </div>
                                <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-purple-500 transition-all duration-1000 ease-out"
                                        :style="{ width: `${calculatePercentage(stats.products_ff, stats.total_products)}%` }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Status -->
                    <div v-if="stats.can.viewAnyBackup" class="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-xl">
                        <h3 class="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">System Status</h3>
                        <div class="flex items-start gap-3">
                            <div class="p-2 bg-white/10 rounded-lg border border-white/10">
                                <DownloadIcon class="size-5 text-emerald-400" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-200">Database Backup</p>
                                <p class="text-xs text-gray-400 mt-1">Last successful backup:</p>
                                <p class="text-xs font-mono text-emerald-400 mt-1">{{ stats.last_backup_date }}</p>
                            </div>
                        </div>
                        <div class="mt-5 pt-4 border-t border-white/10">
                            <RouterLink to="/settings/database"
                                class="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                                Manage Backups
                                <ArrowRightIcon class="size-3" />
                            </RouterLink>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.stat-card {
    @apply p-6 rounded-2xl border transition-all duration-300 border-muted shadow-sm flex flex-col h-full justify-between;
}

.icon-box {
    @apply flex items-center justify-center size-12 rounded-xl;
}

.action-btn {
    @apply flex items-center gap-3 p-3 rounded-xl border border-muted hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all text-sm font-medium section-title;
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>