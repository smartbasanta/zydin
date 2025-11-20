<script setup lang="ts">
import type { Testimonial } from '@/types';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useDefaultImages } from '@/composables/useDefaultImages';
import { useGalleryImageAPI } from '@/composables/fetch-public-apis/useGalleryImageAPI';
import LoadingState from '@/components/loading/LoadingState.vue';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
const props = defineProps<{ testimonials: Testimonial[] }>();
const { images, isLoading, fetchImages } = useGalleryImageAPI();

const currentTestimonialIndex = ref(0);
let testimonialInterval: number;

const currentTestimonial = computed(() => {
  // Gracefully handle the case where testimonials array might be empty
  if (!props.testimonials || props.testimonials.length === 0) {
    return null;
  }
  return props.testimonials[currentTestimonialIndex.value];
});

type TabKey = 'company_culture' | 'employee_life' | 'corporate_social_responsibility';
const activeTab = ref<TabKey>('company_culture');
const tabs: { key: TabKey; label: string }[] = [
    { key: 'company_culture', label: 'Company Culture' },
    { key: 'employee_life', label: 'Employee Life' },
    { key: 'corporate_social_responsibility', label: 'CSR' },
];

// 3. Computed Property for Client-Side Filtering
const filteredImages = computed(() => {
    return images.value.filter(image => image.gallery_group === activeTab.value);
});

onMounted(() => {
    // Fetch all gallery images without any server-side filtering
    fetchImages();

    // Start the testimonial carousel
    if (props.testimonials && props.testimonials.length > 0) {
      testimonialInterval = window.setInterval(() => {
          currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % props.testimonials.length;
      }, 3000);
    }
});

onUnmounted(() => {
    clearInterval(testimonialInterval);
});
</script>

<template>
    <section class="py-20 overflow-hidden sm:py-24 bg-secondary-100 dark:bg-gray-900">
        <div class="container px-4 mx-auto">

            <div class="mb-12 text-center">
                <h2 class="text-3xl font-bold md:text-5xl font-grotesk text-secondary-1250 dark:text-pink-300">
                    Life at Zydin Biotech
                </h2>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Discover our vibrant culture, the brilliant people behind our science, and our commitment to the community.
                </p>
            </div>

            <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">

                <div class="relative mt-8 wow animate__animated animate__fadeInLeft">
                    <div class="relative min-h-[320px] p-8 transition-all duration-500 bg-white border rounded-lg shadow-lg dark:bg-gray-800 border-secondary-200 dark:border-pink-900/50">
                        <TransitionGroup
                            name="fade"
                            tag="div"
                        >
                            <div v-if="currentTestimonial" :key="currentTestimonial.id">
                                <blockquote class="relative">
                                    <svg class="absolute top-0 left-0 w-10 h-10 transform -translate-x-4 -translate-y-4 text-secondary-200 dark:text-pink-900/60" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                                        <path d="M9.352 4C4.456 7.424 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.424-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
                                    </svg>
                                    <p class="relative text-xl italic font-medium text-gray-700 dark:text-gray-300">
                                        "{{ currentTestimonial.text }}"
                                    </p>
                                </blockquote>
                                <div class="relative flex items-center mt-6">
                                    <img class="flex-shrink-0 object-cover w-16 h-16 rounded-full" :src="currentTestimonial.avatar_url ?? currentTestimonial.avatar_thumbnail_url ?? defaultProfileImage" :alt="currentTestimonial.name">
                                    <div class="ml-4">
                                        <div class="text-base font-bold text-secondary-1250 dark:text-pink-300">{{ currentTestimonial.name }}</div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ currentTestimonial.role }}</div>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>

                    <div class="flex justify-center mt-6 space-x-2">
                        <button
                            v-for="(testimonial, index) in testimonials"
                            :key="testimonial.id"
                            @click="currentTestimonialIndex = index"
                            class="w-3 h-3 rounded-full transition-colors duration-300"
                            :class="index === currentTestimonialIndex ? 'bg-secondary-1250 dark:bg-pink-400' : 'bg-secondary-300 dark:bg-gray-600 hover:bg-secondary-400'"
                        ></button>
                    </div>
                </div>

                <div class="wow animate__animated animate__fadeInRight">
                    <!-- Tabs -->
                    <div class="flex mb-6 border-b border-gray-300 dark:border-gray-700">
                        <button
                            v-for="tab in tabs"
                            :key="tab.key"
                            @click="activeTab = tab.key"
                            class="px-4 py-3 -mb-px text-sm font-semibold transition-all duration-300 border-b-2"
                            :class="activeTab === tab.key
                                ? 'border-secondary-1250 text-secondary-1250 dark:border-pink-400 dark:text-pink-300'
                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'"
                        >
                            {{ tab.label }}
                        </button>
                    </div>

                     <div v-if="isLoading" class="flex items-center justify-center h-[500px]">
                        <LoadingState />
                    </div>
                    <div v-else>
                        <!-- Message for when a tab has no images -->
                        <div v-if="filteredImages.length === 0" class="flex items-center justify-center h-[500px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/50 rounded-lg">
                            <p>No images available for this category yet.</p>
                        </div>

                        <!-- The actual grid, using TransitionGroup -->
                        <TransitionGroup
                            v-else
                            tag="div"
                            name="grid-shuffle"
                            class="grid grid-cols-2 grid-rows-3 gap-4 h-[500px]"
                        >
                            <div
                                v-for="(image, index) in filteredImages.slice(0, 4)"
                                :key="image.id"
                                class="relative overflow-hidden transition-transform duration-500 bg-gray-200 rounded-lg shadow-lg group dark:bg-gray-800"
                                :class="{
                                    'col-span-1 row-span-2': index === 0,
                                    'col-span-1 row-span-1': index === 1 || index === 2,
                                    'col-span-2 row-span-1': index === 3,
                                }"
                            >
                                <!-- ✅ CORRECTED THIS SECTION -->
                                <img
                                    v-if="image.image_url"
                                    :src="image.image_url"
                                    :alt="image.alt_text || image.caption || 'Company Image'"
                                    class="object-cover w-full h-full duration-500 ease-in-out transform group-hover:scale-110"
                                >
                                <LoadingState v-else />
                                <!-- End of correction -->

                                <div class="absolute inset-0 transition-opacity duration-300 bg-black opacity-0 group-hover:opacity-60"></div>
                                <p class="absolute bottom-0 left-0 p-4 text-white transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">{{ image.caption }}</p>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
/* Fade transition for testimonials */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  position: absolute; /* Prevent layout shift */
  top: 0;
  left: 0;
  right: 0;
  padding: 2rem; /* Match the parent padding */
}

/* Grid shuffle animation for the gallery */
.grid-shuffle-move,
.grid-shuffle-enter-active,
.grid-shuffle-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.grid-shuffle-enter-from,
.grid-shuffle-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.grid-shuffle-leave-active {
    position: absolute;
}
</style>