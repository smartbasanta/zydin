<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, defineProps } from 'vue';

// --- Component Props ---
const props = defineProps({
  glow: { type: Boolean, default: false },
  interactionType: {
    type: String as () => 'repel' | 'follow',
    default: 'repel',
  },
  size: { type: Number, default: null },
  // NEW: Physics props for fine-tuning the animation "feel"
  friction: { type: Number, default: 0.88 }, // How quickly circles slow down (0-1). Lower is more friction.
  ambientSpeed: { type: Number, default: 0.004 }, // The speed of the gentle background drift.
  mouseInteractionRadius: { type: Number, default: 180 }, // The "bubble" around the mouse that affects circles.
  mouseRepelStrength: { type: Number, default: 5 }, // The force multiplier for the 'repel' effect.
  mouseFollowStrength: { type: Number, default: 0.06 }, // The strength of the attraction in 'follow' mode.
});

// --- Type Definitions ---
interface Circle {
  id: string | number;
  x: number;
  y: number;
  size: CircleSize;
  color: CircleColor;
}
interface CircleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}
type CircleSize = '2xl' | 'xl' | 'lg' | 'md' | 'sm';
type CircleColor = 'blue' | 'red' | 'green' | 'yellow' | 'cyan';

// --- Component State ---
const containerRef = ref<HTMLElement | null>(null);
const dynamicSize = ref(450);
const mouse = ref({ x: 9999, y: 9999, isDown: false });
const circleStates = ref<Map<string | number, CircleState>>(new Map());
let animationFrameId: number;

// --- Computed Properties for Sizing ---
const effectiveSize = computed(() => props.size ?? dynamicSize.value);
const scaleFactor = computed(() => effectiveSize.value / 10);

// --- Mappings (unchanged) ---
const sizeFactors: Record<CircleSize, number> = { '2xl': 2.1, 'xl': 1.5, 'lg': 1.0, 'md': 0.6, 'sm': 0.4 };
const colorClasses: Record<CircleColor, string> = { blue: 'bg-blue-600', red: 'bg-red-600', green: 'bg-green-900', yellow: 'bg-yellow-400', cyan: 'bg-cyan-500' };
const textColorClasses: Record<CircleColor, string> = { blue: 'text-blue-600', red: 'text-red-600', green: 'text-green-900', yellow: 'text-yellow-400', cyan: 'text-cyan-500' };

// --- Seed Data & Generation (unchanged) ---
type CircleSeed = Omit<Circle, 'id'>;
const centerCircleSeed: CircleSeed = { x: 0, y: 0, size: '2xl', color: 'blue' };
const armSeed: CircleSeed[] = [{ x: 0, y: -1, size: 'xl', color: 'red' }, { x: 0, y: -2.15, size: 'md', color: 'cyan' }, { x: 1, y: -3, size: 'md', color: 'green' }, { x: -1, y: -3, size: 'md', color: 'green' }, { x: 0, y: -2.9, size: 'md', color: 'red' }, { x: 0, y: -3.5, size: 'sm', color: 'red' }, { x: 0, y: -4, size: 'sm', color: 'red' }];
const quadrantSeed: CircleSeed[] = [{ x: 1.95, y: -1.15, size: 'lg', color: 'yellow' }, { x: -1.15, y: 1.95, size: 'lg', color: 'blue' }];

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
    //     finalCircles.set(`${seed.x},${seed.y}`, { ...seed, id: `${seed.x},${seed.y}` });
    //     finalCircles.set(`${-seed.x},${seed.y}`, { ...seed, id: `${-seed.x},${seed.y}`, x: -seed.x, y: seed.y });
    //     finalCircles.set(`${-seed.x},${-seed.y}`, { ...seed, id: `${-seed.x},${-seed.y}`, x: -seed.x, y: -seed.y });
    //     finalCircles.set(`${seed.x},${-seed.y}`, { ...seed, id: `${seed.x},${-seed.y}`, x: seed.x, y: -seed.y });
    // });
    finalCircles.set('center', { ...centerCircleSeed, id: 'center' });
    return Array.from(finalCircles.values());
});

