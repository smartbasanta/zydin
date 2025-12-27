
<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { 
  ShieldCheck, 
  Building2, 
  Beaker,
  Cpu,
  Globe,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-vue-next';

interface Program {
  id: number;
  title: string;
  description: string;
  details: string;
  icon: string;
  category: string | null;
  impact_description: string | null;
  progress_percentage: number;
  timeline: string | null;
  start_date: string | null;
  end_date: string | null;
  status_type: 'completed' | 'in-progress' | 'planned';
  theme_colors: Record<string, string> | null;
  icon_component: string | null;
  completion_percentage: number;
  is_featured: boolean;
  order: number;
  status: boolean;
}

interface Props {
  program: Program;
  index: number;
}

const props = defineProps<Props>();

const isHovered = ref(false);

const iconComponents = {
  ShieldCheckIcon: ShieldCheck,
  BuildingOfficeIcon: Building2,
  BeakerIcon: Beaker,
  CpuChipIcon: Cpu,
  GlobeAltIcon: Globe,
  HeartIcon: Heart
};

const getIconComponent = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || ShieldCheck;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'from-green-500 to-emerald-500';
    case 'in-progress':
      return 'from-blue-500 to-cyan-500';
    case 'planned':
      return 'from-purple-500 to-indigo-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'in-progress':
      return Clock;
    default:
      return Clock;
  }
};

const cardAnimation = computed(() => ({
  transform: isHovered.value ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
  opacity: isHovered.value ? 1 : 0.95,
}));
</script>

<template>
  <div 
    class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
    :style="cardAnimation"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"

  >
    <!-- Animated Background Gradient -->
    <div class="absolute inset-0 bg-section-bg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
    
    <!-- Floating Particles Effect -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="i in 6" 
        :key="i"
        class="absolute w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-700"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 2 + 's',
          animation: 'float 3s ease-in-out infinite'
        }"
      ></div>
    </div>

    <!-- Status Badge -->
    <div class="absolute top-4 right-4 z-20">
      <div :class="`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getStatusColor(program.status_type)}`">
        <component :is="getStatusIcon(program.status_type)" class="w-3 h-3 mr-1" />
        {{ program.status_type.replace('-', ' ').toUpperCase() }}
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 p-8">
      <!-- Icon Section -->
      <div class="flex justify-center mb-6 transform transition-transform duration-500 group-hover:scale-110">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
          <div class="relative p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
            <component :is="getIconComponent(program.icon)" class="w-8 h-8" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="text-center space-y-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {{ program.title }}
        </h3>
        
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {{ program.description }}
        </p>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${program.progress_percentage}%` }"
          ></div>
        </div>
        
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Progress: {{ program.progress_percentage }}%</span>
          <span>{{ program.timeline }}</span>
        </div>

        <!-- View Details Link -->
        <RouterLink 
          :to="`/programs/${program.id}`"
          class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
        >
          View Details
          <ArrowRight class="w-4 h-4 ml-1 transition-transform duration-200" />
        </RouterLink>
      </div>
    </div>



    <!-- Decorative Bottom Border -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 group-hover:from-blue-600 group-hover:via-blue-700 group-hover:to-green-600 transition-all duration-300"></div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(120deg); }
  66% { transform: translateY(5px) rotate(240deg); }
}
</style>

