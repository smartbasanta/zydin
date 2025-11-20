<script setup lang="ts">
    import { UserPlus, DollarSign, Repeat, FileText } from 'lucide-vue-next';
    import { ref } from 'vue';
    const metrics = ref([
        { title: 'New Users', value: '312', icon: 'UserPlus', color: 'text-blue-600 dark:text-blue-400' },
        { title: 'Total Deposits', value: '₹1,20,400', icon: 'DollarSign', color: 'text-green-600 dark:text-green-400' },
        { title: 'Avg. Session Duration', value: '24m 15s', icon: 'Repeat', color: 'text-purple-600 dark:text-purple-400' },
        { title: 'New Support Tickets', value: '18', icon: 'FileText', color: 'text-orange-600 dark:text-orange-400' },
    ]);
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
            v-for="metric in metrics"
            :key="metric.title"
            class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl p-5 shadow-lg transition-all duration-300 hover:border-orange-600/50 dark:hover:border-orange-400/50 hover:shadow-orange-900/10 hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 dark:from-primary-1100/50 to-transparent"
        >
            <div class="flex items-center gap-4">
                <div class="p-3 rounded-lg" :class="`${metric.color.replace('text-', 'bg-')}/10`">
                    <component :is="metric.icon" class="w-6 h-6" :class="metric.color" />
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ metric.title }}</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
                </div>
            </div>
        </div>
    </div>
</template>