// --- Physics & Animation Loop ---
const updatePhysics = () => {
  const halfSize = effectiveSize.value / 2;
  const newStates = new Map<string | number, CircleState>();

  for (const circle of allCircles.value) {
    let state = circleStates.value.get(circle.id);
    if (!state) continue;

    let { x, y, vx, vy, targetX, targetY } = state;

    // 1. Ambient Movement
    const distToTarget = Math.hypot(targetX - x, targetY - y);
    if (distToTarget < 20) {
      targetX = (Math.random() - 0.5) * effectiveSize.value;
      targetY = (Math.random() - 0.5) * effectiveSize.value;
    }
    vx += (targetX - x) * props.ambientSpeed; // Use prop
    vy += (targetY - y) * props.ambientSpeed; // Use prop
    
    // 2. Mouse Interaction
    const dx = x - mouse.value.x;
    const dy = y - mouse.value.y;
    const distance = Math.hypot(dx, dy);

    if (props.interactionType === 'repel' && distance < props.mouseInteractionRadius) {
      const force = (props.mouseInteractionRadius - distance) / props.mouseInteractionRadius;
      vx += (dx / distance) * force * props.mouseRepelStrength; // Use prop
      vy += (dy / distance) * force * props.mouseRepelStrength; // Use prop
    } else if (props.interactionType === 'follow' && mouse.value.isDown) {
      vx -= dx * props.mouseFollowStrength; // Use prop
      vy -= dy * props.mouseFollowStrength; // Use prop
    }
    
    // 3. Bounding
    if (Math.abs(x) > halfSize) vx -= Math.sign(x) * 0.1;
    if (Math.abs(y) > halfSize) vy -= Math.sign(y) * 0.1;

    // 4. Apply friction & update
    vx *= props.friction; // Use prop
    vy *= props.friction; // Use prop
    x += vx;
    y += vy;
    
    newStates.set(circle.id, { x, y, vx, vy, targetX, targetY });
  }
  
  circleStates.value = newStates;
  animationFrameId = requestAnimationFrame(updatePhysics);
};


// --- Event Handlers and Lifecycle hooks (mostly unchanged) ---
const handleMouseMove = (event: MouseEvent) => {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  mouse.value.x = event.clientX - centerX;
  mouse.value.y = event.clientY - centerY;
};
const handleMouseDown = () => { mouse.value.isDown = true; };
const handleMouseUp = () => { mouse.value.isDown = false; };
const handleMouseLeave = () => { mouse.value.isDown = false; mouse.value.x = 9999; };

const glowingCircles = ref(new Set<string | number>());
let glowInterval: number | undefined;
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

let resizeObserver: ResizeObserver;
onMounted(() => {
  const initialStates = new Map();
  for (const circle of allCircles.value) {
    initialStates.set(circle.id, {
      x: (Math.random() - 0.5) * effectiveSize.value,
      y: (Math.random() - 0.5) * effectiveSize.value,
      vx: 0, vy: 0,
      targetX: (Math.random() - 0.5) * effectiveSize.value,
      targetY: (Math.random() - 0.5) * effectiveSize.value,
    });
  }
  circleStates.value = initialStates;

  if (containerRef.value && props.size === null) {
      resizeObserver = new ResizeObserver(entries => {
        dynamicSize.value = Math.min(entries[0].contentRect.width, entries[0].contentRect.height);
      });
      resizeObserver.observe(containerRef.value);
  }
  
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  containerRef.value?.addEventListener('mouseleave', handleMouseLeave);

  if (props.glow) startGlowEffect();
  updatePhysics();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  clearInterval(glowInterval);
  if (resizeObserver) resizeObserver.disconnect();
  
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
  containerRef.value?.removeEventListener('mouseleave', handleMouseLeave);
});

// --- Dynamic Style Calculation (unchanged) ---
const getCircleSizeStyle = (circle: Circle) => {
  const size = scaleFactor.value * sizeFactors[circle.size];
  return { width: `${size}px`, height: `${size}px` };
};

const getWrapperStyle = (circle: Circle) => {
  const state = circleStates.value.get(circle.id);
  if (!state) return { transform: 'translate(0px, 0px)' };
  
  return {
    transform: `translate(${state.x}px, ${state.y}px)`,
  };
};
</script>

<template>
  <div ref="containerRef" class="relative w-full h-full cursor-pointer">
    <div 
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
      :style="{ width: `${effectiveSize}px`, height: `${effectiveSize}px` }"
    >
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
              { 'glowing': glowingCircles.has(circle.id) }
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