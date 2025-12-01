<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'wave' | 'curve-glow' | 'tilt-grid';
  position?: 'top' | 'bottom'; // Does this divider sit at the top or bottom of a block?
  flip?: boolean;
}>(), {
  variant: 'wave',
  position: 'bottom',
  flip: false,
});

const dividerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

// Generate random particles for the molecular effect
const particles = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${10 + Math.random() * 10}s`,
  size: `${4 + Math.random() * 8}px`
}));

onMounted(() => {
  if (!dividerRef.value) return;
  
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
      // Optional: disconnect if you only want it to animate once
      // observer?.disconnect(); 
    }
  }, { threshold: 0.1 });

  observer.observe(dividerRef.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <div
    ref="dividerRef"
    class="divider-container"
    :class="[
      `variant-${props.variant}`,
      { 'is-flipped': props.flip, 'is-visible': isVisible }
    ]"
    aria-hidden="true"
  >
    
    <!-- VARIANT 1: BIOTECH WAVE (Liquid, Organic, Multi-layered) -->
    <template v-if="props.variant === 'wave'">
      <!-- Molecular Particles (Floating Bubbles) -->
      <div class="particles-container">
        <div 
          v-for="p in particles" 
          :key="p.id" 
          class="molecule"
          :style="{ 
            left: p.left, 
            animationDelay: p.delay, 
            width: p.size, 
            height: p.size,
            animationDuration: p.duration
          }"
        ></div>
      </div>

      <!-- Wave Layer 1 (Back - Slow) -->
      <svg class="wave-layer wave-back" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" fill-opacity="0.3" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      <!-- Wave Layer 2 (Middle - Medium Speed) -->
      <svg class="wave-layer wave-mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" fill-opacity="0.6" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      <!-- Wave Layer 3 (Front - Fast - Solid Color) -->
      <svg class="wave-layer wave-front" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,197.3C672,171,768,149,864,160C960,171,1056,213,1152,224C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </template>


    <!-- VARIANT 2: CURVE GLOW (Modern, Clean, Gradient Accent) -->
    <template v-if="props.variant === 'curve-glow'">
      <div class="glow-spot"></div>
      <svg class="curve-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" fill="currentColor"></path>
      </svg>
    </template>


    <!-- VARIANT 3: TILT GRID (Technical, Sharp, Data-driven) -->
    <template v-if="props.variant === 'tilt-grid'">
      <div class="grid-overlay"></div>
      <svg class="tilt-svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <polygon points="0,100 1440,0 1440,100" fill="currentColor"></polygon>
      </svg>
    </template>

  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* --- BASE CONTAINER --- */
.divider-container {
  position: relative;
  width: 100%;
  line-height: 0;
  overflow: hidden;
  /* Use the background color of the NEXT section to blend seamlessly */
  color: var(--section-bg); 
  /* background: var(--section-bg); */
  /* Ensure it sits on top of content if using negative margins */
  z-index: 10;
  
  /* Smooth entrance */
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.divider-container.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.divider-container.is-flipped {
  transform: scaleX(-1);
}
.divider-container.is-flipped.is-visible {
  transform: scaleX(-1) translateY(0);
}

/* --- VARIANT: BIOTECH WAVE --- */
.variant-wave {
  height: 150px;
}

.wave-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Parallax Animation for Waves */
.wave-back {
  animation: waveMove 20s linear infinite alternate;
  transform-origin: bottom;
  /* color: var(--section-title-color); */
  color: color-mix(in srgb, var(--color-primary-500) 30%, transparent);
}

.wave-mid {
  animation: waveMove 15s linear infinite alternate-reverse;
  transform-origin: bottom;
  /* color: var(--section-title-color); */
  color: color-mix(in srgb, var(--color-secondary-500) 40%, transparent);
}

.wave-front {
  /* The front wave matches the section background exactly */
  position: relative; /* Keeps container height */
  color: var(--section-bg); 
  /* color: var(--section-title-color); */
  filter: drop-shadow(0px -5px 15px rgba(0,0,0,0.05)); /* Subtle depth */
}

@keyframes waveMove {
  0% { transform: scaleY(1) translateX(0); }
  100% { transform: scaleY(1.1) translateX(-20px); }
}

/* Molecular Particles */
.particles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.molecule {
  position: absolute;
  bottom: -20px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
  border-radius: 50%;
  opacity: 0;
  /* Blending particles into the scene */
  box-shadow: 0 0 10px var(--color-primary-400);
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-200px) translateX(20px);
    opacity: 0;
  }
}


/* --- VARIANT: CURVE GLOW --- */
.variant-curve-glow {
  height: 100px;
  margin-top: -50px; /* Overlap effect */
}

.curve-svg {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  color: var(--section-bg); /* Matches the bottom section */
}

.glow-spot {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 60%;
  height: 150%;
  background: var(--gradient-hero);
  /* background: radial-gradient(ellipse at bottom, var(--color-primary-500), transparent 70%); */
  opacity: 0.15;
  filter: blur(40px);
  z-index: 1;
  animation: pulseGlow 5s ease-in-out infinite alternate;
}

@keyframes pulseGlow {
  from { opacity: 0.1; transform: translateX(-50%) scale(1); }
  to { opacity: 0.2; transform: translateX(-50%) scale(1.1); }
}


/* --- VARIANT: TILT GRID --- */
.variant-tilt-grid {
  height: 80px;
}

.tilt-svg {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  color: var(--section-bg);
}

.grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: 
    linear-gradient(to right, color-mix(in srgb, var(--text-muted) 10%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--text-muted) 10%, transparent) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(to bottom, transparent, black);
  opacity: 0.5;
}
</style>