<script setup lang="ts">
import { DollarSign } from 'lucide-vue-next';
import { computed, ref } from 'vue';
const expenses = ref([
    { category: 'Server Costs', amount: '₹2,50,000' },
    { category: 'Marketing', amount: '₹1,80,000' },
    { category: 'Player Payouts', amount: '₹3,00,000' },
    { category: 'Support Staff', amount: '₹80,000' },
]);

// Total Revenue from stats (₹8,45,200)
const totalRevenue = 845200;
// Calculate total expenses
const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount.replace('₹', '').replace(',', '')) || 0;
        return sum + amount;
    }, 0);
});
// Calculate profit/loss
const profitLoss = computed(() => totalRevenue - totalExpenses.value);
// Format profit/loss with ₹ and commas
const formattedProfitLoss = computed(() => {
    const value = Math.abs(profitLoss.value);
    return `₹${value.toLocaleString('en-IN')}`;
});
// Determine if profit or loss
const isProfit = computed(() => profitLoss.value >= 0);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Platform Expenses</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of operational costs and profit/loss.</p>
        </div>
        <div class="p-4">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-300 dark:border-gray-800">
                        <th class="p-3 text-left font-semibold text-gray-500 dark:text-gray-400">Category</th>
                        <th class="p-3 text-right font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="expense in expenses" :key="expense.category" class="hover:bg-gray-100 dark:hover:bg-gray-900/50">
                        <td class="p-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <DollarSign class="w-4 h-4 text-red-600 dark:text-red-400" />
                            {{ expense.category }}
                        </td>
                        <td class="p-3 text-right font-mono text-red-600 dark:text-red-400">{{ expense.amount }}</td>
                    </tr>
                    <tr class="border-t border-gray-300 dark:border-gray-800 font-semibold">
                        <td class="p-3 text-gray-900 dark:text-white">Total Expenses</td>
                        <td class="p-3 text-right font-mono text-red-600 dark:text-red-400">₹{{ totalExpenses.toLocaleString('en-IN') }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-4 p-3 rounded-lg" :class="isProfit ? 'bg-green-600/10 dark:bg-green-400/10' : 'bg-red-600/10 dark:bg-red-400/10'">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ isProfit ? 'Profit' : 'Loss' }}:
                    <span class="font-mono" :class="isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">{{ formattedProfitLoss }}</span>
                </p>
            </div>
        </div>
    </div>
</template>