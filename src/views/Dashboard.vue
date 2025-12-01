<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
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
    CalendarIcon,
    DownloadIcon
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

// --- Mock Data / Types ---
// In a real app, you would fetch this from an endpoint like /api/dashboard/summary
interface DashboardStats {
    total_products: number;
    products_api: number;
    products_ff: number;
    pending_applications: number;
    unread_contacts: number;
    total_articles: number;
    latest_applications: Array<{ id: number; name: string; position: string; date: string }>;
    latest_contacts: Array<{ id: number; name: string; subject: string; date: string; is_read: boolean }>;
    last_backup_date: string;
}

const authStore = useAuthStore();
const isLoading = ref(true);
const stats = ref<DashboardStats | null>(null);

// Simulate API Call
const fetchDashboardData = async () => {
    isLoading.value = true;
    // Simulate delay
    setTimeout(() => {
        stats.value = {
            total_products: 42,
            products_api: 18,
            products_ff: 24,
            pending_applications: 5,
            unread_contacts: 3,
            total_articles: 12,
            latest_applications: [
                { id: 1, name: 'John Doe', position: 'Quality Control Officer', date: '2023-10-25' },
                { id: 2, name: 'Jane Smith', position: 'R&D Specialist', date: '2023-10-24' },
                { id: 3, name: 'Robert Brown', position: 'Marketing Manager', date: '2023-10-23' },
            ],
            latest_contacts: [
                { id: 1, name: 'Dr. Alistair', subject: 'Inquiry about Zytaxel availability', date: '2 hours ago', is_read: false },
                { id: 2, name: 'Pharma Dist.', subject: 'Partnership Opportunity', date: '5 hours ago', is_read: false },
                { id: 3, name: 'Support', subject: 'Website login issue', date: '1 day ago', is_read: true },
            ],
            last_backup_date: 'Oct 25, 2023 04:00 AM'
        };
        isLoading.value = false;
    }, 800);
};

onMounted(fetchDashboardData);

