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
let intervalId: number | undefined;

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

const startSlideTimer = () => {
    // Clear any existing timer first to prevent duplicates
    if (intervalId) clearInterval(intervalId);
    intervalId = window.setInterval(() => {
        nextSlide(false); // Pass false to indicate auto-slide
    }, 5000);
};

const nextSlide = (manual = true) => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  
  // If manually triggered, restart the timer
  if (manual) startSlideTimer();
};

const prevSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
  
  // Always restart timer on manual interaction
  startSlideTimer();
};

onMounted(async () => {
  await fetchSlides();
  startSlideTimer();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <section class="relative w-full h-[75vh] min-h-[500px] md:h-[91.6vh] overflow-hidden">
    <!-- Theme-aware background with clipping effect -->
    <div class="absolute inset-0 bg-gradient-hero clip-path-hero"></div>
    <div class="absolute inset-0 hero-grid-overlay" aria-hidden="true"></div>
    <div class="hero-glow hero-glow--one" aria-hidden="true"></div>
    <div class="hero-glow hero-glow--two" aria-hidden="true"></div>

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

      <!-- Text Content with Modern Card Design -->
      <div class="relative z-20 flex items-center w-full h-full">
        <div class="container px-6 mx-auto">
          <div class="max-w-4xl md:ml-8 lg:ml-16">
            <transition name="slide-up" mode="out-in">
              <div :key="currentSlide" class="card-backdrop">
                <div class="relative z-10">
                  <h1 class="mb-6 text-3xl md:text-4xl lg:text-5xl leading-tight section-title font-bold tracking-tight drop-shadow-lg">
                    {{ slides[currentSlide]?.title }}
                  </h1>
                  <p class="mb-8 text-base md:text-lg lg:text-xl section-description font-medium leading-relaxed drop-shadow-md max-w-2xl">
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
        class="hero-control hero-control--left storytelling-slide-in-left">
        <ChevronLeftIcon class="w-8 h-8" />
      </button>
      <button @click="nextSlide()" aria-label="Next Slide"
        class="hero-control hero-control--right storytelling-slide-in-right">
        <ChevronRightIcon class="w-8 h-8" />
      </button>

      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 storytelling-fade-in-up">
        <button v-for="(_, index) in slides" :key="`indicator-${index}`" @click="currentSlide = index"
          :class="['hero-indicator', { 'hero-indicator--active': currentSlide === index }]"
          :aria-label="`Go to slide ${index + 1}`">
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

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

.hero-grid-overlay {
  background-image:
    linear-gradient(0deg, color-mix(in srgb, var(--color-gray-0) 4%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-gray-0) 4%, transparent) 1px, transparent 1px);
  background-size: 120px 120px;
  mix-blend-mode: soft-light;
}

.hero-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.4;
  pointer-events: none;
}
.hero-glow--one {
  width: 320px;
  height: 320px;
  top: 10%;
  right: 15%;
  background: var(--gradient-secondary);
}
.hero-glow--two {
  width: 260px;
  height: 260px;
  bottom: 5%;
  left: 10%;
  background: var(--gradient-accent);
}

.hero-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  @apply p-3 rounded-full backdrop-blur-lg transition-all duration-300;
  color: var(--color-static-white);
  box-shadow: 0 20px 30px -20px rgba(0,0,0,0.45);
  background: color-mix(in srgb, rgba(0,0,0,0.2) 40%, transparent);
}
.hero-control--left { left: 2.5rem; }
.hero-control--right { right: 1.25rem; }
.hero-control:hover {
  background: color-mix(in srgb, var(--header-link-hover) 25%, transparent);
  transform: translateY(-50%) scale(1.05);
}

.hero-indicator {
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background-color: color-mix(in srgb, rgba(255,255,255,0.5) 70%, transparent);
  transition: transform 0.3s ease, background-color 0.3s ease;
}
.hero-indicator--active {
  transform: scale(1.3);
  background-image: var(--gradient-secondary);
  box-shadow: 0 0 20px rgba(255,255,255,0.45);
}
</style>