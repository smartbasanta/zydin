<script setup lang="ts">
import LoadingState from '@/components/loading/LoadingState.vue';
import AppLogoAnimation from '@/components/logo/AppLogoAnimation.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
defineProps<{ summary: string }>();
</script>
<template>
    <section class="py-24 bg-secondary-100 dark:bg-pink-100 text-secondary-1200 dark:text-pink-600">
        <div class="container items-center mx-auto px-4">
            <div class="flex flex-col items-center mb-12"> <!-- Increased margin-bottom for better spacing -->
                <h1 class="text-4xl font-bold text-center md:text-5xl text-secondary-1200 dark:text-pink-600">
                    About Zydin Biotech
                </h1>
                <div class="mt-6 border-t-2 border-secondary-1200 dark:border-pink-500 w-24"></div>
            </div>
            
            <!-- Use Grid for more robust centering control, especially on mobile -->
            <div class="flex gap-8 md:gap-16 items-center">
            <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"> -->

                <!-- Left Column: Description -->
                <!-- The `prose` class from Tailwind's typography plugin is great for styling text blocks -->
                <div class="prose prose-2xl pl-8 dark:prose-invert max-w-none">
                    <p class="leading-relaxed text-secondary-1200 dark:text-pink-800">
                        {{ summary }}
                    </p>
                </div>

                <!-- Right Column: Logo Animation -->
                <!-- This is the key section. We create a container that has a defined shape. -->
                <div class="w-full max-w-lg mx-auto">
                    <!-- 
                      'aspect-square' is the magic here. It creates a responsive square container.
                      The logo component will automatically fill this square.
                      'relative' is needed because the logo animation uses absolute positioning inside.
                    -->
                    <div class="relative aspect-square">
                        <AppLogoAnimation :glow="false" :animation="false" />
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
/* Optional: If you aren't using the typography plugin, you can style the text manually */
.prose p {
  font-size: 1.5rem; /* Corresponds to text-2xl */
  font-weight: 600; /* Corresponds to font-semibold */
}
</style>