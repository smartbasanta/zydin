<script setup lang="ts">
import { computed, ref } from 'vue';
import Header from './partials/Header.vue';
import StatsNodes from './partials/StatsNodes.vue';
import UserRegistrations from './partials/UserRegistrations.vue';
import RevenueByGame from './partials/RevenueByGame.vue';
import QuickActions from './partials/QuickActions.vue';
import RecentActivity from './partials/RecentActivity.vue';
import RecentTransactions from './partials/RecentTransactions.vue';
import PlatformExpenses from './partials/PlatformExpenses.vue';
import { useAuthStore } from '@/stores/auth.store';

const stats = ref([
    { title: 'Total Users', value: '1,257', change: '+23 last week', icon: 'Users', color: 'text-blue-600 dark:text-blue-400', changeType: "increase" },
    { title: 'Total Revenue (30d)', value: '₹8,45,200', change: '+5.2%', icon: 'DollarSign', color: 'text-green-600 dark:text-green-400', changeType: "increase" },
    { title: 'Pending Withdrawals', value: '12', change: '₹48,500 total', icon: 'AlertCircle', color: 'text-yellow-600 dark:text-yellow-400', changeType: "neutral" },
    { title: 'Open Support Tickets', value: '5', change: '2 high priority', icon: 'ShieldAlert', color: 'text-red-600 dark:text-red-400', changeType: "neutral" },
]);

const quickActions = ref([
    { title: 'Manage Users', icon: 'Users', to: 'access-control.user-access.index' },
    { title: 'Review Reports', icon: 'ShieldAlert', to: '#' },
]);

const recentActivities = ref([
]);

    const authStore = useAuthStore();
    const user = computed(() => authStore.currentUser);

    
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-gray-1200 text-gray-700 dark:text-gray-300 font-grotesk selection:bg-blue-500/30 selection:text-blue-300">
        
        <Header />
        <StatsNodes :stats="stats" />
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <!-- This is the left side section of main dashboard content -->
                <!-- Here overall stats and other information is needed to be shown -->
            </div>
            <div class="space-y-8">
                <QuickActions :quickActions="quickActions" />
                <RecentTransactions />
            </div>
        </div>
    </div>
</template>