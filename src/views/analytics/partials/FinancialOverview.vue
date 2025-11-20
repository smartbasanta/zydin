<script setup lang="ts">
    import { DollarSign } from 'lucide-vue-next';
    import { ref } from 'vue';
    const financialData = ref([
        { period: 'Week 1', deposits: '₹30,000', withdrawals: '₹15,000', fees: '₹5,000' },
        { period: 'Week 2', deposits: '₹35,000', withdrawals: '₹18,000', fees: '₹6,200' },
        { period: 'Week 3', deposits: '₹28,000', withdrawals: '₹12,000', fees: '₹4,800' },
        { period: 'Week 4', deposits: '₹27,400', withdrawals: '₹10,000', fees: '₹4,400' },
    ]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Financial Overview</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Deposits vs. Withdrawals vs. Platform Revenue (Fees).</p>
        </div>
        <div class="p-4">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-300 dark:border-gray-800">
                        <th class="p-3 text-left font-semibold text-gray-500 dark:text-gray-400">Period</th>
                        <th class="p-3 text-right font-semibold text-gray-500 dark:text-gray-400">Deposits</th>
                        <th class="p-3 text-right font-semibold text-gray-500 dark:text-gray-400">Withdrawals</th>
                        <th class="p-3 text-right font-semibold text-gray-500 dark:text-gray-400">Fees</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="data in financialData" :key="data.period" class="hover:bg-gray-100 dark:hover:bg-gray-900/50">
                        <td class="p-3 text-gray-700 dark:text-gray-300">{{ data.period }}</td>
                        <td class="p-3 text-right font-mono text-green-600 dark:text-green-400">{{ data.deposits }}</td>
                        <td class="p-3 text-right font-mono text-red-600 dark:text-red-400">{{ data.withdrawals }}</td>
                        <td class="p-3 text-right font-mono text-orange-600 dark:text-orange-400">{{ data.fees }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>