const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans bg-section-bg min-h-[calc(100vh-theme(space.20))]">
        
        <!-- 1. Header Section -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
                <p class="text-sm font-bold uppercase tracking-wider text-muted mb-1">{{ getCurrentDate() }}</p>
                <h1 class="text-3xl font-bold section-title">
                    Hello, {{ authStore.currentUser?.username || 'Admin' }}
                </h1>
                <p class="text-muted mt-1">Here is what's happening at Zydin Biotech today.</p>
            </div>
            <!-- Quick Global Action -->
            <RouterLink :to="{ name: 'dashboard.products.create' }" class="btn btn-primary shadow-lg shadow-primary-500/20">
                <PlusIcon class="size-4 mr-2" /> Add New Product
            </RouterLink>
        </header>

        <LoadingState v-if="isLoading" message="Gathering insights..." />

        <div v-else-if="stats" class="space-y-8 animate-fade-in">
            
            <!-- 2. KPI Cards (Stats Nodes) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <!-- Products KPI -->
                <div class="stat-card group">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-muted">Total Products</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.total_products }}</h3>
                        </div>
                        <div class="icon-box bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <PackageIcon class="size-6" />
                        </div>
                    </div>
                    <div class="mt-4 flex gap-3 text-xs font-medium">
                        <span class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">{{ stats.products_api }} API</span>
                        <span class="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">{{ stats.products_ff }} Formulation</span>
                    </div>
                </div>

                <!-- Applications KPI -->
                <RouterLink :to="{ name: 'dashboard.job-applications.index' }" class="stat-card group hover:border-emerald-500/50 transition-colors">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-muted">Pending Applications</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.pending_applications }}</h3>
                        </div>
                        <div class="icon-box bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <UsersIcon class="size-6" />
                        </div>
                    </div>
                    <div class="mt-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        View Applicants <ArrowRightIcon class="size-3" />
                    </div>
                </RouterLink>

                <!-- Contact KPI -->
                <RouterLink :to="{ name: 'dashboard.contact-submissions.index' }" class="stat-card group hover:border-amber-500/50 transition-colors">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-muted">Unread Messages</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.unread_contacts }}</h3>
                        </div>
                        <div class="icon-box bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                            <MessageSquareIcon class="size-6" />
                        </div>
                    </div>
                    <div class="mt-4 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        Go to Inbox <ArrowRightIcon class="size-3" />
                    </div>
                </RouterLink>

                <!-- Articles KPI -->
                <div class="stat-card group">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-muted">Published Insights</p>
                            <h3 class="text-3xl font-bold section-title mt-1">{{ stats.total_articles }}</h3>
                        </div>
                        <div class="icon-box bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                            <FileTextIcon class="size-6" />
                        </div>
                    </div>
                    <div class="mt-4 text-xs text-muted">
                        Across news & articles
                    </div>
                </div>
            </div>

            <!-- 3. Main Content Grid -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <!-- Left Column: Lists (2/3 width) -->
                <div class="xl:col-span-2 space-y-8">
                    
                    <!-- Recent Job Applications -->
                    <div class="card-backdrop p-0 overflow-hidden border border-muted bg-card-bg shadow-sm">
                        <div class="p-6 border-b border-muted flex justify-between items-center">
                            <h3 class="font-bold section-title flex items-center gap-2">
                                <BriefcaseIcon class="size-5 text-emerald-500" />
                                Recent Candidates
                            </h3>
                            <RouterLink :to="{ name: 'dashboard.job-applications.index' }" class="text-sm font-medium text-primary-600 hover:underline">View All</RouterLink>
                        </div>
                        <div class="divide-y divide-muted">
                            <div v-for="app in stats.latest_applications" :key="app.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold">
                                        {{ app.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold section-title">{{ app.name }}</p>
                                        <p class="text-xs text-muted">Applied for: {{ app.position }}</p>
                                    </div>
                                </div>
                                <div class="text-xs text-muted text-right">
                                    {{ app.date }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Messages -->
                    <div class="card-backdrop p-0 overflow-hidden border border-muted bg-card-bg shadow-sm">
                        <div class="p-6 border-b border-muted flex justify-between items-center">
                            <h3 class="font-bold section-title flex items-center gap-2">
                                <MessageSquareIcon class="size-5 text-amber-500" />
                                Recent Inquiries
                            </h3>
                            <RouterLink :to="{ name: 'dashboard.contact-submissions.index' }" class="text-sm font-medium text-primary-600 hover:underline">View All</RouterLink>
                        </div>
                        <div class="divide-y divide-muted">
                            <div v-for="msg in stats.latest_contacts" :key="msg.id" class="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative">
                                <div v-if="!msg.is_read" class="absolute left-2 top-6 size-2 rounded-full bg-amber-500"></div>
                                <div class="flex-1 ml-2">
                                    <div class="flex justify-between mb-1">
                                        <span class="text-sm font-bold section-title">{{ msg.name }}</span>
                                        <span class="text-xs text-muted">{{ msg.date }}</span>
                                    </div>
                                    <p class="text-sm text-muted line-clamp-1">{{ msg.subject }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Actions & Info (1/3 width) -->
                <div class="space-y-8">
                    
                    <!-- Quick Actions -->
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm p-6">
                        <h3 class="font-bold text-sm uppercase tracking-wider text-muted mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <RouterLink :to="{ name: 'dashboard.products.create' }" class="action-btn">
                                <PackageIcon class="size-4 text-blue-500" /> Create Product
                            </RouterLink>
                            <RouterLink :to="{ name: 'dashboard.news.create' }" class="action-btn">
                                <FileTextIcon class="size-4 text-indigo-500" /> Post News Update
                            </RouterLink>
                            <RouterLink :to="{ name: 'dashboard.jobs.create' }" class="action-btn">
                                <BriefcaseIcon class="size-4 text-emerald-500" /> Create Job Opening
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Inventory Breakdown -->
                    <div class="rounded-2xl border border-muted bg-card-bg shadow-sm p-6">
                        <h3 class="font-bold text-sm uppercase tracking-wider text-muted mb-4">Inventory Mix</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="flex items-center gap-2"><BeakerIcon class="size-3 text-blue-500"/> API</span>
                                    <span class="font-mono">{{ Math.round((stats.products_api / stats.total_products) * 100) }}%</span>
                                </div>
                                <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-blue-500" :style="{ width: `${(stats.products_api / stats.total_products) * 100}%` }"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="flex items-center gap-2"><PillIcon class="size-3 text-purple-500"/> Formulation</span>
                                    <span class="font-mono">{{ Math.round((stats.products_ff / stats.total_products) * 100) }}%</span>
                                </div>
                                <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-purple-500" :style="{ width: `${(stats.products_ff / stats.total_products) * 100}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Status -->
                    <div class="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-lg">
                        <h3 class="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">System Status</h3>
                        <div class="flex items-start gap-3">
                            <div class="p-2 bg-white/10 rounded-lg">
                                <DownloadIcon class="size-5 text-emerald-400" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-200">Database Backup</p>
                                <p class="text-xs text-gray-400 mt-1">Last successful backup:</p>
                                <p class="text-xs font-mono text-emerald-400 mt-1">{{ stats.last_backup_date }}</p>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-white/10">
                            <RouterLink to="/settings/database" class="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1">
                                Manage Backups <ArrowRightIcon class="size-3" />
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
    @apply p-6 rounded-2xl border transition-all duration-300 bg-card-bg border-muted shadow-sm;
}

.icon-box {
    @apply flex items-center justify-center size-12 rounded-xl;
}

.action-btn {
    @apply flex items-center gap-3 p-3 rounded-xl border border-muted bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all text-sm font-medium text-section-title;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>