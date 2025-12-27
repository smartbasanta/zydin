<script setup lang="ts">
import { computed } from 'vue';
import LoadingState from '@/components/loading/LoadingState.vue';

interface Props {
  mission?: string;
  vision?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mission: 'Our mission is to develop innovative oncology treatments that make a meaningful difference in the lives of patients and their families worldwide.',
  vision: 'We envision a future where cancer is more manageable, where patients have access to cutting-edge therapies, and where our research contributes to longer, healthier lives for people around the globe.'
});

const hasValidMission = computed(() => props.mission && props.mission.trim().length > 0);
const hasValidVision = computed(() => props.vision && props.vision.trim().length > 0);
const hasValidContent = computed(() => hasValidMission.value && hasValidVision.value);
</script>
<template>
  <section class="mission-vision section-bg relative overflow-hidden">
    <div class="mission-vision__pattern" aria-hidden="true"></div>
    
    <div v-if="!hasValidContent" class="flex items-center justify-center h-96">
      <LoadingState message="Loading mission and vision..." />
    </div>
    
    <div v-else class="container mx-auto px-6 py-20 grid gap-10 md:grid-cols-2 relative z-10">
      <article class="mission-vision__card">
        <p class="mission-vision__eyebrow">Our Mission</p>
        <h2 class="mission-vision__title">Deliver meaningful impact for every patient journey.</h2>
        <p class="mission-vision__copy">{{ mission }}</p>
      </article>
      <article class="mission-vision__card mission-vision__card--accent">
        <p class="mission-vision__eyebrow">Our Vision</p>
        <h2 class="mission-vision__title">Build the world's most trusted oncology partner.</h2>
        <p class="mission-vision__copy">{{ vision }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.mission-vision {
  position: relative;
}
.mission-vision__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background-image:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--section-title-color) 10%, transparent) 0, transparent 45%),
    radial-gradient(circle at 80% 30%, color-mix(in srgb, var(--section-description-color) 16%, transparent) 0, transparent 50%);
}

.mission-vision__card {
  border-radius: 1.75rem;
  padding: 2.25rem;
  background: color-mix(in srgb, var(--section-bg) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--section-title-color) 18%, transparent);
  box-shadow: 0 30px 65px -40px color-mix(in srgb, var(--section-title-color) 40%, transparent);
  position: relative;
  overflow: hidden;
}
.mission-vision__card::after {
  content: '';
  position: absolute;
  inset: 1rem;
  border-radius: 1.25rem;
  border: 1px dashed color-mix(in srgb, var(--section-title-color) 14%, transparent);
  opacity: 0.4;
  pointer-events: none;
}
.mission-vision__card--accent {
  background: color-mix(in srgb, var(--section-bg) 70%, var(--color-primary-600) 8%);
}
.mission-vision__card--accent::after {
  border-color: color-mix(in srgb, var(--section-title-color) 22%, transparent);
}

.mission-vision__eyebrow {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: color-mix(in srgb, var(--section-title-color) 65%, var(--color-primary-300));
  margin-bottom: 1rem;
}
.mission-vision__title {
  font-size: clamp(1.75rem, 2.6vw, 2.5rem);
  color: var(--section-title-color);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
}
.mission-vision__copy {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--section-text-color);
}
</style>
