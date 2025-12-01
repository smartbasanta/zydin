<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

// --- UNIFIED SLIDER LOGIC ---
const sliderRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

// REFACTORED: This function now calculates the scroll distance in pixels.
const slideBy = (direction: 'next' | 'prev') => {
    if (!sliderRef.value) return;

    // 1. Get the first product card to measure its full width (including margins/gap).
    const firstCard = sliderRef.value.querySelector('.product-card-container') as HTMLElement;
    if (!firstCard) return;
    
    // 2. Calculate the width of one "scroll step".
    // We use `offsetWidth` plus the gap (32px or 2rem). A more robust way might be to get computed style.
    const scrollAmount = firstCard.offsetWidth + 32;

    // 3. Apply the scroll
    sliderRef.value.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth', // This creates a nice scrolling animation
    });
};

// --- Drag handlers remain the same as they were already working correctly ---
const onMouseDown = (e: MouseEvent) => {
    if (!sliderRef.value) return;
    isDragging.value = true;
    sliderRef.value.classList.add('grabbing');
    startX.value = e.pageX - sliderRef.value.offsetLeft;
    scrollLeft.value = sliderRef.value.scrollLeft;
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
    const walk = (x - startX.value) * 2;
    sliderRef.value.scrollLeft = scrollLeft.value - walk;
};

</script>

<template>
    <section class="py-20 md:py-28 overflow-hidden relative clip-path-section section-bg">
        <!-- Background elements are unchanged -->
        <div class="featured-section__glow featured-section__glow--primary" aria-hidden="true"></div>
        <div class="featured-section__glow featured-section__glow--secondary" aria-hidden="true"></div>
        <div class="featured-section__pattern" aria-hidden="true"></div>

        <div class="container mx-auto px-6 relative z-10">
            <div class="max-w-4xl mx-auto mb-16 text-center">
                <h2 class="text-3xl md:text-4xl lg:text-5xl section-title font-bold mb-6 tracking-tight">
                    Our Featured Treatments
                </h2>
                <p class="text-lg md:text-xl section-description max-w-3xl mx-auto leading-relaxed font-medium">
                    Discover our comprehensive range of innovative oncology solutions, meticulously developed to advance patient care and improve outcomes.
                </p>
            </div>
            
            <div v-if="isLoading" class="flex items-center justify-center h-96">
                <LoadingState message="Loading Treatments..." />
            </div>

            <div v-else-if="products.length > 0" class="relative">
                <div class="overflow-hidden">
                    <div 
                        ref="sliderRef"
                        class="flex gap-8 px-4 pb-8 -mx-4 overflow-x-auto cursor-grab snap-x snap-mandatory no-scrollbar"
                        @mousedown="onMouseDown"
                        @mouseleave="onMouseLeave"
                        @mouseup="onMouseUp"
                        @mousemove="onMouseMove"
                    >
                        <!-- Add a start/end spacer for better visual padding -->
                        <div class="flex-shrink-0 w-4"></div>
                        <div 
                            v-for="product in products" 
                            :key="product.id" 
                            class="w-[80%] sm:w-[45%] md:w-[30%] lg:w-[23%] flex-shrink-0 snap-center product-card-container"
                        >
                            <ProductCard :product="product" type="mini" />
                        </div>
                        <div class="flex-shrink-0 w-4"></div>
                    </div>
                </div>

                <!-- Slider Navigation Buttons now call the new slideBy function -->
                <div class="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 pointer-events-none px-2">
                    <button @click="slideBy('prev')" aria-label="Previous Product" class="slider-control pointer-events-auto">
                        <ChevronLeftIcon class="w-6 h-6" />
                    </button>
                    <button @click="slideBy('next')" aria-label="Next Product" class="slider-control pointer-events-auto">
                        <ChevronRightIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div v-else class="px-4 text-center text-muted">
                <p>Featured products are not available at the moment. Please check back later.</p>
            </div>

            <div class="px-4 mt-16 text-center">
                <RouterLink :to="{ name: 'products' }" class="cta-pill">
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
  /* Ensure z-index context */
  isolation: isolate; 
}

/* Subtle background pattern overlay */
.featured-section__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  background-image: 
    radial-gradient(circle at 15% 50%, color-mix(in srgb, var(--color-primary-500) 10%, transparent) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, color-mix(in srgb, var(--color-secondary-500) 10%, transparent) 0%, transparent 25%);
  mix-blend-mode: soft-light;
}

/* Glowing orbs for depth */
.featured-section__glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 9999px;
  filter: blur(120px);
  opacity: 0.25;
  pointer-events: none;
  z-index: -1;
}

.featured-section__glow--primary {
  top: -100px;
  left: -100px;
  background: var(--gradient-primary);
}

.featured-section__glow--secondary {
  bottom: -100px;
  right: -50px;
  background: var(--gradient-secondary);
}

/* The "View Full Catalog" Button */
.cta-pill {
  @apply inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300;
  background-image: var(--gradient-secondary); /* Uses the teal/blue pharma gradient */
  color: white;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--color-secondary-500) 30%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px color-mix(in srgb, var(--color-secondary-500) 50%, transparent);
  filter: brightness(1.05);
}

/* Utilities */
.grabbing { 
  cursor: grabbing; 
}

.no-scrollbar::-webkit-scrollbar { 
  display: none; 
}
.no-scrollbar { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Slider Navigation Buttons */
.slider-control {
  @apply grid place-content-center size-12 rounded-full border transition-all duration-300;
  background-color: var(--card-bg);
  border-color: var(--card-border);
  color: var(--section-title-color);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(8px);
}

.slider-control:hover {
  transform: scale(1.1);
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
  background-color: color-mix(in srgb, var(--color-primary-500) 5%, var(--card-bg));
}

.slider-control:active {
    transform: scale(0.95);
}
</style>