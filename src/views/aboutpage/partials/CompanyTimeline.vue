<script setup lang="ts">
import type { TimelineEvent } from '@/types';

defineProps<{ events: TimelineEvent[] }>();
</script>
<template>
  <section class="timeline section-bg">
    <div class="container mx-auto px-6 py-24">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="timeline__eyebrow">Milestones</p>
        <h2 class="timeline__title">Our journey of curious minds and bold decisions.</h2>
      </div>

      <div class="timeline__rail">
        <div class="timeline__line" aria-hidden="true"></div>
        <div v-for="(event, index) in events" :key="event.year" class="timeline__item" :class="{'timeline__item--inverse': index % 2 !== 0}">
          <div class="timeline__node">
            <span>{{ event.year }}</span>
          </div>
          <article class="timeline__card">
            <h3>{{ event.event_title }}</h3>
            <p>{{ event.event_description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.timeline {
  position: relative;
}
.timeline__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--section-title-color) 70%, var(--color-primary-300));
  margin-bottom: 1rem;
}
.timeline__title {
  font-size: clamp(2rem, 3vw, 2.75rem);
  color: var(--section-title-color);
  font-weight: 700;
}

.timeline__rail {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding-inline: 1rem;
}
.timeline__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--section-title-color) 30%, transparent),
    color-mix(in srgb, var(--color-primary-500) 50%, transparent)
  );
}

.timeline__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .timeline__item {
    flex-direction: row;
    align-items: center;
  }
  .timeline__item--inverse {
    flex-direction: row-reverse;
    text-align: right;
  }
}

.timeline__node {
  position: relative;
  width: fit-content;
  margin: 0 auto;
  padding: 0.4rem 1rem;
  font-weight: 600;
  border-radius: 9999px;
  background-image: var(--gradient-primary);
  color: var(--color-static-white);
  box-shadow: 0 10px 30px -12px color-mix(in srgb, var(--color-primary-600) 70%, transparent);
}
.timeline__node::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--section-bg);
  border: 4px solid color-mix(in srgb, var(--color-primary-500) 80%, transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.timeline__card {
  flex: 1;
  padding: 2rem;
  border-radius: 1.5rem;
  background: color-mix(in srgb, var(--section-bg) 87%, transparent);
  border: 1px solid color-mix(in srgb, var(--section-title-color) 18%, transparent);
  box-shadow: 0 30px 65px -45px color-mix(in srgb, var(--section-title-color) 35%, transparent);
}
.timeline__card h3 {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--section-title-color);
}
.timeline__card p {
  color: var(--section-text-color);
  line-height: 1.6;
}
</style>