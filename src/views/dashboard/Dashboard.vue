<script setup lang="ts">
import { ref, type Component } from 'vue';
import Header from './partials/Header.vue';
import StatsNodes from './partials/StatsNodes.vue';
import QuickActions from './partials/QuickActions.vue';
import RecentTransactions from './partials/RecentTransactions.vue';
import { 
    Users, 
    DollarSign, 
    AlertCircle, 
    ShieldAlert 
} from 'lucide-vue-next';
interface StatItem {
    title: string;
    value: string;
    change: string;
    icon: Component;
    theme: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    changeType: 'increase' | 'decrease' | 'neutral';
}
// Data is now cleaner. Styles are handled by the child component based on the 'theme'.
const stats = ref<StatItem[]>([
    { 
        title: 'Total Users', 
        value: '1,257', 
        change: '+23 last week', 
        icon: Users, 
        theme: 'primary', // Maps to your --gradient-primary
        changeType: "increase" 
    },
    { 
        title: 'Revenue (30d)', 
        value: '₹8,45,200', 
        change: '+5.2%', 
        icon: DollarSign, 
        theme: 'success', // Maps to --color-success
        changeType: "increase" 
    },
    { 
        title: 'Pending Withdrawals', 
        value: '12', 
        change: '₹48,500 total', 
        icon: AlertCircle, 
        theme: 'warning', // Maps to --color-warning
        changeType: "neutral" 
    },
    { 
        title: 'Open Support Tickets', 
        value: '5', 
        change: '2 high priority', 
        icon: ShieldAlert, 
        theme: 'error', // Maps to --color-error
        changeType: "neutral" 
    },
]);

const quickActions = ref([
    { 
        title: 'Manage Users', 
        icon: Users, // Pass component directly
        to: { name: 'access-control.user-access.index' } 
    },
    { 
        title: 'Review Reports', 
        icon: ShieldAlert, // Pass component directly
        to: '#' 
    },
]);
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8 space-y-8 section-bg min-h-full">
        <Header />
        
        <StatsNodes :stats="stats" />
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <!-- Main Content Area -->
            </div>
            <div class="space-y-8">
                <QuickActions :quickActions="quickActions" />
                <!-- <RecentTransactions /> -->
            </div>
        </div>
    </div>
</template>