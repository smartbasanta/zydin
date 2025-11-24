<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import ProductCard from '@/components/common/ProductCard.vue';
import { useProductsAPI } from '@/composables/fetch-public-apis/useProductsAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';
import { 
    ArrowLeftIcon, 
    BeakerIcon, 
    ScaleIcon, 
    HashIcon, 
    TagIcon,
    InfoIcon,
    ActivityIcon,
    FileTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from 'lucide-vue-next';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages();
const route = useRoute();
const slug = ref(route.params.slug as string);

const { product, relatedProducts, isLoading, fetchProductBySlug } = useProductsAPI();

onMounted(() => fetchProductBySlug(slug.value));

watch(() => route.params.slug, (newSlug) => {
    if (newSlug) {
        slug.value = newSlug as string;
        fetchProductBySlug(slug.value);
    }
});

const activeTab = ref('description');

const tabs = computed(() => {
    const t = [
        { id: 'description', label: 'Description', icon: InfoIcon },
    ];
    if (product.value?.pharmacology) t.push({ id: 'pharmacology', label: 'Pharmacology', icon: ActivityIcon });
    if (product.value?.indications) t.push({ id: 'indications', label: 'Indications', icon: FileTextIcon });
    return t;
});

// --- Slider Logic for Related Treatments ---
const sliderRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const slide = (direction: 'left' | 'right') => {
  if (!sliderRef.value) return;
  // Scroll amount approx width of one card + gap
  const scrollAmount = 340; 
  sliderRef.value.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth'
  });
};

const onMouseDown = (e: MouseEvent) => {
  if (!sliderRef.value) return;
  isDragging.value = true;
  sliderRef.value.classList.add('active');
  startX.value = e.pageX - sliderRef.value.offsetLeft;
  scrollLeft.value = sliderRef.value.scrollLeft;
};

const onMouseLeave = () => {
  isDragging.value = false;
  sliderRef.value?.classList.remove('active');
};

