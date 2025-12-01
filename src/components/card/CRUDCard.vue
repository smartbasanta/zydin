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
    <div class="p-4 sm:p-6 lg:p-8 section-bg section-title transition-colors duration-300">
        <div class="container">
            <div class="mb-6">
                <h1 class="text-2xl font-bold">
                    {{ title }}
                </h1>
                <p class="">
                    {{ description}}
                </p>
            </div>
            <slot />
        </div>
    </div>
</template>