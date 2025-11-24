<script setup lang="ts">
import type { Testimonial } from '@/types';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useDefaultImages } from '@/composables/useDefaultImages';
import { useGalleryImageAPI } from '@/composables/fetch-public-apis/useGalleryImageAPI';
import LoadingState from '@/components/loading/LoadingState.vue';
import { QuoteIcon } from 'lucide-vue-next';

const { defaultProfileImage } = useDefaultImages();
const props = defineProps<{ testimonials: Testimonial[] }>();
const { images, isLoading, fetchImages } = useGalleryImageAPI();

const currentTestimonialIndex = ref(0);
let testimonialInterval: number;

const currentTestimonial = computed(() => {
  if (!props.testimonials || props.testimonials.length === 0) return null;
  return props.testimonials[currentTestimonialIndex.value];
});

type TabKey = 'company_culture' | 'employee_life' | 'corporate_social_responsibility';
const activeTab = ref<TabKey>('company_culture');
const tabs: { key: TabKey; label: string }[] = [
    { key: 'company_culture', label: 'Company Culture' },
    { key: 'employee_life', label: 'Employee Life' },
    { key: 'corporate_social_responsibility', label: 'CSR' },
];

const filteredImages = computed(() => {
    return images.value.filter(image => image.gallery_group === activeTab.value);
});

onMounted(() => {
    fetchImages();
    if (props.testimonials && props.testimonials.length > 0) {
      testimonialInterval = window.setInterval(() => {
          currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % props.testimonials.length;
      }, 8000); // Increased interval for better readability
    }
});

onUnmounted(() => {
    clearInterval(testimonialInterval);
});
</script>

<template>
  <section class="py-20 md:py-28 section-bg relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 -left-24 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-block py-1 px-3 rounded-full  text-xs font-bold tracking-wider uppercase mb-4">
            Life at Zydin
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold section-title mb-6 tracking-tight">
            Craft, Care, and Collective Energy
        </h2>
        <p class="text-lg md:text-xl section-text leading-relaxed">
          Discover our vibrant culture, meet the brilliant minds behind our science, and see how we give back to our community.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Left Column: Testimonial (4 columns) -->
        <div class="lg:col-span-5 flex flex-col shadow-2xl rounded-2xl">
          <div class="card-backdrop p-8 md:p-10 h-full flex flex-col justify-between relative overflow-hidden group">
            <!-- Decorative Quote Icon -->
            <QuoteIcon class="absolute top-6 right-6 w-24 h-24 text-primary-500/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
            
            <div class="relative z-10 flex-grow flex flex-col justify-center">
               <Transition name="fade" mode="out-in">
                <div v-if="currentTestimonial" :key="currentTestimonial.id" class="space-y-6">
                  <blockquote class="text-xl md:text-2xl font-medium leading-relaxed section-title italic">
                    "{{ currentTestimonial.text }}"
                  </blockquote>
                  
                  <div class="flex items-center gap-4 pt-4 border-t border-muted">
                    <img 
                        :src="currentTestimonial.avatar_url ?? currentTestimonial.avatar_thumbnail_url ?? defaultProfileImage"
                        :alt="currentTestimonial.name" 
                        class="w-14 h-14 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
                        loading="lazy" 
                    />
                    <div>
                      <h4 class="font-bold section-title">{{ currentTestimonial.name }}</h4>
                      <p class="text-sm section-text">{{ currentTestimonial.role }}</p>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Dots Navigation -->
            <div class="flex gap-2 mt-8 relative z-10">
              <button
                v-for="(testimonial, index) in testimonials"
                :key="testimonial.id"
                @click="currentTestimonialIndex = index"
                class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                :class="index === currentTestimonialIndex ? 'bg-primary-600 w-8' : 'bg-primary-200 hover:bg-primary-400'"
                :aria-label="`Go to testimonial ${index + 1}`"
              ></button>
            </div>
          </div>
        </div>

        <!-- Right Column: Gallery (8 columns) -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- Tabs -->
          <div class="flex flex-wrap gap-2 pb-2 border-b border-muted">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              class="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              :class="activeTab === tab.key 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'section-title hover:scale-105 hover:bg-primary-300'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Gallery Grid -->
          <div class="relative min-h-[400px] section-bg rounded-2xl overflow-hidden border box-border shadow-2xl">
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
                <LoadingState />
            </div>

            <div v-else-if="filteredImages.length === 0" class="absolute inset-0 flex flex-col items-center justify-center section-title">
                <p>No images available for this category yet.</p>
            </div>

            <TransitionGroup
              v-else
              tag="div"
              name="gallery-anim"
              class="grid grid-cols-2 md:grid-cols-3 gap-1 p-1 h-full w-full absolute inset-0"
            >
              <div
                v-for="(image, index) in filteredImages.slice(0, 5)"
                :key="image.id"
                class="relative overflow-hidden group cursor-pointer"
                :class="{
                  'md:col-span-2 md:row-span-2': index === 0, // Featured image
                  'col-span-1 row-span-1': index !== 0
                }"
              >
                <img
                  v-if="image.image_url"
                  :src="image.image_url"
                  :alt="image.alt_text || 'Gallery Image'"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                >
                <!-- Overlay Content -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p class="text-white text-sm font-medium line-clamp-2">{{ image.caption }}</p>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Smooth fade for testimonial text */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  position: absolute; 
}

/* Gallery Grid Animation */
.gallery-anim-move,
.gallery-anim-enter-active,
.gallery-anim-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.gallery-anim-enter-from,
.gallery-anim-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.gallery-anim-leave-active {
  position: absolute; 
}
</style>