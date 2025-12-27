<script setup lang="ts">
import { computed } from 'vue';
import AppLogoAnimation from '@/components/logo/AppLogoAnimation.vue';
import LoadingState from '@/components/loading/LoadingState.vue';

interface Props {
  summary?: string;
}

const props = withDefaults(defineProps<Props>(), {
  summary: 'We are dedicated to advancing oncology through innovative research and development of cutting-edge therapeutic solutions that improve patient outcomes worldwide.'
});

const highlightStats = [
  { label: 'Years advancing oncology', value: '15+' },
  { label: 'Molecules in pipeline', value: '45' },
  { label: 'Global partners', value: '60+' },
];

const hasValidContent = computed(() => props.summary && props.summary.trim().length > 0);
</script>

<template>
  <section class="about-hero section-bg relative overflow-hidden">
    <div class="about-hero__grid" aria-hidden="true"></div>
    <div class="about-hero__glow about-hero__glow--primary"></div>
    <div class="about-hero__glow about-hero__glow--secondary"></div>

    <div v-if="!hasValidContent" class="flex items-center justify-center h-96">
      <LoadingState message="Loading our story..." />
    </div>

    <div v-else class="container mx-auto px-6 py-24">
      <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div class="about-hero__content">
          <p class="about-hero__eyebrow">Our Story</p>
          <h1 class="about-hero__title">
            Purpose-built science for a healthier tomorrow
          </h1>
          <p class="about-hero__summary">
            {{ summary }}
          </p>

          <dl class="about-hero__stats">
            <div v-for="stat in highlightStats" :key="stat.label" class="about-hero__stat">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
            </div>
          </dl>
        </div>

        <div class="about-hero__visual">
          <div class="about-hero__visual-card">
            <div class="about-hero__visual-frame">
              <AppLogoAnimation :glow="true" :animation="true" />
            </div>
            <div class="about-hero__visual-cta">
              Trusted innovation, powered by a world-class team.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.about-hero {
  position: relative;
  min-height: 80vh;
  background: linear-gradient(
      140deg,
      color-mix(in srgb, var(--section-bg) 65%, var(--color-primary-600) 10%),
      color-mix(in srgb, var(--section-bg) 95%, transparent)
  );
}
.about-hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--section-title-color) 6%, transparent) 1px, transparent 1px),
    linear-gradient(0deg, color-mix(in srgb, var(--section-title-color) 6%, transparent) 1px, transparent 1px);
  background-size: 120px 120px;
  opacity: 0.12;
  mix-blend-mode: soft-light;
}
.about-hero__glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 9999px;
  filter: blur(130px);
  opacity: 0.35;
}
.about-hero__glow--primary {
  top: -80px;
  left: -120px;
  background: var(--gradient-primary);
}
.about-hero__glow--secondary {
  bottom: -80px;
  right: -40px;
  background: var(--gradient-secondary);
}

.about-hero__content {
  position: relative;
  z-index: 2;
}
.about-hero__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--section-title-color) 75%, var(--color-primary-400));
  margin-bottom: 1rem;
}
.about-hero__title {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--section-title-color);
  margin-bottom: 1.5rem;
}
.about-hero__summary {
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--section-text-color);
  max-width: 54ch;
}

.about-hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.about-hero__stat {
  padding: 1rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--section-bg) 65%, transparent);
  border: 1px solid color-mix(in srgb, var(--section-title-color) 18%, transparent);
  box-shadow: 0 30px 60px -35px color-mix(in srgb, var(--section-title-color) 35%, transparent);
}
.about-hero__stat dt {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--section-title-color) 65%, var(--section-description-color));
  margin-bottom: 0.35rem;
}
.about-hero__stat dd {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--section-title-color);
}

.about-hero__visual {
  position: relative;
  z-index: 2;
}
.about-hero__visual-card {
  position: relative;
  border-radius: 2rem;
  padding: 2.5rem;
  background: color-mix(in srgb, var(--section-bg) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--section-title-color) 16%, transparent);
  box-shadow: 0 35px 85px -45px color-mix(in srgb, var(--section-title-color) 40%, transparent);
  overflow: hidden;
}
.about-hero__visual-card::after {
  content: '';
  position: absolute;
  inset: 1rem;
  border-radius: 1.5rem;
  border: 1px dashed color-mix(in srgb, var(--section-title-color) 15%, transparent);
  opacity: 0.6;
  pointer-events: none;
}
.about-hero__visual-frame {
  position: relative;
  aspect-ratio: 1;
  border-radius: 1.5rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--section-bg) 75%, var(--color-primary-600) 10%);
  display: grid;
  place-items: center;
}
.about-hero__visual-cta {
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: var(--section-title-color);
}

@media (max-width: 1024px) {
  .about-hero {
    min-height: auto;
  }
  .about-hero__visual-card {
    padding: 2rem;
  }
}
</style>