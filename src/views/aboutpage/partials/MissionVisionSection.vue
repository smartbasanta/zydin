<script setup lang="ts">
defineProps<{ mission: string; vision: string }>();
</script>
<template>
    <section class="py-20 bg-secondary-400 sm:py-24 dark:bg-pink-300">
        <div class="container grid max-w-5xl gap-12 px-4 mx-auto md:grid-cols-2">
            <div class="p-8 border-l-4 border-secondary-1200 dark:border-pink-900">
                <h2 class="mb-4 text-3xl font-bold font-grotesk text-primary-1250 dark:text-primary-1250">Our Mission</h2>
                <p class="text-lg text-primary-1000 dark:text-primary-1250">{{ mission }}</p>
            </div>
            <div class="p-8 border-l-4 border-secondary-1200 dark:border-pink-900">
                <h2 class="mb-4 text-3xl font-bold font-grotesk text-primary-1250 dark:text-primary-1250">Our Vision</h2>
                <p class="text-lg text-primary-1000 dark:text-primary-1250">{{ vision }}</p>
            </div>
        </div>
    </section>
</template>