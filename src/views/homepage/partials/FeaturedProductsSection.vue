<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import ProductCard from '@/views/productspage/partials/ProductCard.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { RouterLink } from 'vue-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { useProductsAPI } from '@/composables/fetch-public-apis/useProductsAPI';

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
    <section class="py-20 md:py-28 overflow-hidden relative clip-path-section section-bg">
        <!-- Subtle background pattern -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 45%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 45%);"></div>
        </div>

        <div class="container mx-auto px-6 relative z-10">
            <div class="max-w-4xl mx-auto mb-16 text-center">
                <h2 class="text-3xl md:text-4xl lg:text-5xl section-text font-bold mb-6 tracking-tight">
                    Our Featured Treatments
                </h2>
                <p class="text-lg md:text-xl lg:text-2xl section-text max-w-3xl mx-auto leading-relaxed font-medium">
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
                        <ProductCard :product="product" />
                    </div>
                </div>

                <!-- Slider Navigation Buttons -->
                <div class="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 pointer-events-none">
                    <button @click="slidePrev" :disabled="activeIndex === 0" class="p-3 transition-colors transform -translate-x-1/2 bg-white border rounded-full shadow-lg pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-100">
                        <ChevronLeftIcon class="w-6 h-6 text-primary-800" />
                    </button>
                    <button @click="slideNext" :disabled="activeIndex >= products.length - 1" class="p-3 transition-colors transform translate-x-1/2 bg-white border rounded-full shadow-lg pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-100">
                        <ChevronRightIcon class="w-6 h-6 text-primary-800" />
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="px-4 text-center text-gray-500">
                <p>Featured products are not available at the moment. Please check back later.</p>
            </div>

            <!-- View All CTA -->
            <div class="px-4 mt-16 text-center">
                <RouterLink
                    :to="{ name: 'products' }"
                    class="inline-block px-8 py-3 text-lg font-semibold transition-transform transform rounded-full bg-secondary-900 text-primary-1200 hover:bg-secondary-600 hover:scale-105"
                >
                    View Our Full Catalog
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Custom scrollbar hiding utility */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Custom cursor for dragging state */
.grabbing {
  cursor: grabbing;
}
</style>