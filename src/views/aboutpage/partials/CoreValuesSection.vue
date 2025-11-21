<script setup lang="ts">
import type { CoreValue } from '@/types';
import { Gem } from 'lucide-vue-next';

defineProps<{ values: CoreValue[] }>();
</script>
<template>
  <section class="core-values section-bg">
    <div class="container mx-auto px-6 py-20">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <p class="core-values__eyebrow">Our Core Values</p>
        <h2 class="core-values__title">Principles that keep us anchored.</h2>
        <p class="core-values__intro">
          We are guided by a shared promise to push oncology science, champion integrity, and elevate every patient
          experience.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="value in values" :key="value.title" class="core-values__card">
          <div class="core-values__icon">
            <Gem :size="32" />
          </div>
          <h3>{{ value.title }}</h3>
          <p>{{ value.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.core-values {
  position: relative;
}
.core-values__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--section-title-color) 70%, var(--color-primary-300));
  margin-bottom: 1rem;
}
.core-values__title {
  font-size: clamp(2rem, 3vw, 2.75rem);
  color: var(--section-title-color);
  font-weight: 700;
  margin-bottom: 1rem;
}
.core-values__intro {
  color: var(--section-text-color);
  font-size: 1.05rem;
  line-height: 1.7;
}

.core-values__card {
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--section-title-color) 16%, transparent);
  background: color-mix(in srgb, var(--section-bg) 80%, transparent);
  box-shadow: 0 25px 55px -35px color-mix(in srgb, var(--section-title-color) 40%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  transition: transform 0.35s ease, border-color 0.35s ease;
}
.core-values__card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--color-primary-500) 60%, transparent);
}
.core-values__card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--section-title-color);
}
.core-values__card p {
  color: var(--section-text-color);
  line-height: 1.6;
}
.core-values__icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  background-image: var(--gradient-secondary);
  color: var(--color-static-white);
}
</style>