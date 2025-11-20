<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, defineProps } from 'vue';

// --- Component Props ---
const props = defineProps({
  glow: { type: Boolean, default: false },
  animation: { type: Boolean, default: false },
  // MODIFIED: Size is now optional. Defaulting to null indicates automatic sizing.
  size: { type: Number, default: null },
});

// --- Type Definitions ---
// MODIFIED: Scatter properties are removed from the base Circle type
// as they are now managed separately and dynamically.
interface Circle {
  id: string | number;
  x: number;
  y: number;
  size: CircleSize;
  color: CircleColor;
}
interface ScatterState {
  x: number;
  y: number;
  rotate: number;
}
type CircleSize = '2xl' | 'xl' | 'lg' | 'md' | 'sm';
type CircleColor = 'blue' | 'red' | 'green' | 'yellow' | 'cyan';
type AnimationState = 'IDLE' | 'SCATTERING' | 'ASSEMBLING';

// --- Component State ---
const animationState = ref<AnimationState>('IDLE');
const containerRef = ref<HTMLElement | null>(null); // Ref for the root element
const dynamicSize = ref(450); // Holds the size calculated by ResizeObserver

// NEW: A reactive map to store the current scatter positions for each circle.
const scatterPositions = ref<Map<string | number, ScatterState>>(new Map());

// --- Computed Properties for Sizing ---
// The effectiveSize will be the user-provided prop, or the dynamic size if the prop isn't set.
const effectiveSize = computed(() => props.size ?? dynamicSize.value);
const scaleFactor = computed(() => effectiveSize.value / 10);
const scatterRadius = computed(() => effectiveSize.value * 0.6);

// --- Configuration & Mappings ---
const IDLE_DURATION = 4000;
const SCATTER_DURATION = 2000;
const ASSEMBLE_DURATION = 2000;
const sizeFactors: Record<CircleSize, number> = { '2xl': 2.1, 'xl': 1.5, 'lg': 1.0, 'md': 0.6, 'sm': 0.4 };
const colorClasses: Record<CircleColor, string> = { blue: 'bg-blue-600', red: 'bg-red-600', green: 'bg-green-900', yellow: 'bg-yellow-400', cyan: 'bg-cyan-500' };
const textColorClasses: Record<CircleColor, string> = { blue: 'text-blue-600', red: 'text-red-600', green: 'text-green-900', yellow: 'text-yellow-400', cyan: 'text-cyan-500' };

// --- Seed Data & Generation Logic ---
type CircleSeed = Omit<Circle, 'id'>;
const centerCircleSeed: CircleSeed = { x: 0, y: 0, size: '2xl', color: 'blue' };
const armSeed: CircleSeed[] = [{ x: 0, y: -1, size: 'xl', color: 'red' }, { x: 0, y: -2.15, size: 'md', color: 'cyan' }, { x: 1, y: -3, size: 'md', color: 'green' }, { x: -1, y: -3, size: 'md', color: 'green' }, { x: 0, y: -2.9, size: 'md', color: 'red' }, { x: 0, y: -3.5, size: 'sm', color: 'red' }, { x: 0, y: -4, size: 'sm', color: 'red' }];
const quadrantSeed: CircleSeed[] = [{ x: 1.95, y: -1.15, size: 'lg', color: 'yellow' }, { x: -1.15, y: 1.95, size: 'lg', color: 'blue' }];

// MODIFIED: `allCircles` is now simpler, it only defines the assembled state.
const allCircles = computed<Circle[]>(() => {
  const finalCircles = new Map<string, Circle>();
  armSeed.forEach(seed => {
    finalCircles.set(`${seed.x},${seed.y}`, { ...seed, id: `${seed.x},${seed.y}` });
    finalCircles.set(`${-seed.y},${seed.x}`, { ...seed, id: `${-seed.y},${seed.x}`, x: -seed.y, y: seed.x });
    finalCircles.set(`${-seed.x},${-seed.y}`, { ...seed, id: `${-seed.x},${-seed.y}`, x: -seed.x, y: -seed.y });
    finalCircles.set(`${seed.y},${-seed.x}`, { ...seed, id: `${seed.y},${-seed.x}`, x: seed.y, y: -seed.x });
  });
  quadrantSeed.forEach(seed => {
    const { x, y } = seed;
    // 0 degrees (original seed position)
    finalCircles.set(`${x},${y}`, { ...seed, id: `${x},${y}` });
    // 90 degrees rotation
    finalCircles.set(`${-y},${x}`, { ...seed, id: `${-y},${x}`, x: -y, y: x });
    // 180 degrees rotation
    finalCircles.set(`${-x},${-y}`, { ...seed, id: `${-x},${-y}`, x: -x, y: -y });
    // 270 degrees rotation
    finalCircles.set(`${y},${-x}`, { ...seed, id: `${y},${-x}`, x: y, y: -x });
  });
  // quadrantSeed.forEach(seed => {
  //   finalCircles.set(`${seed.x},${seed.y}`, { ...seed, id: `${seed.x},${seed.y}` });
  //   finalCircles.set(`${-seed.x},${seed.y}`, { ...seed, id: `${-seed.x},${seed.y}`, x: -seed.x, y: seed.y });
  //   finalCircles.set(`${-seed.x},${-seed.y}`, { ...seed, id: `${-seed.x},${-seed.y}`, x: -seed.x, y: -seed.y });
  //   finalCircles.set(`${seed.x},${-seed.y}`, { ...seed, id: `${seed.x},${-seed.y}`, x: seed.x, y: -seed.y });
  // });
  finalCircles.set('center', { ...centerCircleSeed, id: 'center' });
  return Array.from(finalCircles.values());
});

