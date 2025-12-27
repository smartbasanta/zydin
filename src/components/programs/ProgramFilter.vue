
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Search,
  Filter,
  X,
  CheckCircle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next';

interface FilterOptions {
  search: string;
  status: string[];
  category: string[];
  timeline: string[];
}

interface Props {
  modelValue: FilterOptions;
  categories: string[];
  statuses: string[];
  timelines: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: FilterOptions];
  'clear': [];
}>();

const isOpen = ref(false);
const showAdvanced = ref(false);

// Local filter state
const localFilters = ref<FilterOptions>({
  search: props.modelValue.search || '',
  status: [...(props.modelValue.status || [])],
  category: [...(props.modelValue.category || [])],
  timeline: [...(props.modelValue.timeline || [])]
});

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  localFilters.value = { ...newValue };
}, { deep: true });

// Emit filter changes
watch(localFilters, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

const toggleStatus = (status: string) => {
  const index = localFilters.value.status.indexOf(status);
  if (index > -1) {
    localFilters.value.status.splice(index, 1);
  } else {
    localFilters.value.status.push(status);
  }
};

const toggleCategory = (category: string) => {
  const index = localFilters.value.category.indexOf(category);
  if (index > -1) {
    localFilters.value.category.splice(index, 1);
  } else {
    localFilters.value.category.push(category);
  }
};

const toggleTimeline = (timeline: string) => {
  const index = localFilters.value.timeline.indexOf(timeline);
  if (index > -1) {
    localFilters.value.timeline.splice(index, 1);
  } else {
    localFilters.value.timeline.push(timeline);
  }
};

const clearFilters = () => {
  localFilters.value = {
    search: '',
    status: [],
    category: [],
    timeline: []
  };
  emit('clear');
};

const getActiveFiltersCount = computed(() => {
  return localFilters.value.status.length + 
         localFilters.value.category.length + 
         localFilters.value.timeline.length;
});

const hasActiveFilters = computed(() => getActiveFiltersCount.value > 0);
</script>

<template>
  <div class="relative">
    <!-- Filter Toggle Button -->
    <button 
      @click="isOpen = !isOpen"
      class="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <Filter class="w-5 h-5 mr-2" />
      Filters
      <span v-if="getActiveFiltersCount > 0" class="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
        {{ getActiveFiltersCount }}
      </span>
      <ChevronDown class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Filter Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filter Programs</h3>
          <div class="flex items-center space-x-2">
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Clear All
            </button>
            <button 
              @click="isOpen = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            v-model="localFilters.search"
            type="text"
            placeholder="Search programs..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <div class="px-6 py-2">
        <button 
          @click="showAdvanced = !showAdvanced"
          class="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
        >
          Advanced Filters
          <ChevronDown class="w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': showAdvanced }" />
        </button>
      </div>

      <!-- Advanced Filters -->
      <div v-if="showAdvanced" class="px-6 pb-6 space-y-6">
        <!-- Status Filter -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Status</h4>
          <div class="space-y-2">
            <label 
              v-for="status in props.statuses" 
              :key="status"
              class="flex items-center"
            >
              <input 
                type="checkbox"
                :checked="localFilters.status.includes(status)"
                @change="toggleStatus(status)"
                class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <component :is="status === 'completed' ? CheckCircle : Clock" class="w-4 h-4 mr-2" />
                {{ status.replace('-', ' ').toUpperCase() }}
              </span>
            </label>
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Category</h4>
          <div class="space-y-2">
            <label 
              v-for="category in props.categories" 
              :key="category"
              class="flex items-center"
            >
              <input 
                type="checkbox"
                :checked="localFilters.category.includes(category)"
                @change="toggleCategory(category)"
                class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ category }}</span>
            </label>
          </div>
        </div>

        <!-- Timeline Filter -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Timeline</h4>
          <div class="space-y-2">
            <label 
              v-for="timeline in props.timelines" 
              :key="timeline"
              class="flex items-center"
            >
              <input 
                type="checkbox"
                :checked="localFilters.timeline.includes(timeline)"
                @change="toggleTimeline(timeline)"
                class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <Calendar class="w-4 h-4 mr-2" />
                {{ timeline }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @reference "@/assets/css/main.css";
/* Custom checkbox styling */
input[type="checkbox"] {
  @apply appearance-none w-4 h-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0;
}

input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Smooth dropdown animation */
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