const onMouseUp = () => {
  isDragging.value = false;
  sliderRef.value?.classList.remove('active');
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
    <div class="section-bg min-h-screen relative">
        <!-- Background decorative glow -->
        <div class="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none"></div>

        <div v-if="isLoading" class="flex items-center justify-center h-screen">
            <LoadingState message="Loading Product Details..." />
        </div>

        <div v-else-if="product" class="relative z-10 pb-20">        
            
            <!-- Navigation Breadcrumb -->
            <div class="container px-6 mx-auto pt-8 pb-4">
                <RouterLink :to="{ name: 'products' }" class="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary-600 btn btn-primary transition-colors">
                    <ArrowLeftIcon class="w-4 h-4" />
                    Back to Products
                </RouterLink>
            </div>

            <!-- Main Content Grid -->
            <div class="container px-6 mx-auto">
                <div class="grid lg:grid-cols-12 gap-10 lg:gap-16">
                    
                    <!-- LEFT COLUMN: Sticky Image & Key Specs -->
                    <div class="lg:col-span-5">
                        <div class="lg:sticky lg:top-28 space-y-8">
                            
                            <!-- Image Card -->
                            <div class="card-backdrop p-6 md:p-8 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 relative overflow-hidden group">
                                <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-50"></div>
                                <img 
                                    :src="product.image_url ?? (product.type === 'api' ? defaultProductAPIImage: defaultProductFFImage)" 
                                    :alt="product.name" 
                                    class="relative z-10 object-contain w-full max-h-[400px] drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                                >
                            </div>

                            <!-- Key Specifications Grid -->
                            <div class="grid grid-cols-2 gap-4">
                                <div v-if="product.brand" class="spec-card">
                                    <div class="spec-icon"><TagIcon class="w-5 h-5" /></div>
                                    <div>
                                        <p class="spec-label">Brand</p>
                                        <p class="spec-value">{{ product.brand.name }}</p>
                                    </div>
                                </div>
                                <div v-if="product.dosage_form" class="spec-card">
                                    <div class="spec-icon"><BeakerIcon class="w-5 h-5" /></div>
                                    <div>
                                        <p class="spec-label">Dosage Form</p>
                                        <p class="spec-value">{{ product.dosage_form }}</p>
                                    </div>
                                </div>
                                <div v-if="product.strength" class="spec-card">
                                    <div class="spec-icon"><ScaleIcon class="w-5 h-5" /></div>
                                    <div>
                                        <p class="spec-label">Strength</p>
                                        <p class="spec-value">{{ product.strength }}</p>
                                    </div>
                                </div>
                                <div v-if="product.cas_number" class="spec-card">
                                    <div class="spec-icon"><HashIcon class="w-5 h-5" /></div>
                                    <div>
                                        <p class="spec-label">CAS Number</p>
                                        <p class="spec-value">{{ product.cas_number }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: Title & Details -->
                    <div class="lg:col-span-7 flex flex-col">
                        
                        <!-- Title Header -->
                        <div class="mb-10">
                            <span class="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400">
                                {{ product.type === 'api' ? 'Active Pharmaceutical Ingredient' : 'Finished Formulation' }}
                            </span>
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-grotesk section-title mb-2 tracking-tight">
                                {{ product.name }}
                            </h1>
                            <p class="text-xl md:text-2xl text-muted font-medium">
                                {{ product.generic_name }}
                            </p>
                        </div>

                        <!-- Tabs Navigation -->
                        <div class="mb-8 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl inline-flex flex-wrap gap-1 border border-muted w-full md:w-auto">
                            <button 
                                v-for="tab in tabs" 
                                :key="tab.id"
                                @click="activeTab = tab.id"
                                class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200"
                                :class="activeTab === tab.id 
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' 
                                    : 'section-title hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/30'"
                            >
                                <component :is="tab.icon" class="w-4 h-4" />
                                {{ tab.label }}
                            </button>
                        </div>

                        <!-- Content Area -->
                        <div class="prose prose-lg dark:prose-invert max-w-none section-title leading-relaxed">
                            <Transition name="fade" mode="out-in">
                                <div v-if="activeTab === 'description'" key="description">
                                    <p>{{ product.description }}</p>
                                </div>
                                <div v-else-if="activeTab === 'pharmacology'" key="pharmacology">
                                    <p>{{ product.pharmacology }}</p>
                                </div>
                                <div v-else-if="activeTab === 'indications'" key="indications">
                                    <p>{{ product.indications }}</p>
                                </div>
                            </Transition>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Related Treatments Slider -->
            <section v-if="relatedProducts.length > 0" class="mt-24 pt-12 border-t border-muted">
                <div class="container px-6 mx-auto">
                    <div class="flex items-center justify-between mb-10">
                        <h2 class="text-2xl md:text-3xl font-bold font-grotesk section-title">
                            Related Treatments
                        </h2>
                        <RouterLink :to="{ name: 'products' }" class="text-sm font-semibold text-primary-600 hover:underline">
                            View All Products
                        </RouterLink>
                    </div>

                    <!-- Slider Container -->
                    <div class="relative group">
                        <!-- Navigation Buttons -->
                        <button @click="slide('left')" class="slider-btn slider-btn--left" aria-label="Scroll Left">
                            <ChevronLeftIcon class="w-6 h-6" />
                        </button>
                        <button @click="slide('right')" class="slider-btn slider-btn--right" aria-label="Scroll Right">
                            <ChevronRightIcon class="w-6 h-6" />
                        </button>

                        <!-- 
                            Scrollable Area 
                            - w-fit mx-auto max-w-full: Ensures centering if few items, scrolling if many.
                        -->
                        <div 
                            ref="sliderRef"
                            class="flex gap-6 overflow-x-auto pb-8 px-4 w-fit mx-auto max-w-full scroll-smooth snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
                            @mousedown="onMouseDown"
                            @mouseleave="onMouseLeave"
                            @mouseup="onMouseUp"
                            @mousemove="onMouseMove"
                        >
                            <div 
                                v-for="related in relatedProducts" 
                                :key="related.id"
                                class="snap-center shrink-0 w-[280px] sm:w-[300px]"
                            >
                                <!-- Passing type="mini" to ProductCard for a compact look inside slider -->
                                <ProductCard :product="related" type="mini" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.spec-card {
    @apply p-4 rounded-xl border border-muted bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm flex items-start gap-3 transition-colors duration-300 hover:border-primary-200 dark:hover:border-primary-800;
}

.spec-icon {
    @apply flex-shrink-0 p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
}

.spec-label {
    @apply text-xs font-semibold uppercase tracking-wider text-primary-50 mb-0.5;
}

.spec-value {
    @apply text-sm font-bold section-title leading-tight;
}

/* Transition for tab content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Slider Utilities */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slider-btn {
    @apply absolute top-1/2 -translate-y-1/2 z-20 grid place-content-center w-12 h-12 rounded-full shadow-lg transition-all duration-300;
    background-color: var(--card-bg);
    color: var(--section-title-color);
    border: 1px solid var(--card-border);
}
.slider-btn:hover {
    background-color: var(--color-primary-500);
    color: white;
    border-color: var(--color-primary-500);
}
.slider-btn--left {
    left: -20px;
}
.slider-btn--right {
    right: -20px;
}

.active {
  cursor: grabbing;
  scroll-behavior: auto !important; 
  scroll-snap-type: none !important;
}
</style>