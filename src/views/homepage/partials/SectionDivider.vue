<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'wave' | 'diagonal' | 'dots';
  accent?: 'primary' | 'secondary' | 'accent';
  flip?: boolean;
}>(), {
  variant: 'wave',
  accent: 'primary',
  flip: false,
});

const dividerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (typeof window === 'undefined' || !dividerRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer?.disconnect();
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(dividerRef.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="dividerRef"
    class="section-divider"
    :class="[
      `section-divider--${props.variant}`,
      `section-divider--${props.accent}`,
      { 'section-divider--visible': isVisible, 'section-divider--flip': props.flip },
    ]"
    aria-hidden="true"
  >
    <svg
      v-if="props.variant === 'wave'"
      class="section-divider__wave"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      role="presentation"
    >
      <path
        d="M0,64L80,58.7C160,53,320,43,480,64C640,85,800,139,960,149.3C1120,160,1280,128,1360,112L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
      />
    </svg>

    <div v-if="props.variant === 'diagonal'" class="section-divider__diagonal"></div>
    <div v-if="props.variant === 'dots'" class="section-divider__dots"></div>

    <div class="section-divider__shape section-divider__shape--one"></div>
    <div class="section-divider__shape section-divider__shape--two"></div>
  </div>
  <div class="section-divider__spacer" aria-hidden="true"></div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.section-divider {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(25px) scale(0.98);
  transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  --divider-color: color-mix(in srgb, var(--section-title-color) 35%, var(--section-bg));
  color: var(--divider-color);
}
.section-divider--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.section-divider--flip {
  transform: scaleX(-1);
}

.section-divider__wave path {
  fill: currentColor;
  transition: fill 0.4s ease;
}
.section-divider--primary {
  --divider-color: color-mix(in srgb, var(--color-primary-600) 75%, var(--section-bg));
}
:global(.dark) .section-divider--primary {
  --divider-color: color-mix(in srgb, var(--color-primary-400) 85%, var(--section-bg));
}
.section-divider--secondary {
  --divider-color: color-mix(in srgb, var(--color-info) 75%, var(--section-bg));
}
:global(.dark) .section-divider--secondary {
  --divider-color: color-mix(in srgb, var(--color-info) 65%, var(--section-bg));
}
.section-divider--accent {
  --divider-color: color-mix(in srgb, var(--color-success) 75%, var(--section-bg));
}
:global(.dark) .section-divider--accent {
  --divider-color: color-mix(in srgb, var(--color-success) 65%, var(--section-bg));
}

.section-divider__diagonal {
  position: absolute;
  inset: 0;
  transform: skewY(-6deg);
  background-image: linear-gradient(
    120deg,
    color-mix(in srgb, currentColor 15%, transparent),
    transparent 65%
  );
}

.section-divider__dots {
  position: absolute;
  inset: 15px;
  background-image:
    radial-gradient(circle, color-mix(in srgb, currentColor 25%, transparent) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.35;
}

.section-divider__shape {
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.35;
  pointer-events: none;
}
.section-divider__shape--one {
  width: 180px;
  height: 180px;
  top: -40px;
  left: 15%;
  background: color-mix(in srgb, currentColor 60%, transparent);
  animation: float 10s ease-in-out infinite;
}
.section-divider__shape--two {
  width: 140px;
  height: 140px;
  bottom: 0;
  right: 10%;
  background: color-mix(in srgb, currentColor 45%, transparent);
  animation: float 12s ease-in-out infinite reverse;
}

.section-divider__spacer {
  width: 100%;
  height: 40px;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--section-bg) 80%, transparent)
  );
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(30px);
  }
}
</style>

