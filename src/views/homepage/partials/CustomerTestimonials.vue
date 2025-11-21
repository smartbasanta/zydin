<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import type { Testimonial } from '@/types';
import { useTestimonialsAPI } from '@/composables/fetch-public-apis/useTestimonialAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages();
const { testimonials, filters, isLoading, fetchTestimonials } = useTestimonialsAPI();

const activeIndex = ref(0);
let autoPlayInterval: number | undefined;

// --- LOGIC FOR THE NEW CSS-BASED CAROUSEL ---

// This function determines the CSS classes for each card based on its
// position relative to the active slide. This is the core of the new animation.
const getCardClass = (index: number) => {
  const total = testimonials.value.length;
  if (total === 0) return 'opacity-0 scale-75';

  const active = activeIndex.value;
  let diff = index - active;

  // This handles the "wraparound" logic. For example, if you're on the first slide (0),
  // the last slide is considered "previous".
  if (Math.abs(diff) > total / 2) {
    diff = diff > 0 ? diff - total : diff + total;
  }

  // Active slide (center)
  if (diff === 0) {
    return 'opacity-100 scale-100 blur-none z-10';
  }
  // Previous slide (left)
  if (diff === -1) {
    return 'opacity-50 scale-90 blur-sm z-0 -translate-x-[80%] hidden sm:block';
  }
  // Next slide (right)
  if (diff === 1) {
    return 'opacity-50 scale-90 blur-sm z-0 translate-x-[80%] hidden sm:block';
  }

  // All other slides are hidden far away
  return `opacity-0 scale-75 z-0 ${diff > 0 ? 'translate-x-[150%]' : '-translate-x-[150%]'}`;
};

// ---UNCHANGED HELPER FUNCTIONS ---

const showNext = () => {
  if (testimonials.value.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % testimonials.value.length;
};

const showPrev = () => {
  if (testimonials.value.length === 0) return;
  activeIndex.value = (activeIndex.value - 1 + testimonials.value.length) % testimonials.value.length;
};

const startAutoplay = () => {
  stopAutoplay();
  autoPlayInterval = window.setInterval(showNext, 3000);
};

const stopAutoplay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
};

onMounted(async () => {
  filters.type = 'customer';
  await fetchTestimonials();
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <section id="testimonials" class="py-20 md:py-28 section-bg relative overflow-hidden clip-path-section">
    <div class="container px-6 mx-auto relative z-10">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title font-bold mb-4 tracking-tight">
            What Our Partners Say
          </h2>
          <p class="text-lg md:text-xl section-description max-w-2xl mx-auto">
            Trusted by healthcare professionals worldwide for our commitment to excellence and innovation.
          </p>
        </div>

        <!-- Testimonials Container -->
        <div class="relative" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
          <div class="flex items-center justify-center min-h-[24rem]">
            <div v-for="(testimonial, index) in testimonials" :key="testimonial.id"
              :class="getCardClass(index)"
              class="absolute w-full max-w-2xl transition-all duration-700 ease-in-out">

              <div class="backdrop-blur-strong rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
                <!-- Quote icon -->
                <div class="flex justify-center mb-6">
                  <div class="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                  </div>
                </div>

                <!-- Testimonial text -->
                <blockquote class="text-center mb-8">
                  <p class="text-lg md:text-xl testimonial-quote leading-relaxed font-medium italic">
                    "{{ testimonial.text }}"
                  </p>
                </blockquote>

                <!-- Author info -->
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 mb-3">
                    <!-- Stars -->
                    <svg v-for="i in testimonial.rating" :key="`filled-${testimonial.id}-${i}`" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 testimonial-star">
                      <path fill-rule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <svg v-for="i in 5 - testimonial.rating" :key="`empty-${testimonial.id}-${i}`" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 testimonial-star-empty">
                      <path fill-rule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </div>

                  <h4 class="font-semibold text-primary text-lg testimonial-author">{{ testimonial.name }}</h4>
                  <p class="text-sm testimonial-role">{{ testimonial.role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-center items-center gap-6 mt-12">
            <button @click="showPrev" aria-label="Previous testimonial"
              class="p-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <ChevronLeftIcon class="w-6 h-6 text-primary-700 group-hover:scale-110 transition-transform" />
            </button>
            <button @click="showNext" aria-label="Next testimonial"
              class="p-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <ChevronRightIcon class="w-6 h-6 text-primary-700 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
    </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.testimonial-quote {
  color: var(--section-text-color);
}
.testimonial-author {
  color: var(--section-title-color);
}
.testimonial-role {
  color: var(--section-description-color);
}
.testimonial-star {
  color: color-mix(in srgb, var(--color-warning) 85%, transparent);
}
.testimonial-star-empty {
  color: color-mix(in srgb, var(--section-description-color) 55%, transparent);
}
</style>