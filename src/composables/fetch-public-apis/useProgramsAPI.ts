import { ref, reactive, watch } from 'vue';
import type { ApiResponse } from '@/types/api';
import { apiService } from '@/services/api.service';

// Define the shape of the filter options
interface ProgramFilters {
  search: string;
  status: string[];
  category: string[];
  timeline: string[];
}

export interface Program {
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
  // Computed properties for frontend
  progress?: number;
  statusType?: 'completed' | 'in-progress' | 'planned';
  is_active?: boolean;
}

export function useProgramsAPI() {
  // State for the list of programs
  const programs = ref<Program[]>([]);
  const pagination = ref({});

  // State for a single program detail view
  const program = ref<Program | null>(null);

  // State for available filter options
  const availableFilters = ref({
    categories: [] as string[],
    statuses: [] as string[],
    timelines: [] as string[]
  });

  // State for program statistics
  const programStats = ref({
    total: 0,
    completed: 0,
    in_progress: 0,
    planned: 0,
    average_progress: 0
  });

  // Reactive object for the user's current filter selections
  const activeFilters = reactive<ProgramFilters>({
    search: '',
    status: [],
    category: [],
    timeline: []
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchPrograms = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // Filter out empty values from the filters object before sending
      const params: Record<string, any> = {};
      
      if (activeFilters.search) {
        params.search = activeFilters.search;
      }
      
      if (activeFilters.status.length > 0) {
        params.status = activeFilters.status;
      }
      
      if (activeFilters.category.length > 0) {
        params.category = activeFilters.category;
      }
      
      if (activeFilters.timeline.length > 0) {
        params.timeline = activeFilters.timeline;
      }

      const response = await apiService.get<ApiResponse>('/public/programs', { params });
      programs.value = response.data.programs || [];
      
      // Extract statistics from backend
      if (response.data.stats) {
        programStats.value = {
          total: response.data.stats.total || 0,
          completed: response.data.stats.completed || 0,
          in_progress: response.data.stats.in_progress || 0,
          planned: response.data.stats.planned || 0,
          average_progress: response.data.stats.average_progress || 0
        };
      }
      
      // Extract filter options from backend
      if (response.data.filters) {
        availableFilters.value = {
          categories: response.data.filters.categories || [],
          statuses: response.data.filters.statuses || [],
          timelines: response.data.filters.timelines || []
        };
      }
      
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch programs';
      console.error('Error fetching programs:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProgramById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    program.value = null;
    try {
      const response = await apiService.get<ApiResponse>(`/public/programs/${id}`);
      program.value = response.data.program;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch program';
      console.error('Error fetching program:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const resetFilters = () => {
    activeFilters.search = '';
    activeFilters.status = [];
    activeFilters.category = [];
    activeFilters.timeline = [];
    fetchPrograms(); // Refetch after resetting
  };

  // Watch for changes in filters and automatically refetch data
  watch(activeFilters, () => {
    fetchPrograms();
  }, { deep: true });

  return {
    programs,
    program,
    pagination,
    availableFilters,
    programStats,
    activeFilters,
    isLoading,
    error,
    fetchPrograms,
    fetchProgramById,
    resetFilters,
  };
}
