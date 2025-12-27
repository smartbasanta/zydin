
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface ChartData {
  label: string;
  value: number;
  change?: number;
  color?: string;
}

interface Props {
  title: string;
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  height?: number;
  showLegend?: boolean;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  showLegend: true,
  animated: true
});

const chartRef = ref<HTMLElement>();

// Generate SVG path for line chart
const generateLinePath = (data: ChartData[], width: number, height: number) => {
  if (data.length === 0) return '';
  
  const maxValue = Math.max(...data.map(d => d.value));
  const stepX = width / (data.length - 1);
  const stepY = height / maxValue;
  
  let path = `M 0 ${height - data[0].value * stepY}`;
  
  for (let i = 1; i < data.length; i++) {
    const x = i * stepX;
    const y = height - data[i].value * stepY;
    path += ` L ${x} ${y}`;
  }
  
  return path;
};

// Generate SVG path for bar chart
const generateBarPath = (data: ChartData[], width: number, height: number, index: number) => {
  if (data.length === 0) return '';
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = width / data.length * 0.8;
  const barX = (width / data.length) * index + (width / data.length - barWidth) / 2;
  const barHeight = (data[index].value / maxValue) * height;
  const barY = height - barHeight;
  
  return `M ${barX} ${barY} L ${barX} ${height} L ${barX + barWidth} ${height} L ${barX + barWidth} ${barY} Z`;
};

// Animation utilities
const animatedStyle = computed(() => {
  if (!props.animated) return {};
  
  return {
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0
  };
});

const chartDimensions = computed(() => ({
  width: '100%',
  height: `${props.height}px`
}));
</script>

<template>
  <div class="financial-chart bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Chart Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    </div>
    
    <!-- Chart Container -->
    <div class="p-6">
      <div 
        ref="chartRef"
        class="chart-container relative"
        :style="chartDimensions"
      >
        <!-- Line Chart -->
        <svg 
          v-if="type === 'line'"
          class="w-full h-full"
          :width="chartDimensions.width"
          :height="chartDimensions.height"
          viewBox="0 0 600 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Grid lines -->
          <g class="grid-lines">
            <line 
              v-for="i in 5" 
              :key="i"
              x1="0" 
              :y1="(300/5) * i" 
              x2="600" 
              :y2="(300/5) * i"
              stroke="#e5e7eb" 
              stroke-width="1"
              opacity="0.3"
            />
          </g>
          
          <!-- Data line -->
          <path
            :d="generateLinePath(data, 600, 300)"
            fill="none"
            stroke="url(#lineGradient)"
            stroke-width="3"
            class="transition-all duration-1000"
          />
          
          <!-- Gradient definition -->
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Data points -->
          <g v-if="data.length > 0">
            <circle
              v-for="(point, index) in data"
              :key="index"
              :cx="(600 / (data.length - 1)) * index"
              :cy="300 - (point.value / Math.max(...data.map(d => d.value))) * 300"
              r="4"
              fill="#3b82f6"
              class="transition-all duration-300 hover:r-6 cursor-pointer"
            />
          </g>
        </svg>
        
        <!-- Bar Chart -->
        <svg 
          v-else-if="type === 'bar'"
          class="w-full h-full"
          :width="chartDimensions.width"
          :height="chartDimensions.height"
          viewBox="0 0 600 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Grid lines -->
          <g class="grid-lines">
            <line 
              v-for="i in 5" 
              :key="i"
              x1="0" 
              :y1="(300/5) * i" 
              x2="600" 
              :y2="(300/5) * i"
              stroke="#e5e7eb" 
              stroke-width="1"
              opacity="0.3"
            />
          </g>
          
          <!-- Bars -->
          <g v-if="data.length > 0">
            <path
              v-for="(bar, index) in data"
              :key="index"
              :d="generateBarPath(data, 600, 300, index)"
              :fill="bar.color || (index % 2 === 0 ? '#3b82f6' : '#10b981')"
              class="transition-all duration-500 hover:opacity-80 cursor-pointer"
            />
          </g>
        </svg>
        
        <!-- Pie Chart -->
        <svg 
          v-else-if="type === 'pie'"
          class="w-full h-full"
          :width="chartDimensions.width"
          :height="chartDimensions.height"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="translate(150, 150)">
            <g v-if="data.length > 0">
              <g
                v-for="(slice, index) in data"
                :key="index"
                class="pie-slice"
              >
                <!-- Simple pie chart representation -->
                <circle
                  cx="0"
                  cy="0"
                  r="100"
                  :fill="slice.color || `hsl(${index * 60}, 70%, 60%)`"
                  :opacity="0.8"
                  class="transition-all duration-300 hover:opacity-100 cursor-pointer"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
      
      <!-- Legend -->
      <div v-if="showLegend && data.length > 0" class="mt-6 flex flex-wrap justify-center gap-4">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="flex items-center space-x-2"
        >
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 60%)` }"
          ></div>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-container {
  animation: fadeInUp 0.6s ease-out forwards;
}

.pie-slice {
  transition: transform 0.3s ease;
}

.pie-slice:hover {
  transform: scale(1.05);
}
</style>

