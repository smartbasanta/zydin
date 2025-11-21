<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, withDefaults, defineProps } from 'vue';

// --- Type Definitions ---
interface TextChar {
  char: string;
  scatterX: number;
  scatterY: number;
  scatterRotate: number;
  animationDelay: number;
}

interface TextWord {
  chars: TextChar[];
  isSpace: boolean;
}

type AnimationPhase = 'HIDDEN' | 'ANIMATING_IN' | 'VISIBLE';
type AnimationType = 'typing' | 'scatter';

// --- Utility Function for Contrast Color ---

/**
 * Determines whether to use black or white text based on the background color.
 * @param hexColor - The background color in hex format (e.g., "#RRGGBB").
 * @returns '#000000' (black) or '#FFFFFF' (white).
 */
const getContrastingColor = (hexColor: string): string => {
  if (!hexColor) return '#000000';

  // Convert hex to RGB
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // Calculate luminance using the YIQ formula
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 128 ? '#000000' : '#FFFFFF';
};


// --- Component Props ---
const props = withDefaults(defineProps<{
  text: string;
  animationType?: AnimationType;
  startDelay?: number;
  repeat?: boolean;
  cycleDuration?: number;
  fontSize?: string;
  fontWeight?: string | number;
  textColor?: string;
  darkTextColor?: string;
  charAnimationDelay?: number;
  wordAnimationDelay?: number;
  scatterIntensity?: number;
  // NEW: Automatic contrast props
  autoColor?: boolean; // If true, automatically sets text color
  backgroundColor?: string; // The background color to contrast against
}>(), {
  animationType: 'scatter',
  startDelay: 500,
  repeat: false,
  cycleDuration: 8000,
  fontSize: '2.5rem',
  fontWeight: '600',
  textColor: 'var(--color-gray-600)',
  darkTextColor: 'var(--color-primary-400)',
  charAnimationDelay: 30,
  wordAnimationDelay: 200,
  scatterIntensity: 150,
  autoColor: false, // Disabled by default
  backgroundColor: 'var(--color-gray-0)', // Default to theme surface
});

// --- Animation Durations ---
const ANIMATE_IN_DURATION = 1500;
const VISIBLE_DURATION = 4000;

// --- Component State ---
const textWords = ref<TextWord[]>([]);
const animationPhase = ref<AnimationPhase>('HIDDEN');
let animationTimeout: number | undefined;

// --- Computed Properties for Dynamic Styling ---
// const effectiveTextColor = computed(() => {
//   if (props.autoColor) {
//     return getContrastingColor(props.backgroundColor);
//   }
//   return props.textColor;
// });

// const effectiveDarkTextColor = computed(() => {
//   if (props.autoColor) {
//     // In auto mode, dark and light text colors are the same
//     return getContrastingColor(props.backgroundColor);
//   }
//   return props.darkTextColor;
// });

const dynamicStyles = computed(() => ({
  '--font-size': props.fontSize,
  '--font-weight': props.fontWeight,
  // '--text-color': effectiveTextColor.value,
  // '--dark-text-color': effectiveDarkTextColor.value,
}));

// --- Animation Logic ---

onMounted(() => {
  let cumulativeDelay = 0;
  const words = props.text.split(' ');
  
  textWords.value = words.flatMap((word, index) => {
    const wordObject: TextWord = {
      chars: word.split('').map(char => {
        const charObject: TextChar = {
          char,
          scatterX: (Math.random() - 0.5) * (props.scatterIntensity * 2),
          scatterY: (Math.random() - 0.5) * (props.scatterIntensity * 2),
          scatterRotate: (Math.random() - 0.5) * 360,
          animationDelay: cumulativeDelay,
        };
        cumulativeDelay += props.charAnimationDelay;
        return charObject;
      }),
      isSpace: false,
    };

    cumulativeDelay += props.wordAnimationDelay;

    if (index < words.length - 1) {
      return [wordObject, { chars: [], isSpace: true }];
    }
    return [wordObject];
  });

  animationTimeout = setTimeout(() => {
    if (props.repeat) {
      runAnimationCycle();
    } else {
      animationPhase.value = 'ANIMATING_IN';
    }
  }, props.startDelay);
});

onUnmounted(() => {
  clearTimeout(animationTimeout);
});

const runAnimationCycle = () => {
  animationPhase.value = 'ANIMATING_IN';

  animationTimeout = setTimeout(() => {
    animationPhase.value = 'VISIBLE';

    animationTimeout = setTimeout(() => {
      animationPhase.value = 'HIDDEN';
      const pauseDuration = props.cycleDuration - ANIMATE_IN_DURATION - VISIBLE_DURATION;
      animationTimeout = setTimeout(runAnimationCycle, Math.max(pauseDuration, 0));
    }, VISIBLE_DURATION);
  }, ANIMATE_IN_DURATION);
};

const getCharStyle = (char: TextChar) => {
  let transform = 'translate(0, 0) rotate(0)';
  let opacity = '1';

  if (animationPhase.value === 'HIDDEN') {
    if (props.animationType === 'scatter') {
      transform = `translate(${char.scatterX}px, ${char.scatterY}px) rotate(${char.scatterRotate}deg)`;
    }
    opacity = '0';
  }

  return {
    transform,
    opacity,
    transitionDelay: `${char.animationDelay}ms`,
  };
};
</script>

<template>
  <div class="fixed top-1/2 left-0 z-[100] -translate-y-1/2">
    <div
      class="flex [writing-mode:vertical-rl]  [text-orientation:mixed] tracking-[0.5rem] whitespace-nowrap"
      :style="dynamicStyles"
      :aria-label="text"
    >
      <span
        class="inline-block text-secondary-1200 dark:text-pink-950"
        :style="{ fontSize: 'var(--font-size)', fontWeight: 'var(--font-weight)' }"
      >
        <span
          v-for="(word, wordIndex) in textWords"
          :key="wordIndex"
          class="inline-block"
        >
          <span v-if="word.isSpace">&nbsp;</span>
          <span
            v-else
            v-for="(char, charIndex) in word.chars"
            :key="charIndex"
            :class="[
              'inline-block transition-all duration-1000 ease-out',
              'text-[var(--text-color)] dark:text-[var(--dark-text-color)]'
            ]"
            :style="getCharStyle(char)"
          >
            {{ char.char }}
          </span>
        </span>
      </span>
    </div>
  </div>
</template>