<script setup lang="ts">
import { computed } from 'vue';

// --- Type Definitions ---
// Define the allowed values for size and color to ensure type safety.
type CircleSize = '2xl' | 'xl' | 'lg' | 'md' | 'sm';
type CircleColor = 'blue' | 'red' | 'green' | 'yellow' | 'cyan';

// Define the "shape" of a single circle object.
interface Circle {
  id: string | number;
  x: number;
  y: number;
  size: CircleSize;
  color: CircleColor;
}

// --- Configuration ---
const GRID_SPACING = 38; // In pixels

// --- Mappings to Tailwind CSS Classes (now strongly typed) ---
// By using Record<Key, Value>, we tell TypeScript exactly what keys to expect.
const sizeClasses: Record<CircleSize, string> = {
  '2xl': 'w-20 h-20',
  'xl': 'w-14 h-14',
  'lg': 'w-10 h-10',
  'md': 'w-6 h-6',
  'sm': 'w-4 h-4',
};

const colorClasses: Record<CircleColor, string> = { blue: 'bg-blue-600', red: 'bg-red-600', green: 'bg-green-900', yellow: 'bg-yellow-400', cyan: 'bg-cyan-500' };


// --- 1. SEED DATA (now strongly typed) ---
// We explicitly type our seed data to catch errors early.
const centerCircle: Circle = { id: 'center', x: 0, y: 0, size: '2xl', color: 'blue' };

// Use `Omit` to create a type for seeds that don't have an `id` yet.
type CircleSeed = Omit<Circle, 'id'>;

const armSeed: CircleSeed[] = [
  { x: 0, y: -1, size: 'xl', color: 'red' },
  { x: 0, y: -2.15, size: 'md', color: 'cyan' },
  { x: 1, y: -3, size: 'md', color: 'green' },
  { x: -1, y: -3, size: 'md', color: 'green' },
  { x: 0, y: -2.9, size: 'md', color: 'red' },
  { x: 0, y: -3.5, size: 'sm', color: 'red' },
  { x: 0, y: -4, size: 'sm', color: 'red' },
];

const quadrantSeed: CircleSeed[] = [
  { x: 1.95, y: -1.15, size: 'lg', color: 'yellow' },
  { x: -1.15, y: 1.95, size: 'lg', color: 'blue' },
];

// --- 2. GENERATION LOGIC ---
const allCircles = computed<Circle[]>(() => {
  // Explicitly type the `circles` array to solve the implicit 'any[]' error.
  const circles: Circle[] = [];
  let idCounter = 1;

  armSeed.forEach(seed => {
    circles.push({ ...seed, id: `arm-${idCounter++}` });
    circles.push({ ...seed, id: `arm-${idCounter++}`, x: -seed.y, y: seed.x });
    circles.push({ ...seed, id: `arm-${idCounter++}`, x: -seed.x, y: -seed.y });
    circles.push({ ...seed, id: `arm-${idCounter++}`, x: seed.y, y: -seed.x });
  });

  quadrantSeed.forEach(seed => {
    circles.push({ ...seed, id: `quad-${idCounter++}` });
    circles.push({ ...seed, id: `quad-${idCounter++}`, x: -seed.x, y: seed.y });
    circles.push({ ...seed, id: `quad-${idCounter++}`, x: -seed.x, y: -seed.y });

    const bottomRightSeed = { ...seed, id: `quad-${idCounter++}`, x: seed.x, y: -seed.y };
    if (seed.x === 3) {
      bottomRightSeed.color = 'red';
    }
    circles.push(bottomRightSeed);
  });

  circles.push(centerCircle);
  
  // Note: The logic below will not find a match with your current seed data,
  // as no circle has x === -3 and y === -3. This is okay, but just be aware.
  const topLeftOuter = circles.find(c => c.x === -3 && c.y === -3);
  if (topLeftOuter) {
      topLeftOuter.color = 'red';
  }

  return circles;
});

// Function to calculate the final CSS position for a circle
// Explicitly type the `circle` parameter.
const getCircleStyle = (circle: Circle) => {
  return {
    transform: `translate(${circle.x * GRID_SPACING}px, ${circle.y * GRID_SPACING}px)`,
  };
};
</script>

<template>
  <div class="relative">
    <div class="absolute top-1/2 left-1/2">
      <div
        v-for="circle in allCircles"
        :key="circle.id"
        :class="[
          'absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out',
          sizeClasses[circle.size],
          colorClasses[circle.color],
        ]"
        :style="getCircleStyle(circle)"
      ></div>
    </div>
  </div>
</template>