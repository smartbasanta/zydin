<script setup lang="ts">
    import { Calendar } from 'lucide-vue-next';
    import { ref } from 'vue';
    const eventData = ref([
        { event: 'Weekly Blitz', participants: 250, date: '2025-06-22' },
        { event: '8 Ball Pool Championship', participants: 180, date: '2025-06-20' },
        { event: 'Ludo Star Night', participants: 150, date: '2025-06-18' },
        { event: 'eFootball League', participants: 120, date: '2025-06-15' },
    ]);
</script>

<template>
    <div class="bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg">
        <div class="p-4 border-b border-gray-300 dark:border-gray-800/80">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Event Participation</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Number of participants in recent events.</p>
        </div>
        <div class="p-4">
            <ul class="space-y-2">
                <li v-for="event in eventData" :key="event.event" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/50">
                    <Calendar class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ event.event }}: {{ event.participants }} participants ({{ event.date }})</span>
                </li>
            </ul>
        </div>
    </div>
</template>