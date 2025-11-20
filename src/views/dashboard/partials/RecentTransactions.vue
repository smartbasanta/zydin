<script setup lang="ts">
import { DollarSign } from 'lucide-vue-next';
import { ref } from 'vue';
const transactions = ref([
    { user: 'niraj', amount: '₹5,000', type: 'Withdrawal', status: 'Pending', time: '10m ago' },
    { user: 'avnesh', amount: '₹10,000', type: 'Deposit', status: 'Completed', time: '1h ago' },
    { user: 'Rupeshbasnet', amount: '₹2,500', type: 'Withdrawal', status: 'Approved', time: '2h ago' },
    { user: 'diyalimbu', amount: '₹7,000', type: 'Entry Fee', status: 'Completed', time: '4h ago' },
]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div class="p-2 space-y-2">
            <div v-for="transaction in transactions" :key="transaction.time" class="flex items-start gap-3 p-3 rounded-lg">
                <DollarSign class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        <strong class="font-semibold text-gray-900 dark:text-white">{{ transaction.user }}</strong>
                        {{ transaction.type }} of {{ transaction.amount }} - {{ transaction.status }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ transaction.time }}</p>
                </div>
            </div>
        </div>
    </div>
</template>