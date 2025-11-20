<script setup lang="ts">
    withDefaults(defineProps<{
        title: string;
        description: string;
    }>(), {
        title: '',
        description: ''
    })
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-1100 transition-colors duration-300">
        <div class="container">
            <div class="mb-6">
                <h1 class="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                    {{ title }}
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-1">
                    {{ description}}
                </p>
            </div>
            <slot />
        </div>
    </div>
</template>