// --- Animation Control ---
const glowingCircles = ref(new Set<string | number>());
let glowInterval: number | undefined;
let animationTimeout: number | undefined;

// NEW: Function to generate new random scatter positions for every circle.
const randomizeScatterPositions = () => {
  const newPositions = new Map<string | number, ScatterState>();
  for (const circle of allCircles.value) {
    const angle = Math.random() * Math.PI * 2;
    const radius = scatterRadius.value * (0.5 + Math.random() * 0.5);
    newPositions.set(circle.id, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotate: Math.random() * 720 - 360,
    });
  }
  scatterPositions.value = newPositions;
};

const runAnimationCycle = () => {
  animationState.value = 'IDLE';
  animationTimeout = setTimeout(() => {
    // MODIFIED: Generate new positions right before scattering.
    randomizeScatterPositions();
    animationState.value = 'SCATTERING';
    animationTimeout = setTimeout(() => {
      animationState.value = 'ASSEMBLING';
      animationTimeout = setTimeout(runAnimationCycle, ASSEMBLE_DURATION);
    }, SCATTER_DURATION);
  }, IDLE_DURATION);
};

const startGlowEffect = () => {
  glowInterval = setInterval(() => {
    glowingCircles.value.clear();
    const circlesToGlow = Math.floor(allCircles.value.length / 5);
    for (let i = 0; i < circlesToGlow; i++) {
      const randomIndex = Math.floor(Math.random() * allCircles.value.length);
      glowingCircles.value.add(allCircles.value[randomIndex].id);
    }
  }, 1500);
};

// --- Lifecycle Hooks ---
let resizeObserver: ResizeObserver;
onMounted(() => {
  // --- NEW: Sizing Logic ---
  if (containerRef.value) {
    // If size prop is NOT passed, set up the observer for auto-sizing.
    if (props.size === null) {
      resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          // Set size to the smaller of the container's width or height to maintain aspect ratio.
          dynamicSize.value = Math.min(entry.contentRect.width, entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.value);
    }
  }

  // --- Animation Start ---
  // Generate initial random positions
  randomizeScatterPositions();
  if (props.glow) startGlowEffect();
  if (props.animation) runAnimationCycle();
});

onUnmounted(() => {
  clearInterval(glowInterval);
  clearTimeout(animationTimeout);
  // Clean up the observer to prevent memory leaks.
  if (resizeObserver) resizeObserver.disconnect();
});

// --- Dynamic Style Calculation ---
const getCircleSizeStyle = (circle: Circle) => {
  const size = scaleFactor.value * sizeFactors[circle.size];
  return { width: `${size}px`, height: `${size}px` };
};

const getWrapperStyle = (circle: Circle) => {
  const assembledX = circle.x * scaleFactor.value;
  const assembledY = circle.y * scaleFactor.value;

  if (!props.animation) {
    return { transform: `translate(${assembledX}px, ${assembledY}px) rotate(0deg) scale(1)`, transition: 'none' };
  }

  let transform = '';
  let transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)';
  let transitionDuration = `${ASSEMBLE_DURATION - 500}ms`;

  if (animationState.value === 'SCATTERING') {
    // MODIFIED: Get dynamic scatter values from the reactive map.
    const scatter = scatterPositions.value.get(circle.id) ?? { x: 0, y: 0, rotate: 0 };
    transform = `translate(${scatter.x}px, ${scatter.y}px) rotate(${scatter.rotate}deg) scale(0.5)`;
    transitionTiming = 'cubic-bezier(0.5, 0, 1, 0.5)';
    transitionDuration = `${SCATTER_DURATION - 500}ms`;
  } else {
    transform = `translate(${assembledX}px, ${assembledY}px) rotate(0deg) scale(1)`;
    if (animationState.value === 'ASSEMBLING') {
      transitionTiming = 'cubic-bezier(0, 0.5, 0.5, 1)';
    }
  }

  const delay = Math.random() * 500;
  return { transform, transition: `transform ${transitionDuration} ${delay}ms ${transitionTiming}` };
};
</script>

<template>
  <!-- MODIFIED: Added the `ref` for the ResizeObserver to measure -->
  <div ref="containerRef" class="relative w-full h-full">
    <!-- MODIFIED: The wrapper now uses the `effectiveSize` computed property -->
    <div 
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
      :style="{ width: `${effectiveSize}px`, height: `${effectiveSize}px` }"
    >
      <!-- The center point of the logo animation -->
      <div class="absolute top-1/2 left-1/2">
        <div
          v-for="circle in allCircles"
          :key="circle.id"
          class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          :style="[getWrapperStyle(circle), getCircleSizeStyle(circle)]"
        >
          <div
            :class="[
              'w-full h-full rounded-full',
              colorClasses[circle.color],
              textColorClasses[circle.color],
              { 'glowing': glowingCircles.has(circle.id) && animationState === 'IDLE' }
            ]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes glow {
  0%, 100% { box-shadow: 0 0 15px 5px currentColor; transform: scale(1.05); }
  50% { box-shadow: 0 0 5px 2px currentColor; transform: scale(1); }
}
.glowing { animation: glow 3.5s ease-in-out infinite; }
</style>