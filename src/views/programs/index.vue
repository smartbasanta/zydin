
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { 
  TrendingUp,
  Users,
  Award,
  Target,
  ArrowRight,
  BarChart3,
  Building,
  Globe2
} from 'lucide-vue-next';
import ProgramCard from '@/components/programs/ProgramCard.vue';
import ProgramFilter from '@/components/programs/ProgramFilter.vue';
import SectionDivider from '@/views/homepage/partials/SectionDivider.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useProgramsAPI, type Program } from '@/composables/fetch-public-apis/useProgramsAPI';

const {
  programs,
  programStats,
  isLoading: loading,
  error,
  availableFilters,
  activeFilters,
  fetchPrograms,
  resetFilters
} = useProgramsAPI();

// Enhanced program data - now database-driven
const enhancedPrograms = computed(() => {
  return programs.value.map(program => ({
    ...program,
    // Use database fields directly, no computed fallbacks needed
    statusType: program.status_type,
    is_active: program.status
  }));
});

// Filter logic - now database-driven
const filteredPrograms = computed(() => {
  let filtered = [...enhancedPrograms.value];
  
  // Search filter
  if (activeFilters.search) {
    const search = activeFilters.search.toLowerCase();
    filtered = filtered.filter(program => 
      program.title.toLowerCase().includes(search) ||
      program.description.toLowerCase().includes(search) ||
      (program.category?.toLowerCase().includes(search) || false)
    );
  }
  
  // Status filter
  if (activeFilters.status.length > 0) {
    filtered = filtered.filter(program => 
      activeFilters.status.includes(program.statusType || 'in-progress')
    );
  }
  
  // Category filter
  if (activeFilters.category.length > 0) {
    filtered = filtered.filter(program => 
      program.category && activeFilters.category.includes(program.category)
    );
  }
  
  return filtered.sort((a, b) => a.order - b.order);
});

// Get unique categories and statuses for filters - database-driven
const availableCategories = computed(() => 
  [...new Set(enhancedPrograms.value.map(p => p.category).filter(Boolean))]
);

const availableStatuses = computed(() => 
  [...new Set(enhancedPrograms.value.map(p => p.statusType).filter(Boolean))]
);

const availableTimelines = computed(() => 
  [...new Set(enhancedPrograms.value.map(p => p.timeline).filter(Boolean))]
);

// Statistics - now using database-driven data
const stats = computed(() => ({
  total: programStats.value.total,
  completed: programStats.value.completed,
  inProgress: programStats.value.in_progress,
  avgProgress: programStats.value.average_progress
}));

// Fetch programs when component is mounted
onMounted(() => {
  fetchPrograms();
});
</script>

<template>
  <div class="programs-page-shell">
    <!-- Enhanced Hero Section -->
    <section class="relative overflow-hidden py-24 lg:py-32">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-5xl mx-auto">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
            <Target class="w-4 h-4 mr-2" />
            Innovation Pipeline
          </div>
          
          <!-- Main Heading -->
          <h1 class="text-5xl lg:text-7xl font-bold section-title mb-8 leading-tight">
            Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Programs</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl lg:text-2xl section-text mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover Zydin Biotech's comprehensive programs designed to advance oncology healthcare, 
            pharmaceutical innovation, and contribute to Nepal's emergence as a regional pharmaceutical hub.
          </p>
          
          <!-- Stats Row -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats.total }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Programs</div>
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.completed }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats.inProgress }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ stats.avgProgress }}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Avg Progress</div>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink 
              to="/contact" 
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Users class="w-5 h-5 mr-2" />
              Partner With Us
              <ArrowRight class="w-5 h-5 ml-2" />
            </RouterLink>
            <RouterLink 
              to="/about" 
              class="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
            >
              <Building class="w-5 h-5 mr-2" />
              About Our Vision
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <SectionDivider variant="wave" accent="primary" />

    <!-- Programs Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold section-title mb-6">
            Program <span class="text-blue-600 dark:text-blue-400">Portfolio</span>
          </h2>
          <p class="text-xl section-title max-w-3xl mx-auto">
            Our strategic initiatives span across regulatory approvals, manufacturing excellence, 
            product development, and social responsibility.
          </p>
        </div>

        <!-- Filters -->
        <div class="flex justify-center mb-12">
          <ProgramFilter 
            v-model="activeFilters"
            :categories="availableFilters.categories"
            :statuses="availableFilters.statuses"
            :timelines="availableFilters.timelines"
          />
        </div>

        <!-- Loading State -->
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-screen">
          <LoadingState message="Loading Programs..." />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-600 dark:text-red-400 mb-6">
            <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg">{{ error }}</p>
          <button 
            @click="fetchPrograms"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Programs Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProgramCard 
            v-for="(program, index) in filteredPrograms" 
            :key="program.id"
            :program="program"
            :index="index"
          />
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && filteredPrograms.length === 0" class="text-center py-20">
          <div class="text-gray-400 dark:text-gray-600 mb-6">
            <BarChart3 class="mx-auto h-16 w-16" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No programs found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more results.</p>
        </div>

        <!-- Enhanced Call to Action -->
        <div class="mt-20">
          <div class="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-3xl p-12 text-white overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 60px 60px;"></div>
            </div>
            
            <div class="relative z-10 text-center max-w-4xl mx-auto">
              <div class="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-blue-100 text-sm font-medium mb-6">
                <Globe2 class="w-4 h-4 mr-2" />
                Global Impact Initiative
              </div>
              
              <h2 class="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Shape the Future of Oncology?
              </h2>
              
              <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join us in revolutionizing cancer treatment and establishing Nepal as a leading 
                pharmaceutical hub through innovative programs and strategic partnerships.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <RouterLink 
                  to="/contact" 
                  class="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  <Users class="w-5 h-5 mr-2" />
                  Start Partnership
                </RouterLink>
                <RouterLink 
                  to="/investor-relations" 
                  class="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  <TrendingUp class="w-5 h-5 mr-2" />
                  Investor Resources
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

  @keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #10b981);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #059669);
}

.programs-page-shell {
  background-color: var(--section-bg);
  color: var(--section-title-color);
  min-height: 100vh;
}
</style>

