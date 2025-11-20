<script setup lang="ts">
    import { Users } from 'lucide-vue-next';
    import { ref } from 'vue';
    const demographics = ref([
        { location: 'Kathmandu', count: 450 },
        { location: 'Pokhara', count: 320 },
        { location: 'Biratnagar', count: 200 },
        { location: 'Lalitpur', count: 180 },
        { location: 'Other', count: 107 },
    ]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">User Demographics</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Registered user location breakdown.</p>
        </div>
        <div class="p-4">
            <ul class="space-y-2">
                <li v-for="demo in demographics" :key="demo.location" class="flex items-center gap-3">
                    <Users class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ demo.location }}: {{ demo.count }} users</span>
                </li>
            </ul>
        </div>
    </div>
</template>