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
  <section class="employee-life section-bg">
    <div class="container mx-auto px-6 py-24">
      <div class="text-center max-w-3xl mx-auto mb-14">
        <p class="employee-life__eyebrow">Life at Zydin Biotech</p>
        <h2 class="employee-life__title">A culture of craft, care, and collective energy.</h2>
        <p class="employee-life__intro">
          Discover our vibrant culture, the brilliant people behind our science, and our commitment to the community.
        </p>
      </div>

      <div class="grid gap-12 lg:grid-cols-[0.9fr,1.1fr]">
        <div class="employee-life__panel">
          <TransitionGroup name="fade" tag="div">
            <div v-if="currentTestimonial" :key="currentTestimonial.id">
              <svg class="employee-life__quote" viewBox="0 0 32 32" aria-hidden="true">
                <path
                  d="M9.352 4C4.456 7.424 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.424-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
              </svg>
              <p class="employee-life__testimonial">
                "{{ currentTestimonial.text }}"
              </p>
              <div class="employee-life__person">
                <img :src="currentTestimonial.avatar_url ?? currentTestimonial.avatar_thumbnail_url ?? defaultProfileImage"
                  :alt="currentTestimonial.name" loading="lazy" />
                <div>
                  <span>{{ currentTestimonial.name }}</span>
                  <p>{{ currentTestimonial.role }}</p>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <div class="employee-life__dots">
            <button
              v-for="(testimonial, index) in testimonials"
              :key="testimonial.id"
              @click="currentTestimonialIndex = index"
              :class="{ active: index === currentTestimonialIndex }"
            ></button>
          </div>
        </div>

        <div class="employee-life__gallery">
          <div class="employee-life__tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="{ active: activeTab === tab.key }"
            >
              {{ tab.label }}
            </button>
          </div>

          <div v-if="isLoading" class="employee-life__gallery-loading">
            <LoadingState />
          </div>

          <div v-else>
            <div v-if="filteredImages.length === 0" class="employee-life__gallery-empty">
              <p>No images available for this category yet.</p>
            </div>

            <TransitionGroup
              v-else
              tag="div"
              name="grid-shuffle"
              class="employee-life__gallery-grid"
            >
              <div
                v-for="(image, index) in filteredImages.slice(0, 4)"
                :key="image.id"
                class="employee-life__gallery-item"
                :class="{
                  'span-two-rows': index === 0,
                  'span-two-cols': index === 3,
                }"
              >
                <img
                  v-if="image.image_url"
                  :src="image.image_url"
                  :alt="image.alt_text || image.caption || 'Company Image'"
                  loading="lazy"
                >
                <LoadingState v-else />
                <div class="employee-life__gallery-overlay"></div>
                <p>{{ image.caption }}</p>
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

.employee-life {
  position: relative;
  --employee-life-accent: color-mix(in srgb, var(--color-primary-600) 70%, var(--section-title-color));
  --employee-life-surface: color-mix(in srgb, var(--section-bg) 88%, transparent);
  --employee-life-border: color-mix(in srgb, var(--section-title-color) 18%, transparent);
  --employee-life-overlay: color-mix(in srgb, var(--section-title-color) 80%, transparent);
}
:global(.dark) .employee-life {
  --employee-life-accent: color-mix(in srgb, var(--color-primary-400) 80%, var(--section-title-color));
}
.employee-life__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--section-title-color) 70%, var(--employee-life-accent));
  margin-bottom: 1rem;
}
.employee-life__title {
  font-size: clamp(2rem, 3vw, 2.75rem);
  color: var(--section-title-color);
  font-weight: 700;
  margin-bottom: 1rem;
}
.employee-life__intro {
  color: var(--section-text-color);
  line-height: 1.7;
}

.employee-life__panel {
  background: var(--employee-life-surface);
  border: 1px solid var(--employee-life-border);
  border-radius: 1.75rem;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  box-shadow: 0 30px 60px -45px color-mix(in srgb, var(--employee-life-accent) 35%, transparent);
  min-height: clamp(280px, 35vw, 360px);
  position: relative;
  overflow: hidden;
}
.employee-life__quote {
  width: 48px;
  height: 48px;
  color: color-mix(in srgb, var(--employee-life-accent) 85%, transparent);
  margin-bottom: 1rem;
}
.employee-life__testimonial {
  font-size: clamp(1rem, 2.3vw, 1.2rem);
  color: var(--section-title-color);
  line-height: 1.6;
}
.employee-life__person {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.employee-life__person img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
.employee-life__person span {
  font-weight: 600;
  color: var(--section-title-color);
}
.employee-life__person p {
  color: var(--section-text-color);
  margin: 0;
}
.employee-life__dots {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 1.5rem;
}
.employee-life__dots button {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--section-title-color) 25%, transparent);
  border: none;
}
.employee-life__dots button.active {
  width: 28px;
  background: var(--employee-life-accent);
}

.employee-life__gallery {
  background: var(--employee-life-surface);
  border-radius: 1.75rem;
  border: 1px solid var(--employee-life-border);
  padding: 1.5rem;
}
.employee-life__tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.employee-life__tabs button {
  border: 1px solid transparent;
  border-radius: 9999px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  color: var(--section-text-color);
  background: transparent;
}
.employee-life__tabs button.active {
  border-color: color-mix(in srgb, var(--employee-life-accent) 65%, transparent);
  background: color-mix(in srgb, var(--employee-life-accent) 20%, var(--section-bg));
  color: var(--section-title-color);
}
.employee-life__gallery-loading,
.employee-life__gallery-empty {
  display: grid;
  place-items: center;
  height: 420px;
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--section-bg) 75%, transparent);
  color: var(--section-text-color);
}
.employee-life__gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(110px, 1fr));
  gap: clamp(0.6rem, 2vw, 0.85rem);
  height: clamp(320px, 48vw, 420px);
}
.employee-life__gallery-item {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--section-bg) 60%, transparent);
  box-shadow: 0 20px 40px -30px color-mix(in srgb, var(--employee-life-accent) 40%, transparent);
}
.employee-life__gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.employee-life__gallery-item:hover img {
  transform: scale(1.08);
}
.employee-life__gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--employee-life-overlay) 85%, var(--section-bg))
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
.employee-life__gallery-item:hover .employee-life__gallery-overlay {
  opacity: 1;
}
.employee-life__gallery-item p {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  color: var(--color-static-white);
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.3s ease;
}
.employee-life__gallery-item:hover p {
  transform: translateY(0);
  opacity: 1;
}
.employee-life__gallery-item.span-two-rows {
  grid-row: span 2;
}
.employee-life__gallery-item.span-two-cols {
  grid-column: span 2;
}
</style>