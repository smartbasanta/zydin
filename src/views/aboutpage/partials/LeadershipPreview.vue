<script setup lang="ts">
import LoadingState from '@/components/loading/LoadingState.vue';
import type { Leader } from '@/types';
import { RouterLink } from 'vue-router';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
defineProps<{ leaders: Leader[] }>();
</script>

<template>
  <section class="leadership section-bg">
    <div class="container mx-auto px-6 py-24">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="leadership__eyebrow">Leadership</p>
        <h2 class="leadership__title">Meet the people shaping our next chapters.</h2>
        <p class="leadership__intro">
          Guided by patient-first thinking and a relentless pursuit of better oncology outcomes, our leadership team
          keeps us aligned on impact.
        </p>
      </div>

      <div class="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
        <article v-for="leader in leaders" :key="leader.id" class="leader-card">
          <div class="leader-card__avatar">
            <div class="leader-card__avatar-bg"></div>
            <img :src="leader.image_url ?? leader.image_thumbnail_url ?? defaultProfileImage" :alt="`Portrait of ${leader.name}`" loading="lazy" />
          </div>
          <div class="leader-card__body">
            <h3>{{ leader.name }}</h3>
            <p>{{ leader.position }}</p>
            <RouterLink :to="{ name: 'about.leader-detail', params: { id: leader.id } }" class="leader-card__link">
              View bio
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="text-center mt-16">
        <RouterLink :to="{ name: 'about.leadership-team' }" class="leader-cta">
          See the full team
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.leadership {
  --leader-accent: color-mix(in srgb, var(--color-primary-600) 70%, var(--section-title-color));
  --leader-surface: color-mix(in srgb, var(--section-bg) 86%, transparent);
  --leader-border: color-mix(in srgb, var(--section-title-color) 18%, transparent);
}
:global(.dark) .leadership {
  --leader-accent: color-mix(in srgb, var(--color-primary-400) 80%, var(--section-title-color));
}

.leadership__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--section-title-color) 70%, var(--leader-accent));
  margin-bottom: 1rem;
}
.leadership__title {
  font-size: clamp(2rem, 3vw, 2.75rem);
  color: var(--section-title-color);
  font-weight: 700;
  margin-bottom: 1rem;
}
.leadership__intro {
  color: var(--section-text-color);
  line-height: 1.7;
}

.leader-card {
  border-radius: 1.75rem;
  border: 1px solid var(--leader-border);
  background: var(--leader-surface);
  box-shadow: 0 35px 70px -45px color-mix(in srgb, var(--leader-accent) 40%, transparent);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}
.leader-card::after {
  content: '';
  position: absolute;
  inset: 1rem;
  border-radius: 1.25rem;
  border: 1px dashed color-mix(in srgb, var(--leader-border) 70%, transparent);
  opacity: 0.4;
  pointer-events: none;
}
.leader-card__avatar {
  position: relative;
  width: 8rem;
  height: 8rem;
  margin: 0 auto;
  border-radius: 1.5rem;
  overflow: hidden;
  isolation: isolate;
}
.leader-card__avatar-bg {
  position: absolute;
  inset: 0;
  /* background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--leader-accent) 60%, transparent), transparent); */
  opacity: 0.4;
  z-index: 0;
}
.leader-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  position: relative;
  z-index: 1;
}
.leader-card__body {
  text-align: center;
}
.leader-card__body h3 {
  font-size: 1.25rem;
  color: var(--section-title-color);
  font-weight: 600;
}
.leader-card__body p {
  color: var(--section-text-color);
  margin-top: 0.3rem;
}
.leader-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.85rem;
  font-weight: 600;
  color: var(--leader-accent);
}
.leader-card__link::after {
  content: '↗';
  font-size: 0.9rem;
}

.leader-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2.5rem;
  border-radius: 9999px;
  font-weight: 600;
  color: var(--color-static-white);
  background-image: var(--gradient-secondary);
  box-shadow: 0 25px 45px -30px color-mix(in srgb, var(--leader-accent) 55%, transparent);
  transition: transform 0.3s ease;
}
.leader-cta:hover {
  transform: translateY(-4px);
}
</style>