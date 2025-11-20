<script setup lang="ts">
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
defineProps({
    leader: {
        type: Object,
        required: true,
    }
});
</script>

<template>
    <div class="text-center bg-white dark:bg-gray-1000 p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <img :src="leader.imageUrl ?? defaultProfileImage" :alt="leader.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-semibold">{{ leader.name }}</h3>
        <p class="text-blue-600 dark:text-blue-400">{{ leader.title }}</p>
    </div>
</template>