<script setup lang="ts">
import AppLogo from '@/components/logo/AppLogo.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
interface Props {
    title: string;
    description: string;
    showLogo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showLogo: true, // Set default value here
});
</script>

<template>
    <div class="flex flex-col items-center text-center mb-8">
        <!-- Re-using your AppLogo for brand consistency -->
        <RouterLink v-if="props.showLogo" to="/" class="mb-4">
            <!-- <AppLogo class="size-14 transition-transform hover:scale-105" /> -->
            <img :src="zydinLogoImage" class="w-25 transition-transform group-hover:scale-105" />
        </RouterLink>

        <!-- <div class="font-grotesk"> -->
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight section-title">
            {{ title }}
        </h2>
        <p class="text-muted mt-2 text-sm sm:text-base max-w-sm">
            {{ description }}
        </p>
        <!-- </div> -->
    </div>
</template>