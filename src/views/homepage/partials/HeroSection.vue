<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import type { ApiResponse } from '@/types/api';
import type { HeroSlide } from '@/types';
import { apiService } from '@/services/api.service';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultSlideImage } = useDefaultImages();
const slides = ref<HeroSlide[]>([]);
const isLoading = ref(true);
const currentSlide = ref(0);
let intervalId: number;

const fetchSlides = async () => {
  try {
    const response: ApiResponse = await apiService.get<ApiResponse>('/public/hero-slides');
    slides.value = response.data.hero_slides;
  } catch (e) {
    console.error("Failed to fetch hero slides:", e);
  } finally {
    isLoading.value = false;
  }
};

const nextSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

onMounted(() => {
  fetchSlides();
  intervalId = window.setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <section class="relative w-full h-[75vh] min-h-[500px] md:h-[85vh] text-white overflow-hidden">
    <!-- Theme-aware background with clipping effect -->
    <div class="absolute inset-0 bg-gradient-hero clip-path-hero"></div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-gradient-primary">
      <LoadingState message="Initializing..." />
    </div>

    <!-- Slides Container -->
    <div v-else class="relative w-full h-full">
      <transition-group name="fade" tag="div" class="absolute inset-0 w-full h-full">
        <div v-for="(slide, index) in slides" :key="slide.id" v-show="currentSlide === index"
          class="absolute inset-0 w-full h-full">
          <img :src="slide.image_url ?? defaultSlideImage" :alt="slide.title" class="object-cover w-full h-full blur-[1px]">
          <!-- Enhanced gradient overlay with theme colors -->
          <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40"></div>
          <div class="absolute inset-0 bg-gradient-hero opacity-20"></div>
        </div>
      </transition-group>

      <!-- Floating particles effect -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div class="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div class="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500"></div>
      </div>

      <!-- Text Content with Modern Card Design -->
      <div class="relative z-20 flex items-center w-full h-full">
        <div class="container px-6 mx-auto">
          <div class="max-w-4xl md:ml-8 lg:ml-16">
            <transition name="slide-up" mode="out-in">
              <div :key="currentSlide" class="card-backdrop">
                <div class="relative z-10">
                  <h1 class="mb-6 text-3xl md:text-4xl lg:text-5xl leading-tight text-white font-bold tracking-tight drop-shadow-lg">
                    {{ slides[currentSlide]?.title }}
                  </h1>
                  <p class="mb-8 text-base md:text-lg lg:text-xl text-white/90 font-medium leading-relaxed drop-shadow-md max-w-2xl">
                    {{ slides[currentSlide]?.description }}
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <RouterLink v-if="slides[currentSlide]?.link_url" :to="slides[currentSlide].link_url ?? '#'" class="btn btn-primary">
                      {{ slides[currentSlide].link_text || "Learn More" }}
                    </RouterLink>
                    <RouterLink to="/products" class="btn btn-glass">
                      View Products
                    </RouterLink>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation & Indicators (only if more than one slide) -->
    <template v-if="slides.length > 1">
      <button @click="prevSlide" aria-label="Previous Slide"
        class="absolute top-1/2 left-10 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors storytelling-slide-in-left">
        <ChevronLeftIcon class="w-8 h-8" />
      </button>
      <button @click="nextSlide" aria-label="Next Slide"
        class="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors storytelling-slide-in-right">
        <ChevronRightIcon class="w-8 h-8" />
      </button>

      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 storytelling-fade-in-up">
        <button v-for="(_, index) in slides" :key="`indicator-${index}`" @click="currentSlide = index"
          :class="['w-3 h-3 rounded-full transition-all duration-300', currentSlide === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70']"
          :aria-label="`Go to slide ${index + 1}`">
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
</style>