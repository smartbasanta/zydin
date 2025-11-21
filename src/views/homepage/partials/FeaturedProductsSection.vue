<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { RouterLink } from 'vue-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { useProductsAPI } from '@/composables/fetch-public-apis/useProductsAPI';
import ProductCard from '@/components/common/ProductCard.vue';

const { products, activeFilters, isLoading, fetchProducts } = useProductsAPI();

onMounted(() => {
    activeFilters.is_featured = true;
    fetchProducts();
});

// --- SLIDER LOGIC ---
const activeIndex = ref(0);
const sliderRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const slideNext = () => {
    if (activeIndex.value < products.value.length - 1) {
        activeIndex.value++;
    }
};

const slidePrev = () => {
    if (activeIndex.value > 0) {
        activeIndex.value--;
    }
};

// Mouse Drag Handlers
const onMouseDown = (e: MouseEvent) => {
    if (!sliderRef.value) return;
    isDragging.value = true;
    startX.value = e.pageX - sliderRef.value.offsetLeft;
    scrollLeft.value = sliderRef.value.scrollLeft;
    sliderRef.value.classList.add('grabbing');
};

const onMouseLeave = () => {
    if (!sliderRef.value) return;
    isDragging.value = false;
    sliderRef.value.classList.remove('grabbing');
};

const onMouseUp = () => {
    if (!sliderRef.value) return;
    isDragging.value = false;
    sliderRef.value.classList.remove('grabbing');
};

const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !sliderRef.value) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.value.offsetLeft;
    const walk = (x - startX.value) * 2; // The multiplier makes it feel more responsive
    sliderRef.value.scrollLeft = scrollLeft.value - walk;
};

</script>

<template>
    <section class="py-20 md:py-28 overflow-hidden relative clip-path-section section-bg featured-section">
        <div class="featured-section__glow featured-section__glow--primary" aria-hidden="true"></div>
        <div class="featured-section__glow featured-section__glow--secondary" aria-hidden="true"></div>
        <div class="featured-section__pattern" aria-hidden="true"></div>

        <div class="container mx-auto px-6 relative z-10">
            <div class="max-w-4xl mx-auto mb-16 text-center">
                <h2 class="text-3xl md:text-4xl lg:text-5xl section-title font-bold mb-6 tracking-tight featured-section__title">
                    Our Featured Treatments
                </h2>
                <p class="text-lg md:text-xl lg:text-2xl section-description max-w-3xl mx-auto leading-relaxed font-medium featured-section__subtitle">
                    Discover our comprehensive range of innovative oncology solutions, meticulously developed to advance patient care and improve outcomes.
                </p>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center h-96">
                <LoadingState message="Loading Treatments..." />
            </div>

            <!-- Products Slider -->
            <div v-else-if="products.length > 0" class="relative">
                <div 
                    ref="sliderRef"
                    class="flex gap-8 pl-8 px-4 pb-8 overflow-x-auto cursor-grab snap-x snap-mandatory scrollbar-hide"
                    @mousedown="onMouseDown"
                    @mouseleave="onMouseLeave"
                    @mouseup="onMouseUp"
                    @mousemove="onMouseMove"
                >
                    <!-- Loop through products to create slides -->
                    <div 
                        v-for="product in products" 
                        :key="product.id" 
                        class="w-2/6 sm:w-1/2 md:w-1/3 lg:w-2/7 xl:w-1/4 flex-shrink-0 snap-center"
                    >
                        <!-- Reuse the exact same ProductCard. It fits perfectly. -->
                        <!-- <ProductCard :product="product" /> -->
                        <ProductCard :product="product" />
                    </div>
                </div>

                <!-- Slider Navigation Buttons -->
                <div class="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 pointer-events-none">
                    <button @click="slidePrev" :disabled="activeIndex === 0" class="slider-control -translate-x-1/2 pointer-events-auto" :class="{ 'opacity-30 cursor-not-allowed': activeIndex === 0 }">
                        <ChevronLeftIcon class="w-6 h-6" />
                    </button>
                    <button @click="slideNext" :disabled="activeIndex >= products.length - 1" class="slider-control translate-x-1/2 pointer-events-auto" :class="{ 'opacity-30 cursor-not-allowed': activeIndex >= products.length - 1 }">
                        <ChevronRightIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="px-4 text-center text-muted">
                <p>Featured products are not available at the moment. Please check back later.</p>
            </div>

            <!-- View All CTA -->
            <div class="px-4 mt-16 text-center">
                <RouterLink
                    :to="{ name: 'products' }"
                    class="cta-pill"
                >
                    View Our Full Catalog
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.featured-section {
  position: relative;
}
.featured-section__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--section-title-color) 12%, transparent) 0%, transparent 45%),
    radial-gradient(circle at 80% 60%, color-mix(in srgb, var(--section-description-color) 20%, transparent) 0%, transparent 50%);
}

.featured-section__title {
  color: color-mix(in srgb, var(--section-title-color) 90%, var(--color-primary-400) 10%);
  text-shadow: 0 20px 35px color-mix(in srgb, var(--section-title-color) 20%, transparent);
}
.featured-section__subtitle {
  color: color-mix(in srgb, var(--section-description-color) 80%, transparent);
}
.featured-section__glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 9999px;
  filter: blur(140px);
  opacity: 0.35;
  pointer-events: none;
}
.featured-section__glow--primary {
  top: -60px;
  left: 5%;
  background: var(--gradient-primary);
}
.featured-section__glow--secondary {
  bottom: -80px;
  right: 10%;
  background: var(--gradient-accent);
}

/* Custom scrollbar hiding utility */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom cursor for dragging state */
.grabbing {
  cursor: grabbing;
}

.slider-control {
  @apply p-3 rounded-full border transition-all duration-300;
  background-color: color-mix(in srgb, var(--section-bg) 40%, var(--section-title-color) 10%);
  border-color: color-mix(in srgb, var(--section-title-color) 25%, transparent);
  color: color-mix(in srgb, var(--section-title-color) 80%, transparent);
  box-shadow: 0 20px 35px -25px color-mix(in srgb, var(--section-title-color) 40%, transparent);
}
.slider-control:hover:not(:disabled) {
  transform: scale(1.05);
  background: color-mix(in srgb, var(--section-title-color) 15%, var(--section-bg));
  color: var(--section-title-color);
}
.slider-control:disabled {
  opacity: 0.4;
}

.cta-pill {
  @apply inline-block px-10 py-3 text-lg font-semibold rounded-full transition-transform duration-300;
  background-image: var(--gradient-secondary);
  color: var(--color-static-white);
  box-shadow: 0 25px 45px -30px color-mix(in srgb, var(--section-title-color) 35%, transparent);
}
.cta-pill:hover {
  transform: translateY(-2px) scale(1.02);
}
</style>